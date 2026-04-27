require("dotenv").config();
const { MongoClient } = require("mongodb");
const bcrypt = require("bcryptjs");

const programs = ["BS Information Technology", "BS Computer Science"];
const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
const sections = ["A", "B", "C", "D"];

const firstNames = [
  "Joshua", "Christian", "Justin", "Angelo", "Gabriel", "Carlo", "Kyle", "Andrei", "Ian", "Kian", 
  "Adrian", "Mark", "John", "Paul", "Miguel", "Luis", "Rafael", "Paolo", "Gian", "Jeric", 
  "Jayson", "Jerome", "Kevin", "Aaron", "Bryan", "Andrea", "Nicole", "Angel", "Kyla", "Bea", 
  "Mikaela", "Chloe", "Sofia", "Althea", "Jasmine", "Samantha", "Ashley", "Camille", "Julia", "Nadine", 
  "Kathryn", "Liza", "Janine", "Bianca", "Kyline", "Francine", "Glaiza", "Rochelle", "Maxine", "Sarah"
];

const lastNames = [
  "Dela Cruz", "Garcia", "Reyes", "Ramos", "Mendoza", "Santos", "Flores", "Gonzales", "Bautista", "Villanueva", 
  "Fernandez", "Cruz", "De Leon", "Perez", "Tolentino", "Soriano", "Castillo", "Alvarez", "Sarmiento", "Navarro", 
  "Castro", "Rivera", "Aquino", "Salazar", "Mercado", "Pascual", "Domingo", "Roxas", "Molina", "Agustin", 
  "Morales", "Del Rosario", "Ignacio", "Guzman", "Ocampo", "Gomez", "Velasco", "Rodriguez", "Santiago", "Cortez", 
  "Ferrer", "Manalo", "Legaspi", "Pineda", "Miranda", "Villar", "Sy", "Tan", "Lim", "Chua"
];

const IT_SUBJECTS = {
  "1st Year": {
    "1st Semester": [{ courseCode: "IT101", courseName: "Introduction to Computing", units: 3 }],
    "2nd Semester": [{ courseCode: "IT103", courseName: "Computer Programming 2", units: 3 }],
  },
  "2nd Year": {
    "1st Semester": [{ courseCode: "IT201", courseName: "Data Structures and Algorithms", units: 3 }],
    "2nd Semester": [{ courseCode: "IT206", courseName: "Web Systems and Technologies 1", units: 3 }],
  },
  "3rd Year": {
    "1st Semester": [{ courseCode: "IT301", courseName: "Web Systems and Technologies 2", units: 3 }],
    "2nd Semester": [{ courseCode: "IT307", courseName: "Software Engineering", units: 3 }],
  },
  "4th Year": {
    "1st Semester": [{ courseCode: "IT401", courseName: "Capstone Project 1", units: 3 }],
    "2nd Semester": [{ courseCode: "IT406", courseName: "Capstone Project 2", units: 3 }],
  },
};

const CS_SUBJECTS = {
  "1st Year": {
    "1st Semester": [{ courseCode: "CS101", courseName: "Introduction to Computer Science", units: 3 }],
    "2nd Semester": [{ courseCode: "CS103", courseName: "Computer Programming 2", units: 3 }],
  },
  "2nd Year": {
    "1st Semester": [{ courseCode: "CS201", courseName: "Data Structures", units: 3 }],
    "2nd Semester": [{ courseCode: "CS206", courseName: "Database Systems", units: 3 }],
  },
  "3rd Year": {
    "1st Semester": [{ courseCode: "CS301", courseName: "Programming Languages", units: 3 }],
    "2nd Semester": [{ courseCode: "CS308", courseName: "Artificial Intelligence", units: 3 }],
  },
  "4th Year": {
    "1st Semester": [{ courseCode: "CS401", courseName: "Thesis Writing 1", units: 3 }],
    "2nd Semester": [{ courseCode: "CS406", courseName: "Thesis Writing 2", units: 3 }],
  },
};

function getRandomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomGrade() {
  const grades = ["1.00", "1.25", "1.50", "1.75", "2.00", "2.25", "2.50", "2.75", "3.00"];
  return grades[Math.floor(Math.random() * grades.length)];
}

const YEAR_ORDER = ["1st Year", "2nd Year", "3rd Year", "4th Year"];

function getSemesterSlots(currentYear) {
  const idx = YEAR_ORDER.indexOf(currentYear);
  if (idx === -1) return [];
  const result = [];
  for (let i = 0; i <= idx; i++) {
    const yr = YEAR_ORDER[i];
    result.push({ yearLevel: yr, semester: "1st Semester" });
    result.push({ yearLevel: yr, semester: "2nd Semester" });
  }
  return result;
}

function generateAcademicHistory(program, currentYear, assignedSection) {
  const subjectMap = program.includes("Computer Science") ? CS_SUBJECTS : IT_SUBJECTS;
  const semesterSlots = getSemesterSlots(currentYear);
  const history = [];

  for (const { yearLevel, semester } of semesterSlots) {
    const subjects = subjectMap[yearLevel]?.[semester];
    if (!subjects) continue;
    
    const isCurrent = (yearLevel === currentYear && semester === "2nd Semester");
    const recordSection = isCurrent ? assignedSection : getRandomItem(sections);

    for (const subject of subjects) {
      const grade = getRandomGrade();
      history.push({
        ...subject,
        schoolYear: "2025-2026",
        yearLevel,
        semester,
        section: recordSection,
        grade,
        remarks: parseFloat(grade) <= 3.0 ? "Passed" : "Failed",
      });
    }
  }

  return history;
}

async function seed1000Students() {
  const client = new MongoClient(process.env.MONGO_URI);
  
  try {
    await client.connect();
    const db = client.db("ccs_profiling_system");
    
    // ✅ REMOVED deleteMany() to keep current data
    console.log("Adding 1,000 new students to existing database...");
    
    const students = [];
    const salt = await bcrypt.genSalt(10);

    // Get the current highest student count to avoid ID collisions if needed
    const currentCount = await db.collection("students").countDocuments();

    for (let i = 1; i <= 1000; i++) {
      const firstName = getRandomItem(firstNames);
      const lastName = getRandomItem(lastNames);
      const program = getRandomItem(programs);
      const year = getRandomItem(years);
      const assignedSection = getRandomItem(sections);
      
      // Use currentCount + i to ensure unique Student IDs
      const uniqueIndex = currentCount + i;
      const studentId = `2025${String(uniqueIndex).padStart(5, '0')}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${uniqueIndex}@example.com`;
      
      const hashedPassword = await bcrypt.hash(studentId, salt);

      students.push({
        studentId: studentId,
        firstName: firstName,
        lastName: lastName,
        program: program,
        year: year,
        section: assignedSection, 
        email: email,
        type: "Regular",
        status: "Enrolled",
        role: "student",
        password: hashedPassword,
        academicHistory: generateAcademicHistory(program, year, assignedSection),
        clearance: {}, 
        violations: [],
        skills: [],
        activities: [],
        organizations: [],
        sports: [],
        createdAt: new Date(),
        isDeleted: false
      });
      
      if (i % 100 === 0) console.log(`Generated ${i} / 1000...`);
    }

    console.log("Inserting 1,000 new records into MongoDB...");
    const result = await db.collection("students").insertMany(students);

    console.log(`SUCCESS! Added ${result.insertedCount} new students. Total students now: ${currentCount + result.insertedCount}`);
    
  } catch (err) {
    console.error("Seed failed:", err.message);
  } finally {
    await client.close();
  }
}

seed1000Students();