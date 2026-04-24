import { spawn } from "node:child_process";
import { rmSync, writeFileSync } from "node:fs";
import net from "node:net";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const rootDir = path.dirname(fileURLToPath(new URL("../package.json", import.meta.url)));
const serverDir = path.join(rootDir, "server");
const pidFile = path.join(rootDir, ".dev-all-pids.json");
const npmExecPath = process.env.npm_execpath;
const nodeExecPath = process.execPath;

const children = [];
let isShuttingDown = false;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const forwardStream = (stream, writer, label) => {
  stream.on("data", (chunk) => {
    writer.write(`[${label}] ${chunk}`);
  });
};

const isPortListening = async (port, host) =>
  new Promise((resolve) => {
    const socket = net.createConnection({ port, host });

    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });

    socket.once("error", () => {
      socket.destroy();
      resolve(false);
    });
  });

const ensurePortAvailable = async (port, label) => {
  const hosts = ["127.0.0.1", "::1"];

  for (const host of hosts) {
    if (await isPortListening(port, host)) {
      console.error(
        `[${label}] Port ${port} is already in use on ${host}. Run npm run stop:all or stop the existing process before running npm run dev:all again.`,
      );
      process.exit(1);
    }
  }
};

const persistChildren = () => {
  const trackedChildren = children
    .filter((child) => child.pid)
    .map(({ label, pid, port, cwd }) => ({
      label,
      pid,
      port,
      cwd,
    }));

  writeFileSync(
    pidFile,
    JSON.stringify(
      {
        rootDir,
        trackedChildren,
        updatedAt: new Date().toISOString(),
      },
      null,
      2,
    ),
    "utf8",
  );
};

const clearPidFile = () => {
  rmSync(pidFile, { force: true });
};

const createNpmRunner = (args) => {
  if (!npmExecPath) {
    return {
      command: "npm",
      args,
      options: {
        shell: true,
      },
    };
  }

  return {
    command: nodeExecPath,
    args: [npmExecPath, ...args],
    options: {
      shell: false,
    },
  };
};

const spawnProcess = (label, command, args, cwd, port, extraOptions = {}) => {
  const child = spawn(command, args, {
    cwd,
    env: process.env,
    stdio: ["inherit", "pipe", "pipe"],
    ...extraOptions,
  });

  forwardStream(child.stdout, process.stdout, label);
  forwardStream(child.stderr, process.stderr, label);

  child.on("exit", (code, signal) => {
    if (!isShuttingDown) {
      const detail = signal ? `signal ${signal}` : `code ${code ?? 0}`;
      console.error(`[${label}] exited with ${detail}`);
      shutdown(code ?? 1);
    }
  });

  child.on("error", (error) => {
    console.error(`[${label}] failed to start: ${error.message}`);
    shutdown(1);
  });

  child.label = label;
  child.port = port;
  child.cwd = cwd;

  children.push(child);
  persistChildren();
};

const shutdown = (exitCode = 0) => {
  if (isShuttingDown) return;
  isShuttingDown = true;
  clearPidFile();

  for (const child of children) {
    if (child.exitCode !== null || child.killed) continue;

    if (process.platform === "win32") {
      spawn(`taskkill /pid ${child.pid} /T /F`, {
        shell: true,
        stdio: "ignore",
      });
    } else {
      child.kill("SIGTERM");
    }
  }

  setTimeout(() => process.exit(exitCode), 500);
};

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("Starting frontend on http://localhost:5173 and backend on http://localhost:3001");

clearPidFile();
await ensurePortAvailable(5173, "frontend");
await ensurePortAvailable(3001, "backend");
await wait(100);

const frontendRunner = createNpmRunner(["run", "dev", "--", "--strictPort"]);
const backendRunner = createNpmRunner(["run", "dev"]);

spawnProcess(
  "frontend",
  frontendRunner.command,
  frontendRunner.args,
  rootDir,
  5173,
  frontendRunner.options,
);
spawnProcess(
  "backend",
  backendRunner.command,
  backendRunner.args,
  serverDir,
  3001,
  backendRunner.options,
);
