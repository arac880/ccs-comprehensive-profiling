require("dotenv").config();
const { MongoClient } = require("mongodb");

function getRandomGrade() {
  const grades = ["1.00", "1.25", "1.50", "1.75", "2.00", "2.25", "2.50", "2.75", "3.00"];
  const weights = [5, 10, 15, 20, 20, 15, 8, 4, 3];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.floor(Math.random() * total);
  for (let i = 0; i < grades.length; i++) {
    r -= weights[i];
    if (r < 0) return grades[i];
  }
  return "2.00";
}

function getRandomSection(yearLevel, program) {
  const sections = ["A", "B", "C", "D"];
  const num = yearLevel.replace(/\D/g, "");
  const prefix = program && program.toLowerCase().includes("computer science") ? "CS" : "IT";
  return `${num}${prefix}-${sections[Math.floor(Math.random() * sections.length)]}`;
}

const IT_SUBJECTS = {
  "1st Year": {
    "1st Semester": [
      { courseCode: "IT 101", courseName: "Introduction to Computing", units: 3 },
      { courseCode: "IT 102", courseName: "Computer Programming 1", units: 3 },
      { courseCode: "GE 101", courseName: "Understanding the Self", units: 3 },
      { courseCode: "GE 102", courseName: "Readings in Philippine History", units: 3 },
      { courseCode: "MATH 101", courseName: "Mathematics in the Modern World", units: 3 },
      { courseCode: "NSTP 101", courseName: "National Service Training Program 1", units: 3 },
    ],
    "2nd Semester": [
      { courseCode: "IT 103", courseName: "Computer Programming 2", units: 3 },
      { courseCode: "IT 104", courseName: "Digital Logic Design", units: 3 },
      { courseCode: "GE 103", courseName: "The Contemporary World", units: 3 },
      { courseCode: "GE 104", courseName: "Purposive Communication", units: 3 },
      { courseCode: "MATH 102", courseName: "Calculus for IT", units: 3 },
      { courseCode: "NSTP 102", courseName: "National Service Training Program 2", units: 3 },
    ],
  },
  "2nd Year": {
    "1st Semester": [
      { courseCode: "IT 201", courseName: "Data Structures and Algorithms", units: 3 },
      { courseCode: "IT 202", courseName: "Database Management Systems", units: 3 },
      { courseCode: "IT 203", courseName: "Object-Oriented Programming", units: 3 },
      { courseCode: "IT 204", courseName: "Discrete Mathematics", units: 3 },
      { courseCode: "IT 205", courseName: "Computer Organization and Architecture", units: 3 },
      { courseCode: "GE 201", courseName: "Art Appreciation", units: 3 },
    ],
    "2nd Semester": [
      { courseCode: "IT 206", courseName: "Web Systems and Technologies 1", units: 3 },
      { courseCode: "IT 207", courseName: "Information Management", units: 3 },
      { courseCode: "IT 208", courseName: "Operating Systems", units: 3 },
      { courseCode: "IT 209", courseName: "Networking 1", units: 3 },
      { courseCode: "IT 210", courseName: "Human Computer Interaction", units: 3 },
      { courseCode: "GE 202", courseName: "Science, Technology and Society", units: 3 },
    ],
  },
  "3rd Year": {
    "1st Semester": [
      { courseCode: "IT 301", courseName: "Web Systems and Technologies 2", units: 3 },
      { courseCode: "IT 302", courseName: "Networking 2", units: 3 },
      { courseCode: "IT 303", courseName: "Systems Analysis and Design", units: 3 },
      { courseCode: "IT 304", courseName: "Application Development and Emerging Technologies", units: 3 },
      { courseCode: "IT 305", courseName: "Information Assurance and Security", units: 3 },
      { courseCode: "IT 306", courseName: "Quantitative Methods", units: 3 },
    ],
    "2nd Semester": [
      { courseCode: "IT 307", courseName: "Software Engineering", units: 3 },
      { courseCode: "IT 308", courseName: "Systems Administration and Maintenance", units: 3 },
      { courseCode: "IT 309", courseName: "Integrative Programming and Technologies", units: 3 },
      { courseCode: "IT 310", courseName: "Social and Professional Issues in IT", units: 3 },
      { courseCode: "IT 311", courseName: "Network Management", units: 3 },
      { courseCode: "PE 301", courseName: "Physical Education 3", units: 2 },
    ],
  },
  "4th Year": {
    "1st Semester": [
      { courseCode: "IT 401", courseName: "Capstone Project 1", units: 3 },
      { courseCode: "IT 402", courseName: "Cloud Computing", units: 3 },
      { courseCode: "IT 403", courseName: "IT Elective 1 — Mobile Application Development", units: 3 },
      { courseCode: "IT 404", courseName: "IT Elective 2 — IoT and Embedded Systems", units: 3 },
      { courseCode: "IT 405", courseName: "Technopreneurship", units: 3 },
    ],
    "2nd Semester": [
      { courseCode: "IT 406", courseName: "Capstone Project 2", units: 3 },
      { courseCode: "IT 407", courseName: "IT Elective 3 — Data Analytics", units: 3 },
      { courseCode: "IT 408", courseName: "IT Elective 4 — Cybersecurity Management", units: 3 },
      { courseCode: "IT 409", courseName: "Practicum / On-the-Job Training", units: 6 },
    ],
  },
};

