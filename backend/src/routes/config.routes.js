import express from "express";
import { createConfig, getConfig, updateConfig, deleteConfig, resetConfig } from "../controllers/config.controller.js";

const router = express.Router();

router.post("/", createConfig);
router.get("/", getConfig);
router.put("/:configId", updateConfig);
router.delete("/:configId", deleteConfig);
router.post("/reset", resetConfig);

export default router;
