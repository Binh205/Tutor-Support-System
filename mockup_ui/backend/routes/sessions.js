const express = require("express");
const router = express.Router();
const {
  createSessionHandler,
  getSessionByIdHandler,
  getStudentSessionsHandler,
  getTutorSessionsHandler,
  updateSessionHandler,
  cancelSessionHandler,
  createPollHandler,
  getPollByIdHandler,
  getPollsByClassHandler,
  getPollsByStudentHandler,
  voteOnPollHandler,
  getPollVotesHandler,
  closePollHandler,
} = require("../controllers/sessionController");

// ===== Session Routes =====

// POST /api/sessions - create a new session
router.post("/", createSessionHandler);

// GET /api/sessions/:id - get session by ID
router.get("/:id", getSessionByIdHandler);

// GET /api/sessions/student/calendar - get student's sessions by month
router.get("/student/calendar", getStudentSessionsHandler);

// GET /api/sessions/tutor/calendar - get tutor's sessions by month
router.get("/tutor/calendar", getTutorSessionsHandler);

// PUT /api/sessions/:id - update session
router.put("/:id", updateSessionHandler);

// POST /api/sessions/:id/cancel - cancel session
router.post("/:id/cancel", cancelSessionHandler);

// ===== Poll Routes =====

// POST /api/sessions/polls - create a reschedule poll
router.post("/polls", createPollHandler);

// GET /api/sessions/polls/:id - get poll by ID
router.get("/polls/:id", getPollByIdHandler);

// GET /api/sessions/polls/class/:classId - get polls by class
router.get("/polls/class/:classId", getPollsByClassHandler);

// GET /api/sessions/polls/student/:studentId - get polls for student
router.get("/polls/student/:studentId", getPollsByStudentHandler);

// POST /api/sessions/polls/:id/vote - vote on a poll
router.post("/polls/:id/vote", voteOnPollHandler);

// GET /api/sessions/polls/:id/votes - get poll votes
router.get("/polls/:id/votes", getPollVotesHandler);

// POST /api/sessions/polls/:id/close - close a poll
router.post("/polls/:id/close", closePollHandler);

module.exports = router;
