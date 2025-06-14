import express from "express";
import { createDriver, getAllDrivers, updateDriver, deleteDriver } from "../controllers/driver.controller.js";
import { checkRole, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, checkRole(["admin"]), createDriver);
router.get("/", protectRoute, getAllDrivers);
router.put("/:id", protectRoute, checkRole(["admin"]), updateDriver);
router.delete("/:id", protectRoute, checkRole(["admin"]), deleteDriver);

export default router;
