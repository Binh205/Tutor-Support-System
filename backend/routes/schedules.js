const express = require("express");
const router = express.Router();
const controller = require("../controllers/scheduleController");

// Semester routes
router.get("/semesters", controller.getSemestersHandler);
router.get("/current-semester", controller.getCurrentSemesterHandler);
router.get("/semester/:id", controller.getSemesterByIdHandler);

// Subject routes
router.get(
  "/semester/:semesterId/subjects",
  controller.getSubjectsBySemseterHandler
);

// Class routes
router.post("/class", controller.createClassHandler);
router.get("/classes", controller.getClassesByTutorHandler);
router.delete("/class/:classId", controller.deleteClassHandler);

// Free schedule routes
router.post("/schedule", controller.createFreeSchedule);
router.get("/schedule", controller.getFreeSchedule);
router.put("/schedule/:id", controller.updateFreeScheduleHandler);
router.delete("/schedule/:id", controller.deleteFreeScheduleHandler);

// Recurring schedules for a class
router.post(
  "/class/:classId/recurring-schedule",
  controller.createRecurringScheduleHandler
);
router.get(
  "/class/:classId/recurring-schedule",
  controller.listRecurringSchedulesHandler
);
router.put(
  "/class/:classId/recurring-schedule/:id",
  controller.updateRecurringScheduleHandler
);
router.delete(
  "/class/:classId/recurring-schedule/:id",
  controller.deleteRecurringScheduleHandler
);

// Get tutor's existing schedules (to check conflicts)
router.get("/tutor-schedules", controller.getTutorSchedulesHandler);

module.exports = router;
