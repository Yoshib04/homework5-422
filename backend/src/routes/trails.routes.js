import { Router } from "express";
import { prisma } from "../db.js";

export const trailsRouter = Router();

//GET /trails 
trailsRouter.get("/", async (req, res) => {
  try {
    const trails = await prisma.trail.findMany({
      orderBy: { id: "asc" }
    });
    res.json(trails);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch trails" });
  }
});

//POST /trails 
trailsRouter.post("/", async (req, res) => {
  try {
    const { name, distanceMiles, difficulty, region } = req.body;

    if (!name || !distanceMiles || !difficulty || !region) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newTrail = await prisma.trail.create({
      data: {
        name,
        distanceMiles: parseFloat(distanceMiles),
        difficulty,
        region
      }
    });

    res.status(201).json(newTrail);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create trail" });
  }
});