import express from "express";
import {
  createUser,
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getLeaderboard,
  loginUser,
  logoutUser,
  checkAuth,
} from "../controllers/user.controller.js";
import { checkRole, protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", protectRoute, checkRole(["admin"]), createUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/check_auth", protectRoute, checkAuth);
router.post("/register", registerUser);
router.get("/", protectRoute, checkRole(["admin"]), getAllUsers);
router.get("/:id", protectRoute, checkRole(["admin"]), getUserById);
router.put("/:id", protectRoute, checkRole(["admin"]), updateUser);
router.delete("/:id", protectRoute, checkRole(["admin"]), deleteUser);

router.get("/leaderboard/global", protectRoute, getLeaderboard);

export default router;
