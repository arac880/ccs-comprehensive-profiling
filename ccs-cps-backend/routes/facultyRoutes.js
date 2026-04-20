const express = require("express");
const router = express.Router();
const {
  getFaculties,
  getFacultyById,
  addFaculty,
  updateFaculty,
  deleteFaculty,
  changePassword,
} = require("../controllers/facultyController");

router.get("/", getFaculties);
router.get("/:id", getFacultyById);
router.post("/", addFaculty);
router.put("/:id", updateFaculty);
router.patch("/:id", deleteFaculty);
router.patch("/:id/change-password", changePassword);

module.exports = router;