const CS_SUBJECTS = {
  "1st Year": {
    "1st Semester": [
      { courseCode: "CS 101", courseName: "Introduction to Computer Science", units: 3 },
      { courseCode: "CS 102", courseName: "Computer Programming 1 (Python)", units: 3 },
      { courseCode: "GE 101", courseName: "Understanding the Self", units: 3 },
      { courseCode: "GE 102", courseName: "Readings in Philippine History", units: 3 },
      { courseCode: "MATH 101", courseName: "Algebra and Trigonometry", units: 3 },
      { courseCode: "NSTP 101", courseName: "National Service Training Program 1", units: 3 },
    ],
    "2nd Semester": [
      { courseCode: "CS 103", courseName: "Computer Programming 2 (Java)", units: 3 },
      { courseCode: "CS 104", courseName: "Digital Logic Circuits", units: 3 },
      { courseCode: "GE 103", courseName: "The Contemporary World", units: 3 },
      { courseCode: "GE 104", courseName: "Purposive Communication", units: 3 },
      { courseCode: "MATH 102", courseName: "Calculus 1", units: 3 },
      { courseCode: "NSTP 102", courseName: "National Service Training Program 2", units: 3 },
    ],
  },
  "2nd Year": {
    "1st Semester": [
      { courseCode: "CS 201", courseName: "Data Structures and Algorithms", units: 3 },
      { courseCode: "CS 202", courseName: "Discrete Structures 1", units: 3 },
      { courseCode: "CS 203", courseName: "Object-Oriented Programming", units: 3 },
      { courseCode: "CS 204", courseName: "Computer Organization and Architecture", units: 3 },
      { courseCode: "MATH 201", courseName: "Calculus 2", units: 3 },
      { courseCode: "GE 201", courseName: "Science, Technology and Society", units: 3 },
    ],
    "2nd Semester": [
      { courseCode: "CS 205", courseName: "Discrete Structures 2", units: 3 },
      { courseCode: "CS 206", courseName: "Database Systems", units: 3 },
      { courseCode: "CS 207", courseName: "Operating Systems", units: 3 },
      { courseCode: "CS 208", courseName: "Algorithm Analysis and Design", units: 3 },
      { courseCode: "MATH 202", courseName: "Linear Algebra", units: 3 },
      { courseCode: "GE 202", courseName: "Art Appreciation", units: 3 },
    ],
  },
  "3rd Year": {
    "1st Semester": [
      { courseCode: "CS 301", courseName: "Programming Languages", units: 3 },
      { courseCode: "CS 302", courseName: "Theory of Automata", units: 3 },
      { courseCode: "CS 303", courseName: "Computer Networks", units: 3 },
      { courseCode: "CS 304", courseName: "Software Engineering 1", units: 3 },
      { courseCode: "CS 305", courseName: "Probability and Statistics for CS", units: 3 },
      { courseCode: "CS 306", courseName: "Human Computer Interaction", units: 3 },
    ],
    "2nd Semester": [
      { courseCode: "CS 307", courseName: "Software Engineering 2", units: 3 },
      { courseCode: "CS 308", courseName: "Artificial Intelligence", units: 3 },
      { courseCode: "CS 309", courseName: "Information Assurance and Security", units: 3 },
      { courseCode: "CS 310", courseName: "Compiler Design", units: 3 },
      { courseCode: "CS 311", courseName: "Numerical Methods", units: 3 },
      { courseCode: "PE 301", courseName: "Physical Education 3", units: 2 },
    ],
  },
  "4th Year": {
    "1st Semester": [
      { courseCode: "CS 401", courseName: "Thesis Writing 1", units: 3 },
      { courseCode: "CS 402", courseName: "Machine Learning", units: 3 },
      { courseCode: "CS 403", courseName: "CS Elective 1 — Computer Vision", units: 3 },
      { courseCode: "CS 404", courseName: "CS Elective 2 — Natural Language Processing", units: 3 },
      { courseCode: "CS 405", courseName: "Advanced Software Engineering", units: 3 },
    ],
    "2nd Semester": [
      { courseCode: "CS 406", courseName: "Thesis Writing 2", units: 3 },
      { courseCode: "CS 407", courseName: "CS Elective 3 — Distributed Systems", units: 3 },
      { courseCode: "CS 408", courseName: "CS Elective 4 — Parallel Computing", units: 3 },
      { courseCode: "CS 409", courseName: "Practicum / On-the-Job Training", units: 6 },
    ],
  },
};

