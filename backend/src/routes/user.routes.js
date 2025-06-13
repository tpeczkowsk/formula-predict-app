import express from "express";
import { createUser, registerUser, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/user.controller.js";

const router = express.Router();

router.post("/", createUser);
router.post("/register", registerUser);
router.get("/", getAllUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
