import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { getDurationMinutes, minutesToHours } from "../lib/time.js";

const router = Router();

const createJobSchema = z.object({
  name: z.string().trim().min(1, "Job name is required").max(80, "Job name is too long"),
  color: z.string().trim().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Invalid hex color").optional(),
});

const createEntrySchema = z
  .object({
    comment: z.string().trim().max(240).optional().or(z.literal("")),
    manualHours: z.number().positive().max(24).optional(),
    clockIn: z.string().datetime().optional(),
    clockOut: z.string().datetime().optional(),
  })
  .refine((data) => {
    const hasManualHours = typeof data.manualHours === "number";
    const hasRange = Boolean(data.clockIn && data.clockOut);
    return hasManualHours || hasRange;
  }, "Provide either manualHours or both clockIn and clockOut.");

function serializeEntry(entry) {
  const durationMinutes = getDurationMinutes(entry);
  const isActive = Boolean(entry.clockIn && !entry.clockOut && typeof entry.manualMinutes !== "number");

  return {
    id: entry.id,
    jobId: entry.jobId,
    clockIn: entry.clockIn,
    clockOut: entry.clockOut,
    manualHours: typeof entry.manualMinutes === "number" ? minutesToHours(entry.manualMinutes) : null,
    durationMinutes,
    durationHours: minutesToHours(durationMinutes),
    comment: entry.comment ?? "",
    createdAt: entry.createdAt,
    type: typeof entry.manualMinutes === "number" ? "manual" : "clocked",
    isActive,
  };
}

router.get("/", async (_req, res, next) => {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        entries: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const payload = jobs.map((job) => {
      const totalMinutes = job.entries.reduce((acc, entry) => acc + getDurationMinutes(entry), 0);
      const activeEntry = job.entries.find(
        (entry) => entry.clockIn && !entry.clockOut && typeof entry.manualMinutes !== "number"
      );

      return {
        id: job.id,
        name: job.name,
        color: job.color,
        createdAt: job.createdAt,
        totalHours: minutesToHours(totalMinutes),
        totalMinutes,
        activeEntry: activeEntry ? serializeEntry(activeEntry) : null,
      };
    });

    res.json(payload);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = createJobSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid job payload" });
    }

    const job = await prisma.job.create({
      data: {
        name: parsed.data.name,
        color: parsed.data.color ?? "#3B82F6",
      },
    });

    return res.status(201).json(job);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.job.delete({
      where: { id: req.params.id },
    });
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Job not found" });
    }
    next(error);
  }
});

router.get("/:jobId/entries", async (req, res, next) => {
  try {
    const entries = await prisma.timeEntry.findMany({
      where: { jobId: req.params.jobId },
      orderBy: { createdAt: "desc" },
    });
    return res.json(entries.map(serializeEntry));
  } catch (error) {
    next(error);
  }
});

router.post("/:jobId/clock-in", async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.jobId } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const existingActive = await prisma.timeEntry.findFirst({
      where: {
        jobId: req.params.jobId,
        clockIn: { not: null },
        clockOut: null,
        manualMinutes: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existingActive) {
      return res.status(409).json({ message: "This job is already clocked in." });
    }

    const entry = await prisma.timeEntry.create({
      data: {
        jobId: req.params.jobId,
        clockIn: new Date(),
        comment: "",
      },
    });

    return res.status(201).json(serializeEntry(entry));
  } catch (error) {
    next(error);
  }
});

router.post("/:jobId/clock-out", async (req, res, next) => {
  try {
    const activeEntry = await prisma.timeEntry.findFirst({
      where: {
        jobId: req.params.jobId,
        clockIn: { not: null },
        clockOut: null,
        manualMinutes: null,
      },
      orderBy: { createdAt: "desc" },
    });

    if (!activeEntry) {
      return res.status(404).json({ message: "No active clock-in found for this job." });
    }

    const now = new Date();
    const entry = await prisma.timeEntry.update({
      where: { id: activeEntry.id },
      data: { clockOut: now },
    });

    return res.json(serializeEntry(entry));
  } catch (error) {
    next(error);
  }
});

router.post("/:jobId/entries", async (req, res, next) => {
  try {
    const job = await prisma.job.findUnique({ where: { id: req.params.jobId } });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    const parsed = createEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid entry payload" });
    }

    const { comment, manualHours, clockIn, clockOut } = parsed.data;
    let entryPayload;

    if (typeof manualHours === "number") {
      entryPayload = {
        jobId: req.params.jobId,
        manualMinutes: Math.round(manualHours * 60),
        comment: comment ?? "",
      };
    } else {
      const parsedClockIn = new Date(clockIn);
      const parsedClockOut = new Date(clockOut);
      if (parsedClockOut <= parsedClockIn) {
        return res.status(400).json({ message: "clockOut must be after clockIn." });
      }

      entryPayload = {
        jobId: req.params.jobId,
        clockIn: parsedClockIn,
        clockOut: parsedClockOut,
        comment: comment ?? "",
      };
    }

    const entry = await prisma.timeEntry.create({ data: entryPayload });
    return res.status(201).json(serializeEntry(entry));
  } catch (error) {
    next(error);
  }
});

export default router;
