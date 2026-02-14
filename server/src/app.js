import "dotenv/config";
import express from "express";
import cors from "cors";
import jobsRouter from "./routes/jobs.js";
import entriesRouter from "./routes/entries.js";
import { prisma } from "./lib/prisma.js";

const app = express();

// Helpful when running behind proxies (Vercel, etc.)
app.set("trust proxy", 1);

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const corsOrigin =
  process.env.NODE_ENV === "production"
    ? CLIENT_ORIGIN || true
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

app.get("/api/health/db", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: "ok", db: "ok" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", db: "error" });
  }
});

app.use("/api/jobs", jobsRouter);
app.use("/api/entries", entriesRouter);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Something went wrong." });
});

export default app;
