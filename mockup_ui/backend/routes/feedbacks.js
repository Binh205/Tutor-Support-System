const express = require("express");
const router = express.Router();
const {
  createFeedbackHandler,
  getTutorFeedbacksHandler,
  getCurrentClassesHandler,
  getCompletedSessionsNoFeedbackHandler,
} = require("../controllers/feedbackController");

// POST /api/feedbacks - create feedback
router.post("/", createFeedbackHandler);

// GET /api/feedbacks/tutor/:tutorId - get feedbacks for tutor
router.get("/tutor/:tutorId", getTutorFeedbacksHandler);

// GET /api/feedbacks/student/:studentId/current-classes - get current classes
router.get("/student/:studentId/current-classes", getCurrentClassesHandler);

// GET /api/feedbacks/class/:classId/completed-no-feedback - get completed sessions without feedback
router.get("/class/:classId/completed-no-feedback", getCompletedSessionsNoFeedbackHandler);

module.exports = router;
