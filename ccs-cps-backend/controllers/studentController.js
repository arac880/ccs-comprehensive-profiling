const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");
const getStudents = async (req, res) => {
  try {
    const db = getDB();
    const { section, program, year } = req.query;

    const PROGRAM_MAP = {
      BSIT: "BS Information Technology",
      BSCS: "BS Computer Science",
      
    };

    const filter = { isDeleted: { $ne: true } };

    if (section) filter.section = section;

    // year — decode spaces ("+Year" → " Year")
    if (year) filter.year = decodeURIComponent(year.replace(/\+/g, " "));

    // program — map short code to full name
    if (program) {
      const fullName = PROGRAM_MAP[program.toUpperCase()] ?? program;
      filter.program = fullName;
    }

    console.log("FINAL FILTER:", JSON.stringify(filter));

    const students = await db.collection("students").find(filter).toArray();

    console.log(`RESULT: ${students.length} students`);
    res.status(200).json(students);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch students", error: error.message });
  }
};
const generateDefaultClearance = () => {
  const isGradesCleared = Math.random() > 0.5; 
  const isAccountCleared = Math.random() > 0.5;
  const isLibraryCleared = Math.random() > 0.2;
  const isReqsCleared = Math.random() > 0.5;

  const randomBalance = Math.floor(Math.random() * 1900) + 100;

  return {
    summaryItems: [
      { isCleared: isGradesCleared, text: isGradesCleared ? "All grades for the 1st Semester have been submitted." : "Your grades for the 1st Semester have not all been submitted." },
      { isCleared: isAccountCleared, text: isAccountCleared ? "You have fully settled your account balance." : "You have pending miscellaneous/school fees." },
      { isCleared: isLibraryCleared, text: isLibraryCleared ? "You have no records of pending book/s borrowed." : "You have unreturned books or fines." },
      { isCleared: true, text: "You do not have any on-hold records." },
      { isCleared: isReqsCleared, text: isReqsCleared ? "All physical requirements are submitted." : "You have missing physical requirements." },
    ],
    pathway: {
      gradeStatus: {
        isCleared: isGradesCleared,
        statusText: isGradesCleared ? "COMPLETE" : "NOT YET COMPLETE",
        subtext: isGradesCleared ? "All grades have been verified." : "Grades for the 1st Semester have not all been submitted.",
        missingItems: isGradesCleared ? [] : ["ITP113 - IT Practicum", "ITEW6 - Web Development "]
      },
      accountStatus: {
        isCleared: isAccountCleared,
        statusText: isAccountCleared ? "CLEARED: ₱0.00" : `REMAINING BALANCE: ₱${randomBalance}.00`, 
        subtext: isAccountCleared ? "All financial obligations have been met." : "You have pending financial obligations for this semester.",
        tags: isAccountCleared ? ["All Fees Settled"] : ["ID Fee (Pending)", "Thesis Fee (Pending)"]
      },
      libraryStatus: {
        isCleared: isLibraryCleared,
        statusText: isLibraryCleared ? "CLEARED" : "PENDING FINES/BOOKS",
        subtext: isLibraryCleared ? "No unreturned books or outstanding fines." : "Please visit the library to settle your account."
      },
      requirements: {
        isCleared: isReqsCleared,
        statusText: isReqsCleared ? "ALL SUBMITTED" : "INCOMPLETE",
        subtext: isReqsCleared ? "All hardcopy documents have been verified." : "Pending hardcopy documents for verification.",
        tags: isReqsCleared ? ["Form 138 (Submitted)", "PSA Birth Cert (Submitted)", "Good Moral (Submitted)"] : ["Form 138 (Missing)", "PSA Birth Cert (Submitted)", "Good Moral (Missing)"]
      }
    }
  };
};


