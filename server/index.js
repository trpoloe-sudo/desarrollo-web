import express from "express";
import cors from "cors";
import morgan from "morgan";
import { existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRouter from "./routes/auth.js";
import catalogRouter from "./routes/catalog.js";
import tasksRouter from "./routes/tasks.js";
import { loadProjectEnv } from "./utils/loadProjectEnv.js";

const app = express();
const serverDir = path.dirname(fileURLToPath(import.meta.url));
const projectDir = path.resolve(serverDir, "..");
const distDir = path.join(projectDir, "dist");
const distIndexPath = path.join(distDir, "index.html");
const hasStaticBuild = existsSync(distIndexPath);

const normalizeOrigin = (origin) => String(origin || "").trim().replace(/\/$/, "");
const buildOriginFromHostname = (hostname) => {
  const normalizedHostname = String(hostname || "").trim().toLowerCase();

  if (!normalizedHostname) {
    return "";
  }

  return normalizeOrigin(`https://${normalizedHostname}`);
};
const deriveStaticOrigin = (origin) => {
  try {
    const url = new URL(origin);

    if (url.hostname.endsWith("-static.onrender.com")) {
      return url.origin;
    }

    if (!url.hostname.endsWith(".onrender.com")) {
      return "";
    }

    const serviceName = url.hostname.slice(0, -".onrender.com".length);

    if (!serviceName) {
      return "";
    }

    return `https://${serviceName}-static.onrender.com`;
  } catch {
    return "";
  }
};

loadProjectEnv();
app.set("trust proxy", 1);

const frontendOrigin = normalizeOrigin(process.env.FRONTEND_ORIGIN);
const renderExternalOrigin =
  normalizeOrigin(process.env.RENDER_EXTERNAL_URL) ||
  buildOriginFromHostname(process.env.RENDER_EXTERNAL_HOSTNAME);
const derivedStaticOrigin = deriveStaticOrigin(renderExternalOrigin);
const preferredFrontendOrigin = frontendOrigin || derivedStaticOrigin;

const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    frontendOrigin,
    derivedStaticOrigin,
    process.env.CLIENT_ORIGIN,
    process.env.CORS_ORIGIN,
    renderExternalOrigin,
    ...(process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ]
    .map(normalizeOrigin)
    .filter(Boolean)
);

const corsOptions = {
  origin(origin, callback) {
    const normalizedOrigin = normalizeOrigin(origin);

    if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(normalizedOrigin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/auth", authRouter);
app.use("/api/catalog", catalogRouter);
app.use("/api/tasks", tasksRouter);

if (preferredFrontendOrigin) {
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    const targetUrl = new URL(req.originalUrl || req.url || "/", `${preferredFrontendOrigin}/`);
    return res.redirect(302, targetUrl.toString());
  });
} else if (hasStaticBuild) {
  app.use(express.static(distDir));

  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api/")) {
      return next();
    }

    return res.sendFile(distIndexPath);
  });
}

app.use((error, req, res, next) => {
  if (error?.message === "Not allowed by CORS") {
    return res.status(403).json({ error: error.message });
  }

  return next(error);
});

app.use((req, res) => {
  if (!req.path.startsWith("/api/")) {
    return res.status(404).send("Not found");
  }

  return res.status(404).json({ error: "Not found" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
