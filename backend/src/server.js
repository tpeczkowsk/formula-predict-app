import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js";
import userRoutes from "./routes/user.routes.js";
import betRoutes from "./routes/bet.routes.js";
import raceRoutes from "./routes/race.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import configRoutes from "./routes/config.routes.js";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api", (req, res) => {
  res.status(200).json({ message: "API is working" });
});

app.use("/api/users", userRoutes);
app.use("/api/bets", betRoutes);
app.use("/api/races", raceRoutes);
app.use("/api/drivers", driverRoutes);
app.use("/api/config", configRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
