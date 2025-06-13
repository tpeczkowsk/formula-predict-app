import express from "express";
import { createBet, getBetById, updateBet, deleteBet, getAllUserBets } from "../controllers/bet.controller.js";

const router = express.Router();

// Trasy zakładów
router.post("/", createBet);
router.get("/user/:userId", getAllUserBets);
router.get("/user/:userId/bet/:betId", getBetById);
router.put("/user/:userId/bet/:betId", updateBet);
router.delete("/user/:userId/bet/:betId", deleteBet);

export default router;
