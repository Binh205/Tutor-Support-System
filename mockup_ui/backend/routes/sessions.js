const express = require("express");
const router = express.Router();
const {
  getAllSessions,
  getStudentSessions,
  getAllTutors,
} = require("../controllers/sessionController");

// GET /api/sessions - get all sessions
router.get("/", getAllSessions);

// GET /api/sessions/student/:studentId - get student's sessions
router.get("/student/:studentId", getStudentSessions);

// GET /api/sessions/tutors - get all tutors
router.get("/tutors", getAllTutors);

module.exports = router;
