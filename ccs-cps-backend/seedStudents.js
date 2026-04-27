const { connectDB, getDB } = require("./config/db");
const bcrypt = require("bcryptjs");

const firstNames = [
  "John",
  "Maria",
  "James",
  "Anna",
  "Kyle",
  "Alyssa",
  "Mark",
  "Jessa",
  "Paul",
  "Kim",
  "Ryan",
  "Chloe",
  "Daniel",
  "Grace",
  "Miguel",
  "Liam",
  "Sophia",
  "Noah",
  "Ella",
  "Ethan",
];

const lastNames = [
  "Dela Cruz",
  "Santos",
  "Reyes",
  "Garcia",
  "Mendoza",
  "Torres",
  "Lopez",
  "Rivera",
  "Cruz",
  "Bautista",
  "Aquino",
  "Ramos",
  "Castro",
  "Navarro",
  "Flores",
];

const programs = ["BS Information Technology", "BS Computer Science"];

const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const sections = ["A", "B", "C", "D"];

const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const seedStudents = async () => {
  try {
    await connectDB();
    const db = getDB();

    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash("123456", salt);

    const students = [];

    for (let i = 1; i <= 1000; i++) {
      const firstName = getRandom(firstNames);
      const lastName = getRandom(lastNames);

      students.push({
        studentId: `2024${String(i).padStart(4, "0")}`,
        firstName,
        lastName,
        program: getRandom(programs),
        year: getRandom(years),
        section: getRandom(sections),
        birthdate: "2004-01-01",
        password: defaultPassword,
        role: "student",
        status: "Enrolled",
        type: "Regular",
        isDeleted: false,
        clearance: {},
        violations: [],
      });
    }

    const result = await db.collection("students").insertMany(students);

    console.log("✅ 1,000 Students Seeded:", result.insertedCount);
    process.exit();
  } catch (error) {
    console.error("❌ Seeder error:", error);
    process.exit(1);
  }
};

seedStudents();
