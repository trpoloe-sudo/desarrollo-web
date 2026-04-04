import { existsSync, readFileSync, rmSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const pidFile = path.join(rootDir, ".dev-all-pids.json");
const knownPorts = [5173, 3001];
const isDryRun = process.argv.includes("--dry-run");

const unique = (values) => [...new Set(values.filter(Boolean))];

const runCommand = (command, args) =>
  spawnSync(command, args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });

const getTrackedPids = () => {
  if (!existsSync(pidFile)) {
    return [];
  }

  try {
    const data = JSON.parse(readFileSync(pidFile, "utf8"));
    return unique(data?.trackedChildren?.map((child) => Number(child.pid)));
  } catch (error) {
    console.warn(`Could not read ${path.basename(pidFile)}: ${error.message}`);
    return [];
  }
};

const getPidsByPortWindows = (port) => {
  const result = runCommand("netstat", ["-ano", "-p", "tcp"]);

  if (result.status !== 0) {
    return [];
  }

  return unique(
    result.stdout
      .split(/\r?\n/)
      .filter((line) => line.includes(`:${port}`) && line.includes("LISTENING"))
      .map((line) => line.trim().split(/\s+/).at(-1))
      .map((pid) => Number(pid)),
  );
};

const getPidsByPortPosix = (port) => {
  const result = runCommand("lsof", ["-n", `-iTCP:${port}`, "-sTCP:LISTEN", "-t"]);

  if (result.status !== 0) {
    return [];
  }

  return unique(
    result.stdout
      .split(/\r?\n/)
      .filter(Boolean)
      .map((pid) => Number(pid)),
  );
};

const getPidsByPort = (port) =>
  process.platform === "win32" ? getPidsByPortWindows(port) : getPidsByPortPosix(port);

const killPid = (pid) => {
  if (!pid || pid === process.pid) {
    return false;
  }

  if (process.platform === "win32") {
    const result = runCommand("taskkill", ["/PID", String(pid), "/T", "/F"]);
    return result.status === 0 || /not found|no instance/i.test(result.stdout + result.stderr);
  }

  try {
    process.kill(pid, "SIGTERM");
    return true;
  } catch (error) {
    return error.code === "ESRCH";
  }
};

const trackedPids = getTrackedPids();
const portPids = knownPorts.flatMap((port) => getPidsByPort(port));
const pidsToKill = unique([...trackedPids, ...portPids]);

if (pidsToKill.length === 0) {
  console.log("No dev processes found on ports 5173 or 3001.");
  rmSync(pidFile, { force: true });
  process.exit(0);
}

const actionLabel = isDryRun ? "Would stop dev processes" : "Stopping dev processes";
console.log(`${actionLabel}: ${pidsToKill.join(", ")}`);

if (isDryRun) {
  process.exit(0);
}

const failedPids = pidsToKill.filter((pid) => !killPid(pid));
rmSync(pidFile, { force: true });

if (failedPids.length > 0) {
  console.error(`Could not stop these processes: ${failedPids.join(", ")}`);
  process.exit(1);
}

console.log("Frontend and backend stopped.");
