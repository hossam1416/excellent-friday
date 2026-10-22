import mongoose from "mongoose";

const matchSchema = new mongoose.Schema(
  {
    tournament: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tournament",
      required: true,
    },
    playerOne: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    playerTwo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    scorePlayerOne: {
      type: Number,
      required: true,
      min: 0,
    },
    scorePlayerTwo: {
      type: Number,
      required: true,
      min: 0,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    decidedByPenalties: {
      type: Boolean,
      default: false,
    },

    isFinalMatch: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Match = mongoose.model("Match", matchSchema);

export default Match;
