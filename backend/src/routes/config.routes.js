import express from "express";
import { createConfig, getConfig, updateConfig, deleteConfig, resetConfig } from "../controllers/config.controller.js";
import { checkRole, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, checkRole(["admin"]), createConfig);
router.get("/", protectRoute, checkRole(["admin"]), getConfig);
router.put("/:configId", protectRoute, checkRole(["admin"]), updateConfig);
router.delete("/:configId", protectRoute, checkRole(["admin"]), deleteConfig);
router.post("/reset", protectRoute, checkRole(["admin"]), resetConfig);

export default router;
