import mongoose from "mongoose";

const BetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    raceName: String,
    season: Number,
    driverBets: {
      p1: String,
      p2: String,
      p3: String,
      p4: String,
      p5: String,
      p6: String,
      p7: String,
      p8: String,
      p9: String,
      p10: String,
    },
    bonusBets: {
      polePosition: String,
      fastestLap: String,
      driverOfTheDay: String,
      noDNFs: Boolean,
    },
    status: {
      type: String,
      enum: ["pending", "finished"],
      default: "pending",
    },
    awardedPoints: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isRegistered: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    pointsSum: {
      type: Number,
      default: 0,
    },
    registrationToken: String,
    tokenExpiryTime: Date,
    bets: [BetSchema],
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;