const addStudent = async (req, res) => {
  try {
    const db = getDB();
    const defaultPasswordString = req.body.birthdate || req.body.studentId;
    const salt = await bcrypt.genSalt(10);
    const defaultHashedPassword = await bcrypt.hash(
      defaultPasswordString,
      salt,
    );

    const newStudent = {
      ...req.body,
      password: defaultHashedPassword,
      type: req.body.type || "Regular",
      status: req.body.status || "Enrolled",
      role: "student",
      violations: [],
      academicHistory: [],
      skills: [],
      activities: [],
      organizations: [],
      sports: [],
      clearance: generateDefaultClearance() 
    };

    const result = await db.collection("students").insertOne(newStudent);
    res.status(201).json({
      message: "Student added successfully",
      studentId: result.insertedId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add student", error: error.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid student ID format" });

    const student = await db
      .collection("students")
      .findOne({ _id: new ObjectId(id), isDeleted: { $ne: true } });

    if (!student)
      return res
        .status(404)
        .json({ message: "Student not found or has been removed" });

        if (!student.clearance || Object.keys(student.clearance).length === 0) {
      const newClearance = generateDefaultClearance();
      student.clearance = newClearance;
      
      await db.collection("students").updateOne(
        { _id: new ObjectId(id) },
        { $set: { clearance: newClearance } }
      );
    }

    res.status(200).json(student);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch student", error: error.message });
  }
};

const updateStudent = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid student ID format" });

    const { _id, violations, academicHistory, password, role, clearance, ...updateData } =
      req.body;

    const result = await db
      .collection("students")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update student", error: error.message });
  }
};

const updateStudentClearance = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid student ID format" });
    if (!req.body.clearance) return res.status(400).json({ message: "Clearance data is required" });

    const result = await db.collection("students").updateOne(
      { _id: new ObjectId(id) },
      { $set: { clearance: req.body.clearance } }
    );

    if (result.matchedCount === 0) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Student clearance updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update clearance", error: error.message });
  }
};


const deleteStudent = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;

    // Extract the deleted data sent from your frontend
    const { isDeleted, deletedAt } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid student ID format" });
    }

    const result = await db.collection("students").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          isDeleted: isDeleted || true,
          deletedAt: deletedAt || new Date(),
        },
      },
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete student", error: error.message });
  }
};

const addViolation = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid student ID format" });

    const { description, date, severity } = req.body;
    if (!description || !date) {
      return res
        .status(400)
        .json({ message: "Description and date are required." });
    }

    const violation = {
      description,
      date,
      severity: severity || "Minor",
      recordedAt: new Date(),
    };

    const result = await db
      .collection("students")
      .findOneAndUpdate(
        { _id: new ObjectId(id) },
        { $push: { violations: violation } },
        { returnDocument: "after" },
      );

    if (!result) return res.status(404).json({ message: "Student not found" });
    res
      .status(200)
      .json({ message: "Violation added", violations: result.violations });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add violation", error: error.message });
  }
};

const deleteViolation = async (req, res) => {
  try {
    const db = getDB();
    const { id, index } = req.params;
    const idx = parseInt(index);
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid student ID format" });
    if (isNaN(idx) || idx < 0)
      return res.status(400).json({ message: "Invalid violation index" });

    const student = await db
      .collection("students")
      .findOne({ _id: new ObjectId(id) });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const violations = Array.isArray(student.violations)
      ? [...student.violations]
      : [];
    if (idx >= violations.length)
      return res.status(400).json({ message: "Violation index out of range" });

    violations.splice(idx, 1);

    await db
      .collection("students")
      .updateOne({ _id: new ObjectId(id) }, { $set: { violations } });

    res.status(200).json({ message: "Violation removed", violations });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete violation", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid student ID format" });

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both fields are required." });

    const student = await db
      .collection("students")
      .findOne({ _id: new ObjectId(id) });
    if (!student)
      return res.status(404).json({ message: "Student not found." });

    const isMatch = await bcrypt.compare(currentPassword, student.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await db
      .collection("students")
      .updateOne({ _id: new ObjectId(id) }, { $set: { password: hashed } });

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to change password", error: error.message });
  }
};

module.exports = {
  getStudents,
  addStudent,
  getStudentById,
  updateStudent,
  updateStudentClearance, 
  deleteStudent,
  addViolation,
  deleteViolation,
  changePassword,
};

