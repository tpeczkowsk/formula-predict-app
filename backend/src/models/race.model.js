import mongoose from "mongoose";

const RaceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    betDeadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["waiting", "in progress", "finished"],
      default: "waiting",
    },
    season: {
      type: Number,
      required: true,
    },
    isSprint: {
      type: Boolean,
      default: false,
    },
    driverResults: {
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
      p11: String,
      p12: String,
    },
    bonusResults: {
      polePosition: String,
      fastestLap: String,
      driverOfTheDay: String,
      noDNFs: Boolean,
    },
  },
  { timestamps: true }
);

const Race = mongoose.model("Race", RaceSchema);
export default Race;
