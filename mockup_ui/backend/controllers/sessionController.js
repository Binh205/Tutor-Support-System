const db = require("../db");

// ===== Session Handlers =====

// Create a new session
const createSessionHandler = async (req, res, next) => {
  try {
    const {
      class_id,
      recurring_schedule_id,
      start_time,
      end_time,
      location_type,
      location_details,
      status,
      notes,
    } = req.body;

    if (!class_id || !start_time || !end_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const session = await db.createSession({
      class_id,
      recurring_schedule_id,
      start_time,
      end_time,
      location_type,
      location_details,
      status,
      notes,
    });

    res.status(201).json(session);
  } catch (error) {
    next(error);
  }
};

// Get session by ID
const getSessionByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const session = await db.getSessionById(id);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }
    res.json(session);
  } catch (error) {
    next(error);
  }
};

// Get sessions by student and month
const getStudentSessionsHandler = async (req, res, next) => {
  try {
    const student_id = req.query.studentId || req.query.student_id;
    const year = req.query.year;
    const month = req.query.month;

    if (!student_id || !year || !month) {
      return res
        .status(400)
        .json({ error: "studentId, year, and month are required" });
    }

    const sessions = await db.getSessionsByStudentAndMonth(
      student_id,
      parseInt(year),
      parseInt(month)
    );
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// Get sessions by tutor and month
const getTutorSessionsHandler = async (req, res, next) => {
  try {
    const tutor_id = req.query.tutorId || req.query.tutor_id;
    const year = req.query.year;
    const month = req.query.month;

    if (!tutor_id || !year || !month) {
      return res
        .status(400)
        .json({ error: "tutorId, year, and month are required" });
    }

    const sessions = await db.getSessionsByTutorAndMonth(
      tutor_id,
      parseInt(year),
      parseInt(month)
    );
    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

// Update session
const updateSessionHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = req.body;

    const session = await db.updateSession(id, fields);
    res.json(session);
  } catch (error) {
    next(error);
  }
};

// Cancel session
const cancelSessionHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { cancellation_reason } = req.body;

    if (!cancellation_reason) {
      return res.status(400).json({ error: "cancellation_reason is required" });
    }

    const session = await db.cancelSession(id, cancellation_reason);
    res.json(session);
  } catch (error) {
    next(error);
  }
};

// ===== Reschedule Poll Handlers =====

// Create a reschedule poll
const createPollHandler = async (req, res, next) => {
  try {
    const {
      cancelled_session_id,
      class_id,
      tutor_id,
      reason,
      options,
      deadline,
    } = req.body;

    if (
      !cancelled_session_id ||
      !class_id ||
      !tutor_id ||
      !options ||
      !deadline
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (!Array.isArray(options) || options.length === 0) {
      return res
        .status(400)
        .json({ error: "options must be a non-empty array" });
    }

    const poll = await db.createReschedulePoll({
      cancelled_session_id,
      class_id,
      tutor_id,
      reason,
      options,
      deadline,
    });

    res.status(201).json(poll);
  } catch (error) {
    next(error);
  }
};

// Get poll by ID
const getPollByIdHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const poll = await db.getPollById(id);
    if (!poll) {
      return res.status(404).json({ error: "Poll not found" });
    }
    res.json(poll);
  } catch (error) {
    next(error);
  }
};

// Get polls by class
const getPollsByClassHandler = async (req, res, next) => {
  try {
    const class_id = req.query.classId || req.query.class_id;
    if (!class_id) {
      return res.status(400).json({ error: "classId is required" });
    }

    const polls = await db.getPollsByClass(class_id);
    res.json(polls);
  } catch (error) {
    next(error);
  }
};

// Get polls by student
const getPollsByStudentHandler = async (req, res, next) => {
  try {
    const student_id = req.query.studentId || req.query.student_id;
    if (!student_id) {
      return res.status(400).json({ error: "studentId is required" });
    }

    const polls = await db.getPollsByStudent(student_id);
    res.json(polls);
  } catch (error) {
    next(error);
  }
};

// Vote on poll
const voteOnPollHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { student_id, option_id } = req.body;

    if (!student_id || option_id === undefined) {
      return res
        .status(400)
        .json({ error: "student_id and option_id are required" });
    }

    const vote = await db.voteOnPoll(id, student_id, option_id);
    res.json(vote);
  } catch (error) {
    next(error);
  }
};

// Get poll votes
const getPollVotesHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const votes = await db.getPollVotes(id);
    res.json(votes);
  } catch (error) {
    next(error);
  }
};

// Close poll
const closePollHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { selected_option_id, rescheduled_session_id } = req.body;

    if (selected_option_id === undefined || !rescheduled_session_id) {
      return res.status(400).json({
        error: "selected_option_id and rescheduled_session_id are required",
      });
    }

    const poll = await db.closePoll(id, selected_option_id, rescheduled_session_id);
    res.json(poll);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  // Sessions
  createSessionHandler,
  getSessionByIdHandler,
  getStudentSessionsHandler,
  getTutorSessionsHandler,
  updateSessionHandler,
  cancelSessionHandler,
  // Polls
  createPollHandler,
  getPollByIdHandler,
  getPollsByClassHandler,
  getPollsByStudentHandler,
  voteOnPollHandler,
  getPollVotesHandler,
  closePollHandler,
};
