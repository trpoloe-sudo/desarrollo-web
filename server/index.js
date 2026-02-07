import express from "express";
import cors from "cors";
import morgan from "morgan";
import tasksRouter from "./routes/tasks.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

app.use("/api/tasks", tasksRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Tasks API listening on http://localhost:${port}`);
});
