const db = require("../db");

// Semester handlers
async function getSemestersHandler(req, res, next) {
  try {
    const rows = await db.getSemesters();
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getSemesterByIdHandler(req, res, next) {
  try {
    const id = req.params.id;
    const row = await db.getSemesterById(id);
    if (!row) return res.status(404).json({ error: "Semester not found" });
    res.json(row);
  } catch (err) {
    next(err);
  }
}

// Subject handlers
async function getSubjectsBySemseterHandler(req, res, next) {
  try {
    const semester_id = req.params.semesterId;
    if (!semester_id)
      return res.status(400).json({ error: "semesterId required" });
    const rows = await db.getSubjectsBySemester(semester_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

// Free Schedule handlers
async function createFreeSchedule(req, res, next) {
  try {
    const { tutor_id, semester_id, days_of_week, start_time, end_time } =
      req.body;
    if (
      !tutor_id ||
      !semester_id ||
      !days_of_week ||
      !start_time ||
      !end_time
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    if (!Array.isArray(days_of_week) || days_of_week.length === 0) {
      return res
        .status(400)
        .json({ error: "days_of_week must be a non-empty array" });
    }

    const row = await db.createFreeSchedule({
      tutor_id,
      semester_id,
      days_of_week,
      start_time,
      end_time,
    });
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}

async function getFreeSchedule(req, res, next) {
  try {
    const tutor_id = req.query.tutorId || req.query.tutor_id;
    const semester_id = req.query.semesterId || req.query.semester_id;
    if (!tutor_id || !semester_id)
      return res.status(400).json({ error: "tutorId and semesterId required" });
    const row = await db.getFreeScheduleByTutorAndSemester(
      tutor_id,
      semester_id
    );
    if (!row) return res.status(404).json({ error: "Free schedule not found" });
    res.json(row);
  } catch (err) {
    next(err);
  }
}

async function updateFreeScheduleHandler(req, res, next) {
  try {
    const id = req.params.id;
    const fields = req.body;
    if (fields.days_of_week && !Array.isArray(fields.days_of_week)) {
      return res.status(400).json({ error: "days_of_week must be array" });
    }
    const row = await db.updateFreeSchedule(id, fields);
    res.json(row);
  } catch (err) {
    next(err);
  }
}

async function deleteFreeScheduleHandler(req, res, next) {
  try {
    const id = req.params.id;
    const result = await db.deleteFreeSchedule(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Recurring Schedule handlers
async function createRecurringScheduleHandler(req, res, next) {
  try {
    const class_id = req.params.classId;
    const { day_of_week, start_time, end_time, start_week, end_week } =
      req.body;
    if (!class_id || day_of_week === undefined || !start_time || !end_time) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const row = await db.createRecurringSchedule({
      class_id,
      day_of_week,
      start_time,
      end_time,
      start_week: start_week || 1,
      end_week: end_week || 15,
    });
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}

async function listRecurringSchedulesHandler(req, res, next) {
  try {
    const class_id = req.params.classId;
    if (!class_id) return res.status(400).json({ error: "classId required" });
    const rows = await db.getRecurringSchedulesByClass(class_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function updateRecurringScheduleHandler(req, res, next) {
  try {
    const id = req.params.id;
    const fields = req.body;
    const row = await db.updateRecurringSchedule(id, fields);
    res.json(row);
  } catch (err) {
    next(err);
  }
}

async function deleteRecurringScheduleHandler(req, res, next) {
  try {
    const id = req.params.id;
    const result = await db.deleteRecurringSchedule(id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

// Class handlers
async function createClassHandler(req, res, next) {
  try {
    const { subject_id, tutor_id, semester_id, max_capacity, description } =
      req.body;
    if (!subject_id || !tutor_id || !semester_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const row = await db.createClass({
      subject_id,
      tutor_id,
      semester_id,
      max_capacity: max_capacity || 20,
      description: description || "",
    });
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
}

async function getClassesByTutorHandler(req, res, next) {
  try {
    const tutor_id = req.query.tutorId || req.query.tutor_id;
    const semester_id = req.query.semesterId || req.query.semester_id;
    if (!tutor_id || !semester_id) {
      return res.status(400).json({ error: "tutorId and semesterId required" });
    }

    const rows = await db.getClassesByTutorAndSemester(tutor_id, semester_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

async function getTutorSchedulesHandler(req, res, next) {
  try {
    const tutor_id = req.query.tutorId || req.query.tutor_id;
    const semester_id = req.query.semesterId || req.query.semester_id;
    if (!tutor_id || !semester_id) {
      return res.status(400).json({ error: "tutorId and semesterId required" });
    }

    const rows = await db.getRecurringSchedulesByTutorAndSemester(tutor_id, semester_id);
    res.json(rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getSemestersHandler,
  getSemesterByIdHandler,
  getSubjectsBySemseterHandler,
  createFreeSchedule,
  getFreeSchedule,
  updateFreeScheduleHandler,
  deleteFreeScheduleHandler,
  createRecurringScheduleHandler,
  listRecurringSchedulesHandler,
  updateRecurringScheduleHandler,
  deleteRecurringScheduleHandler,
  createClassHandler,
  getClassesByTutorHandler,
  getTutorSchedulesHandler,
};
