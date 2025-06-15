import express from "express";
import {
  createRace,
  getAllRaces,
  getRaceById,
  updateRace,
  deleteRace,
  getUpcomingRaces,
  getRacesBySeason,
  getRaceLeaderboard,
  getUserRaceDashboard,
} from "../controllers/race.controller.js";
import { checkRole, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Podstawowe operacje CRUD
router.post("/", protectRoute, checkRole(["admin"]), createRace);
router.get("/", protectRoute, getAllRaces);
router.get("/:id", protectRoute, getRaceById);
router.put("/:id", protectRoute, checkRole(["admin"]), updateRace);
router.delete("/:id", protectRoute, checkRole(["admin"]), deleteRace);

// Dodatkowe trasy
router.get("/upcoming/list", getUpcomingRaces);
// router.get("/season/:season", getRacesBySeason);

router.get("/leaderboard/race/:raceId", getRaceLeaderboard);
router.get("/dashboard/:userId/:raceId", getUserRaceDashboard);

export default router;
