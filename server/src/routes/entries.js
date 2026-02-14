import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { getDurationMinutes, minutesToHours } from "../lib/time.js";

const router = Router();

const updateEntrySchema = z.object({
  comment: z.string().trim().max(240).optional().or(z.literal("")),
});

function serializeEntry(entry) {
  const durationMinutes = getDurationMinutes(entry);
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
  };
}

router.patch("/:id", async (req, res, next) => {
  try {
    const parsed = updateEntrySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: parsed.error.issues[0]?.message ?? "Invalid entry payload" });
    }

    const entry = await prisma.timeEntry.update({
      where: { id: req.params.id },
      data: {
        comment: parsed.data.comment ?? "",
      },
    });

    return res.json(serializeEntry(entry));
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Entry not found" });
    }
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await prisma.timeEntry.delete({
      where: { id: req.params.id },
    });
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Entry not found" });
    }
    next(error);
  }
});

export default router;
