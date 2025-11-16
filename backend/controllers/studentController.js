const db = require("../db");

// Get current semester
async function getCurrentSemesterHandler(req, res, next) {
  try {
    const semester = await db.getCurrentSemester();
    if (!semester) {
      return res.status(404).json({ error: "No active semester found" });
    }
    res.json(semester);
  } catch (err) {
    next(err);
  }
}

// Get subjects by semester
async function getSubjectsHandler(req, res, next) {
  try {
    const semester_id = req.query.semesterId || req.query.semester_id;
    if (!semester_id) {
      return res.status(400).json({ error: "semesterId required" });
    }

    const subjects = await db.getSubjectsBySemester(semester_id);
    res.json(subjects);
  } catch (err) {
    next(err);
  }
}

// Get classes by subject
async function getClassesBySubjectHandler(req, res, next) {
  try {
    const subject_id = req.query.subjectId || req.query.subject_id;
    if (!subject_id) {
      return res.status(400).json({ error: "subjectId required" });
    }

    const classes = await db.getClassesBySubject(subject_id);
    res.json(classes);
  } catch (err) {
    next(err);
  }
}

// Get all available classes for student (by semester)
async function getAvailableClassesHandler(req, res, next) {
  try {
    const semester_id = req.query.semesterId || req.query.semester_id;
    if (!semester_id) {
      return res.status(400).json({ error: "semesterId required" });
    }

    const classes = await db.getClassesForStudent(semester_id);
    res.json(classes);
  } catch (err) {
    next(err);
  }
}

// Register student in a class
async function registerClassHandler(req, res, next) {
  try {
    const class_id = req.params.classId;
    const { student_id } = req.body;

    if (!class_id || !student_id) {
      return res.status(400).json({ error: "classId and student_id required" });
    }

    // Check if class exists
    const classExists = await db.getClassById(class_id);
    if (!classExists) {
      return res.status(404).json({ error: "Class not found" });
    }

    try {
      const registration = await db.registerStudentInClass(
        class_id,
        student_id
      );
      res.status(201).json({
        success: true,
        message: "Đã đăng ký thành công",
        registration,
      });
    } catch (error) {
      if (error.statusCode === 409) {
        return res.status(409).json({ error: error.message });
      }
      throw error;
    }
  } catch (err) {
    next(err);
  }
}

// Get student's registered classes
async function getStudentRegisteredClassesHandler(req, res, next) {
  try {
    const student_id = req.params.studentId || req.query.studentId;
    if (!student_id) {
      return res.status(400).json({ error: "studentId required" });
    }

    const classes = await db.getRegisteredClassesByStudent(student_id);
    res.json(classes);
  } catch (err) {
    next(err);
  }
}

// Unregister student from class
async function unregisterClassHandler(req, res, next) {
  try {
    const class_id = req.params.classId;
    const { student_id } = req.body;

    if (!class_id || !student_id) {
      return res.status(400).json({ error: "classId and student_id required" });
    }

    const result = await db.unregisterStudentFromClass(class_id, student_id);
    res.json({
      success: true,
      message: "Đã hủy đăng ký",
      result,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getCurrentSemesterHandler,
  getSubjectsHandler,
  getClassesBySubjectHandler,
  getAvailableClassesHandler,
  registerClassHandler,
  getStudentRegisteredClassesHandler,
  unregisterClassHandler,
};