const SCHOOL_YEARS = {
  "1st Year": "2022-2023",
  "2nd Year": "2023-2024",
  "3rd Year": "2024-2025",
  "4th Year": "2025-2026",
};

const YEAR_ORDER = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function getSemesterSlots(currentYear) {
  const idx = YEAR_ORDER.indexOf(currentYear);
  if (idx === -1) return [];
  const result = [];
  for (let i = 0; i <= idx; i++) {
    const yr = YEAR_ORDER[i];
    result.push({ yearLevel: yr, semester: "1st Semester" });
    if (i < idx) {
      result.push({ yearLevel: yr, semester: "2nd Semester" });
    }
  }
  return result;
}

function generateAcademicHistory(program, currentYear) {
  const isCS = program && program.toLowerCase().includes("computer science");
  const subjectMap = isCS ? CS_SUBJECTS : IT_SUBJECTS;
  const semesterSlots = getSemesterSlots(currentYear);
  const history = [];

  for (const { yearLevel, semester } of semesterSlots) {
    const subjects = subjectMap[yearLevel]?.[semester];
    if (!subjects) continue;
    const section = getRandomSection(yearLevel, program);
    const schoolYear = SCHOOL_YEARS[yearLevel];
    for (const subject of subjects) {
      const grade = getRandomGrade();
      history.push({
        ...subject,
        schoolYear,
        yearLevel,
        semester,
        section,
        grade,
        remarks: parseFloat(grade) <= 3.0 ? "Passed" : "Failed",
      });
    }
  }

  return history;
}

async function seed() {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    const db = client.db("ccs_profiling_system");
    const students = await db.collection("students").find().toArray();
    let updatedCount = 0;
    for (const student of students) {
      const program = student.program || "BS Information Technology";
      const year = student.year || "4th Year";
      const academicHistory = generateAcademicHistory(program, year);
      await db.collection("students").updateOne(
        { _id: student._id },
        { $set: { academicHistory } }
      );
      updatedCount++;
    }
    console.log(`✅ Seeded ${updatedCount} students with program-specific academic history`);
  } catch (err) {
    console.error("❌ Seed failed:", err.message);
  } finally {
    await client.close();
  }
}

seed();