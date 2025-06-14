import express from "express";
import { createBet, getBetById, updateBet, deleteBet, getAllUserBets } from "../controllers/bet.controller.js";
import { checkRole, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Trasy zakładów
router.post("/", protectRoute, checkRole(["user"]), createBet);
router.get("/", protectRoute, getAllUserBets);
router.get("/:betId", protectRoute, getBetById);
router.put("/:betId", protectRoute, updateBet);
router.delete("/:betId", protectRoute, deleteBet);

export default router;
