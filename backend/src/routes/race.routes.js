import express from "express";
import { createRace, getAllRaces, getRaceById, updateRace, deleteRace, getUpcomingRaces, getRacesBySeason } from "../controllers/race.controller.js";

const router = express.Router();

// Podstawowe operacje CRUD
router.post("/", createRace);
router.get("/", getAllRaces);
router.get("/:id", getRaceById);
router.put("/:id", updateRace);
router.delete("/:id", deleteRace);

// Dodatkowe trasy
router.get("/upcoming/list", getUpcomingRaces);
router.get("/season/:season", getRacesBySeason);

export default router;
