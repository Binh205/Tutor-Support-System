const db = require("../db");

// Create feedback
const createFeedbackHandler = async (req, res, next) => {
  try {
    const { session_id, student_id, class_id, tutor_id, rating, comment, is_anonymous } = req.body;

    if (!session_id || !student_id || !class_id || !tutor_id || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ error: "Rating must be between 1 and 5" });
    }

    const feedback = await db.createFeedback({
      session_id,
      student_id,
      class_id,
      tutor_id,
      rating,
      comment,
      is_anonymous,
    });

    res.status(201).json(feedback);
  } catch (error) {
    if (error.message && error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: "Bạn đã feedback buổi học này rồi" });
    }
    next(error);
  }
};

// Get feedbacks for tutor
const getTutorFeedbacksHandler = async (req, res, next) => {
  try {
    const { tutorId } = req.params;
    const { semesterId, classId } = req.query;

    const feedbacks = await db.getFeedbacksByTutor(
      tutorId,
      semesterId ? parseInt(semesterId) : null,
      classId ? parseInt(classId) : null
    );

    res.json(feedbacks);
  } catch (error) {
    next(error);
  }
};

// Get current classes for student (classes đang học)
const getCurrentClassesHandler = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    const classes = await db.getCurrentClassesByStudent(studentId);
    res.json(classes);
  } catch (error) {
    next(error);
  }
};

// Get completed sessions without feedback
const getCompletedSessionsNoFeedbackHandler = async (req, res, next) => {
  try {
    const { classId } = req.params;
    const { studentId } = req.query;

    if (!studentId) {
      return res.status(400).json({ error: "studentId is required" });
    }

    const sessions = await db.getCompletedSessionsWithoutFeedback(
      parseInt(classId),
      parseInt(studentId)
    );

    res.json(sessions);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createFeedbackHandler,
  getTutorFeedbacksHandler,
  getCurrentClassesHandler,
  getCompletedSessionsNoFeedbackHandler,
};
