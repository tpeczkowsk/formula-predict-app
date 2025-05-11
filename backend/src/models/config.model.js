import mongoose from "mongoose";

const ConfigSchema = new mongoose.Schema(
  {
    driverBetPoints: {
      exactMatch: {
        type: Number,
        default: 5,
      },
      oneOff: {
        type: Number,
        default: 3,
      },
      twoOff: {
        type: Number,
        default: 1,
      },
    },
    bonusBetPoints: {
      polePosition: {
        type: Number,
        default: 5,
      },
      fastestLap: {
        type: Number,
        default: 5,
      },
      driverOfTheDay: {
        type: Number,
        default: 5,
      },
      noDNFs: {
        type: Number,
        default: 5,
      },
    },
  },
  { timestamps: true }
);

const Config = mongoose.model("Config", ConfigSchema);
export default Config;
