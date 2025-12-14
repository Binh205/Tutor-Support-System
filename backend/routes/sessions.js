const express = require("express");
const router = express.Router();
const {
  createSessionHandler,
  getSessionByIdHandler,
  getStudentSessionsHandler,
  getTutorSessionsHandler,
  getStudentSessionsBySemesterHandler,
  getTutorSessionsBySemesterHandler,
  updateSessionHandler,
  cancelSessionHandler,
  rescheduleSessionHandler,
  completeSessionHandler,
  createPollHandler,
  getPollByIdHandler,
  getPollsByClassHandler,
  getPollsByStudentHandler,
  voteOnPollHandler,
  getPollVotesHandler,
  closePollHandler,
} = require("../controllers/sessionController");

// ===== Poll Routes (MUST BE BEFORE :id routes to avoid conflicts) =====

// POST /api/sessions/polls - create a reschedule poll
router.post("/polls", createPollHandler);

// GET /api/sessions/polls/class/:classId - get polls by class
router.get("/polls/class/:classId", getPollsByClassHandler);

// GET /api/sessions/polls/student/:studentId - get polls for student
router.get("/polls/student/:studentId", getPollsByStudentHandler);

// GET /api/sessions/polls/:id/votes - get poll votes
router.get("/polls/:id/votes", getPollVotesHandler);

// GET /api/sessions/polls/:id - get poll by ID
router.get("/polls/:id", getPollByIdHandler);

// POST /api/sessions/polls/:id/vote - vote on a poll
router.post("/polls/:id/vote", voteOnPollHandler);

// POST /api/sessions/polls/:id/close - close a poll
router.post("/polls/:id/close", closePollHandler);

// ===== Session Routes =====

// POST /api/sessions - create a new session
router.post("/", createSessionHandler);

// GET /api/sessions/student/calendar - get student's sessions by month
router.get("/student/calendar", getStudentSessionsHandler);

// GET /api/sessions/tutor/calendar - get tutor's sessions by month
router.get("/tutor/calendar", getTutorSessionsHandler);

// GET /api/sessions/student/semester - get student's sessions by semester (for stats)
router.get("/student/semester", getStudentSessionsBySemesterHandler);

// GET /api/sessions/tutor/semester - get tutor's sessions by semester (for stats)
router.get("/tutor/semester", getTutorSessionsBySemesterHandler);

// POST /api/sessions/:id/cancel - cancel session
router.post("/:id/cancel", cancelSessionHandler);

// POST /api/sessions/:id/reschedule - reschedule cancelled session
router.post("/:id/reschedule", rescheduleSessionHandler);

// POST /api/sessions/:id/complete - mark session as completed
router.post("/:id/complete", completeSessionHandler);

// PUT /api/sessions/:id - update session
router.put("/:id", updateSessionHandler);

// GET /api/sessions/:id - get session by ID (MUST BE LAST to avoid conflicts)
router.get("/:id", getSessionByIdHandler);

module.exports = router;
