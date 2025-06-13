import express from "express";
import { createDriver, getAllDrivers, updateDriver, deleteDriver } from "../controllers/driver.controller.js";

const router = express.Router();

router.post("/", createDriver);
router.get("/", getAllDrivers);
router.put("/:id", updateDriver);
router.delete("/:id", deleteDriver);

export default router;
