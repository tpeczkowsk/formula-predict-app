import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      // throw new AppError("Unauthorized - no token", 401);
      return res.status(401).json({ message: "Unauthorized - no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      // throw new AppError("Unauthorized - invalid token", 401);
      return res.status(401).json({ message: "Unauthorized - invalid token" });
    }

    const user = await User.findById(decoded.userId).select("_id email username role").exec();
    if (!user) {
      // throw new AppError("User not found", 404);
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error);
    // throw new AppError("Internal server error", 500);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

export const checkRole = (roles) => {
  return (req, res, next) => {
    try {
      // Sprawdzenie, czy użytkownik istnieje w req (powinien być dodany przez protectRoute)
      if (!req.user) {
        return res.status(401).json({ message: "Unauthorized - authentication required" });
      }

      // Sprawdzenie, czy użytkownik ma wymaganą rolę
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Forbidden - insufficient permissions" });
      }

      // Jeśli rola jest odpowiednia, kontynuuj
      next();
    } catch (error) {
      console.error("Error in checkRole middleware:", error);
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
  };
};
