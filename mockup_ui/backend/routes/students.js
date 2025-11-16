const express = require("express");
const router = express.Router();
const controller = require("../controllers/studentController");

// GET /api/student/current-semester - get current semester
router.get("/current-semester", controller.getCurrentSemesterHandler);

// GET /api/student/subjects - get subjects by semester
router.get("/subjects", controller.getSubjectsHandler);

// GET /api/student/classes-by-subject - get classes by subject
router.get("/classes-by-subject", controller.getClassesBySubjectHandler);

// GET /api/student/classes - get available classes by semester
router.get("/classes", controller.getAvailableClassesHandler);

// POST /api/student/classes/:classId/register - register student in class
router.post("/classes/:classId/register", controller.registerClassHandler);

// GET /api/student/registered-classes - get student's registered classes
router.get(
  "/registered-classes",
  controller.getStudentRegisteredClassesHandler
);

// DELETE /api/student/classes/:classId/unregister - unregister from class
router.delete(
  "/classes/:classId/unregister",
  controller.unregisterClassHandler
);

module.exports = router;
