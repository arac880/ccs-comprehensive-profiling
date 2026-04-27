require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const bcrypt = require("bcryptjs");
const { connectDB, getDB } = require("./config/db");

const seed = async () => {
  await connectDB();
  const db = getDB();

  // ── Students ──
  const students = await db.collection("students").find({}).toArray();
  for (const s of students) {
    if (s.birthdate) {
      const hashed = await bcrypt.hash(s.birthdate, 10);
      await db
        .collection("students")
        .updateOne(
          { _id: s._id },
          { $set: { password: hashed, role: "student" } },
        );
      console.log(`✅ Student: ${s.studentId} → password: ${s.birthdate}`);
    } else {
      console.log(`⚠️  No birthdate for student ${s.studentId}, skipping...`);
    }
  }

  // ── Faculty ──
  const facultyList = await db.collection("faculty").find({}).toArray();
  for (const f of facultyList) {
    if (f.birthdate) {
      const hashed = await bcrypt.hash(f.birthdate, 10);
      await db
        .collection("faculty")
        .updateOne(
          { _id: f._id },
          {
            $set: {
              password: hashed,
              role: f.isDean ? "dean" : f.isChair ? "chair" : "faculty",
            },
          },
        );
      console.log(`✅ Faculty: ${f.facultyId} → password: ${f.birthdate}`);
    } else {
      console.log(`⚠️  No birthdate for faculty ${f.facultyId}, skipping...`);
    }
  }

  console.log("\n🎉 Seeding done!");
  process.exit();
};

seed();
