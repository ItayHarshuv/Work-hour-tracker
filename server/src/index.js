import "dotenv/config";
import express from "express";
import cors from "cors";
import jobsRouter from "./routes/jobs.js";
import entriesRouter from "./routes/entries.js";

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const corsOrigin =
  process.env.NODE_ENV === "production"
    ? CLIENT_ORIGIN
    : [/^http:\/\/localhost:\d+$/];

app.use(
  cors({
    origin: corsOrigin,
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/jobs", jobsRouter);
app.use("/api/entries", entriesRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong." });
});

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
