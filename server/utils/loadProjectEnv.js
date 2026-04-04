import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const baseDir = path.dirname(fileURLToPath(import.meta.url));
const serverDir = path.resolve(baseDir, "..");
const projectDir = path.resolve(serverDir, "..");

const candidateFiles = [
  path.join(projectDir, ".env"),
  path.join(projectDir, ".env.local"),
  path.join(serverDir, ".env"),
  path.join(serverDir, ".env.local"),
];

const stripQuotes = (value) => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
};

const parseEnvFile = (filePath) => {
  const values = {};
  const source = fs.readFileSync(filePath, "utf8");

  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const separatorIndex = line.indexOf("=");
    if (separatorIndex <= 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    const value = stripQuotes(line.slice(separatorIndex + 1).trim());

    if (key) {
      values[key] = value;
    }
  }

  return values;
};

export const loadProjectEnv = () => {
  const mergedValues = {};

  for (const filePath of candidateFiles) {
    if (!fs.existsSync(filePath)) continue;
    Object.assign(mergedValues, parseEnvFile(filePath));
  }

  for (const [key, value] of Object.entries(mergedValues)) {
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
};
