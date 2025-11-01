const { getSessions, getSessionsByStudent, getTutors } = require("../mockDB");

// Get all sessions
const getAllSessions = (req, res) => {
  try {
    const sessions = getSessions();
    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// Get sessions by student
const getStudentSessions = (req, res) => {
  try {
    const { studentId } = req.params;

    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    const sessions = getSessionsByStudent(parseInt(studentId));
    res.json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Get student sessions error:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// Get all tutors
const getAllTutors = (req, res) => {
  try {
    const tutors = getTutors();
    res.json({
      success: true,
      tutors,
    });
  } catch (error) {
    console.error("Get tutors error:", error);
    res.status(500).json({ error: "Failed to fetch tutors" });
  }
};

module.exports = {
  getAllSessions,
  getStudentSessions,
  getAllTutors,
};
