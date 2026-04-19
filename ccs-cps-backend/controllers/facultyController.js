const { getDB } = require("../config/db");
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const getFaculties = async (req, res) => {
  try {
    const db = getDB();
    const faculties = await db
      .collection("faculty")
      .find({}, { projection: { password: 0 } })
      .toArray();
    res.status(200).json(faculties);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch faculties", error: error.message });
  }
};

const getFacultyById = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid faculty ID format" });

    const faculty = await db
      .collection("faculty")
      .findOne({ _id: new ObjectId(id) }, { projection: { password: 0 } });

    if (!faculty) return res.status(404).json({ message: "Faculty not found" });

    res.status(200).json(faculty);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch faculty", error: error.message });
  }
};

const addFaculty = async (req, res) => {
  try {
    const db = getDB();
    const defaultPassword = req.body.birthdate || req.body.facultyId;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(defaultPassword, salt);

    const newFaculty = {
      ...req.body,
      password: hashedPassword,
      role: req.body.role || "Faculty",
      schedule: [],
      yearsAsFaculty: 0,
      yearsAsDean: 0,
      yearsAsDepartmentChair: 0,
      twoFAEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("faculty").insertOne(newFaculty);
    res.status(201).json({
      message: "Faculty added successfully",
      facultyId: result.insertedId,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to add faculty", error: error.message });
  }
};

const updateFaculty = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid faculty ID format" });

    const { _id, password, ...updateData } = req.body;
    updateData.updatedAt = new Date();

    const result = await db
      .collection("faculty")
      .updateOne({ _id: new ObjectId(id) }, { $set: updateData });

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Faculty not found" });

    res.status(200).json({ message: "Faculty updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update faculty", error: error.message });
  }
};

const deleteFaculty = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid faculty ID format" });

    const result = await db
      .collection("faculty")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { isDeleted: true, deletedAt: new Date() } },
      );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Faculty not found" });

    res.status(200).json({ message: "Faculty deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to delete faculty", error: error.message });
  }
};

const changePassword = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    if (!ObjectId.isValid(id))
      return res.status(400).json({ message: "Invalid faculty ID format" });

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res.status(400).json({ message: "Both fields are required." });

    const faculty = await db
      .collection("faculty")
      .findOne({ _id: new ObjectId(id) });
    if (!faculty)
      return res.status(404).json({ message: "Faculty not found." });

    const isMatch = await bcrypt.compare(currentPassword, faculty.password);
    if (!isMatch)
      return res
        .status(401)
        .json({ message: "Current password is incorrect." });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    await db
      .collection("faculty")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { password: hashed, updatedAt: new Date() } },
      );

    res.status(200).json({ message: "Password changed successfully." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to change password", error: error.message });
  }
};

module.exports = {
  getFaculties,
  getFacultyById,
  addFaculty,
  updateFaculty,
  deleteFaculty,
  changePassword,
};
