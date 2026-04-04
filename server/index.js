import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth.js";
import catalogRouter from "./routes/catalog.js";
import tasksRouter from "./routes/tasks.js";
import { loadProjectEnv } from "./utils/loadProjectEnv.js";

const app = express();

loadProjectEnv();
app.set("trust proxy", 1);

const allowedOrigins = new Set(
  [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    process.env.CLIENT_ORIGIN,
    process.env.CORS_ORIGIN,
    ...(process.env.ALLOWED_ORIGINS || "")
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean),
  ].filter(Boolean)
);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.size === 0 || allowedOrigins.has(origin)) {
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

app.use((error, req, res, next) => {
  if (error?.message === "Not allowed by CORS") {
    return res.status(403).json({ error: error.message });
  }

  return next(error);
});

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});
