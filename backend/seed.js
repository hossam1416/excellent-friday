import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;
const USERNAMES = {
  hossam: "hossam",
  mohammad: "mohammad",
  abed: "abdulrahman",
};

const tournamentSchema = new mongoose.Schema(
  {
    name: String,
    status: String,
    players: [mongoose.Schema.Types.ObjectId],
    endReason: String,
  },
  { timestamps: true },
);

const matchSchema = new mongoose.Schema(
  {
    tournament: mongoose.Schema.Types.ObjectId,
    playerOne: mongoose.Schema.Types.ObjectId,
    playerTwo: mongoose.Schema.Types.ObjectId,
    scorePlayerOne: Number,
    scorePlayerTwo: Number,
    winner: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true },
);

const userSchema = new mongoose.Schema({ username: String });

const Tournament =
  mongoose.models.Tournament || mongoose.model("Tournament", tournamentSchema);
const Match = mongoose.models.Match || mongoose.model("Match", matchSchema);
const User = mongoose.models.User || mongoose.model("User", userSchema);

const rawTournamentsData = [
  {
    name: "الدوري الأول",
    matches: [
      { p1: "abed", p2: "mohammad", s1: 6, s2: 4 },
      { p1: "hossam", p2: "abed", s1: 5, s2: 1 },
      { p1: "hossam", p2: "mohammad", s1: 7, s2: 3 },
      { p1: "hossam", p2: "abed", s1: 4, s2: 2 },
      { p1: "mohammad", p2: "hossam", s1: 6, s2: 4 },
      { p1: "mohammad", p2: "abed", s1: 8, s2: 6 },
      { p1: "mohammad", p2: "hossam", s1: 4, s2: 4 },
      { p1: "hossam", p2: "abed", s1: 5, s2: 4 },
      { p1: "hossam", p2: "mohammad", s1: 6, s2: 4 },
    ],
  },
  {
    name: "الدوري الثاني",
    matches: [
      { p1: "mohammad", p2: "hossam", s1: 6, s2: 1 },
      { p1: "mohammad", p2: "abed", s1: 6, s2: 4 },
      { p1: "hossam", p2: "mohammad", s1: 8, s2: 6 },
      { p1: "hossam", p2: "abed", s1: 8, s2: 6 },
      { p1: "hossam", p2: "mohammad", s1: 6, s2: 3 },
      { p1: "hossam", p2: "abed", s1: 5, s2: 0 },
      { p1: "mohammad", p2: "hossam", s1: 5, s2: 2 },
      { p1: "abed", p2: "mohammad", s1: 5, s2: 2 },
    ],
  },
  {
    name: "الدوري الثالث",
    matches: [
      { p1: "hossam", p2: "mohammad", s1: 3, s2: 2 },
      { p1: "abed", p2: "hossam", s1: 6, s2: 5 },
      { p1: "abed", p2: "mohammad", s1: 6, s2: 5 },
      { p1: "hossam", p2: "abed", s1: 4, s2: 0 },
      { p1: "hossam", p2: "mohammad", s1: 5, s2: 4 },
      { p1: "hossam", p2: "abed", s1: 7, s2: 3 },
      { p1: "hossam", p2: "mohammad", s1: 1, s2: 0 },
      { p1: "hossam", p2: "abed", s1: 1, s2: 0 },
    ],
  },
  {
    name: "الدوري الرابع",
    matches: [
      { p1: "mohammad", p2: "hossam", s1: 4, s2: 3 },
      { p1: "mohammad", p2: "abed", s1: 3, s2: 2 },
      { p1: "mohammad", p2: "hossam", s1: 2, s2: 2 },
      { p1: "hossam", p2: "abed", s1: 8, s2: 5 },
      { p1: "hossam", p2: "mohammad", s1: 6, s2: 5 },
      { p1: "hossam", p2: "abed", s1: 8, s2: 5 },
      { p1: "mohammad", p2: "hossam", s1: 4, s2: 3 },
      { p1: "mohammad", p2: "abed", s1: 8, s2: 5 },
      { p1: "mohammad", p2: "hossam", s1: 4, s2: 1 },
    ],
  },
  {
    name: "الدوري الخامس",
    matches: [
      { p1: "mohammad", p2: "abed", s1: 7, s2: 3 },
      { p1: "hossam", p2: "mohammad", s1: 6, s2: 5 },
      { p1: "hossam", p2: "abed", s1: 6, s2: 4 },
      { p1: "mohammad", p2: "hossam", s1: 4, s2: 4 },
      { p1: "mohammad", p2: "abed", s1: 7, s2: 5 },
      { p1: "hossam", p2: "mohammad", s1: 5, s2: 2 },
      { p1: "hossam", p2: "abed", s1: 6, s2: 2 },
      { p1: "hossam", p2: "mohammad", s1: 5, s2: 4 },
    ],
  },
  {
    name: "الدوري السادس",
    matches: [
      { p1: "abed", p2: "mohammad", s1: 5, s2: 4 },
      { p1: "hossam", p2: "abed", s1: 4, s2: 3 },
      { p1: "hossam", p2: "mohammad", s1: 6, s2: 2 },
      { p1: "abed", p2: "hossam", s1: 4, s2: 2 },
      { p1: "mohammad", p2: "abed", s1: 4, s2: 4 },
      { p1: "abed", p2: "hossam", s1: 5, s2: 3 },
      { p1: "abed", p2: "mohammad", s1: 5, s2: 5 },
      { p1: "mohammad", p2: "hossam", s1: 3, s2: 1 },
      { p1: "mohammad", p2: "abed", s1: 6, s2: 2 },
      { p1: "mohammad", p2: "hossam", s1: 5, s2: 4 },
    ],
  },
  {
    name: "الدوري السابع",
    matches: [
      { p1: "mohammad", p2: "abed", s1: 6, s2: 2 },
      { p1: "hossam", p2: "mohammad", s1: 2, s2: 2 },
      { p1: "hossam", p2: "abed", s1: 3, s2: 3 },
      { p1: "mohammad", p2: "hossam", s1: 8, s2: 6 },
      { p1: "mohammad", p2: "abed", s1: 3, s2: 3 },
      { p1: "mohammad", p2: "hossam", s1: 6, s2: 3 },
      { p1: "mohammad", p2: "abed", s1: 6, s2: 4 },
      { p1: "mohammad", p2: "hossam", s1: 7, s2: 5 },
    ],
  },
  {
    name: "الدوري الثامن",
    matches: [
      { p1: "mohammad", p2: "hossam", s1: 3, s2: 3 },
      { p1: "hossam", p2: "abed", s1: 3, s2: 7 },
      { p1: "hossam", p2: "mohammad", s1: 6, s2: 4 },
      { p1: "hossam", p2: "abed", s1: 4, s2: 5 },
      { p1: "abed", p2: "mohammad", s1: 3, s2: 8 },
      { p1: "mohammad", p2: "hossam", s1: 4, s2: 3 },
      { p1: "mohammad", p2: "abed", s1: 11, s2: 4 },
      { p1: "mohammad", p2: "hossam", s1: 2, s2: 3 },
      { p1: "hossam", p2: "abed", s1: 7, s2: 0 },
      { p1: "hossam", p2: "mohammad", s1: 3, s2: 5 },
    ],
  },
  {
    name: "الدوري التاسع",
    matches: [
      { p1: "mohammad", p2: "hossam", s1: 5, s2: 2 },
      { p1: "mohammad", p2: "abed", s1: 4, s2: 4 },
      { p1: "mohammad", p2: "hossam", s1: 4, s2: 4 },
      { p1: "hossam", p2: "abed", s1: 8, s2: 7 },
      { p1: "mohammad", p2: "hossam", s1: 4, s2: 3 },
      { p1: "abed", p2: "mohammad", s1: 6, s2: 5 },
      { p1: "hossam", p2: "abed", s1: 6, s2: 3 },
      { p1: "hossam", p2: "mohammad", s1: 4, s2: 2 },
      { p1: "hossam", p2: "abed", s1: 5, s2: 4 },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    const userDocs = {};
    for (const key of Object.keys(USERNAMES)) {
      let u = await User.findOne({ username: USERNAMES[key] });
      if (!u) {
        console.error(
          `المستخدم ${USERNAMES[key]} غير موجود في قاعدة البيانات!`,
        );
        process.exit(1);
      }
      userDocs[key] = u._id;
    }

    const playerIds = Object.values(userDocs);

    for (const tData of rawTournamentsData) {
      const t = await Tournament.create({
        name: tData.name,
        status: "completed",
        players: playerIds,
        endReason: "max_matches",
      });

      for (const mData of tData.matches) {
        const p1Id = userDocs[mData.p1];
        const p2Id = userDocs[mData.p2];

        let winner = null;
        if (mData.s1 > mData.s2) winner = p1Id;
        else if (mData.s2 > mData.s1) winner = p2Id;

        await Match.create({
          tournament: t._id,
          playerOne: p1Id,
          playerTwo: p2Id,
          scorePlayerOne: mData.s1,
          scorePlayerTwo: mData.s2,
          winner: winner,
        });
      }

      console.log(`✅ تم حفظ ${tData.name} بـ ${tData.matches.length} مباراة`);
    }

    console.log("\n🚀 تم إدخال جميع الـ 9 دوريات بنجاح!");
    process.exit(0);
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

seed();
