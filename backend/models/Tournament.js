import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed"],
      default: "pending",
    },
    players: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    champion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    endReason: {
      type: String,
      enum: ["clinched", "max_matches", "manual"],
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Tournament = mongoose.model("Tournament", tournamentSchema);

export default Tournament;
