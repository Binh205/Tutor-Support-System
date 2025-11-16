const {
  getUserByUsername,
  createSemester,
  createSubject,
  createClass,
  getSemesters,
  db,
} = require("./db");

async function seed() {
  try {
    // find tutor seeded earlier
    const tutor = await getUserByUsername("tutor");
    if (!tutor) {
      console.error("Tutor user not found. Run seedUsers.js first.");
      process.exit(1);
    }

    // Clear existing semesters, subjects to re-seed fresh data
    console.log("Clearing old semesters and subjects...");
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM subjects", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM semesters", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log("Cleared old data.");

    // Create demo semesters: HK251, HK252, HK253, HK261
    const semesterConfigs = [
      {
        code: "HK251",
        name: "Học kỳ 1 năm 2025-2026",
        start_date: "2025-09-01",
        end_date: "2025-12-31",
      },
      {
        code: "HK252",
        name: "Học kỳ 2 năm 2025-2026",
        start_date: "2026-02-01",
        end_date: "2026-06-30",
      },
      {
        code: "HK253",
        name: "Học kỳ hè 2026",
        start_date: "2026-06-15",
        end_date: "2026-09-15",
      },
      {
        code: "HK261",
        name: "Học kỳ 1 năm 2026-2027",
        start_date: "2026-09-01",
        end_date: "2026-12-31",
      },
    ];

    const semesterMap = {};
    for (const config of semesterConfigs) {
      const sem = await createSemester(config);
      semesterMap[config.code] = sem;
      console.log(`Created semester: ${sem.code}`);
    }

    // Create demo subjects for HK251
    const subjectConfigs = [
      {
        code: "CO3001",
        name: "Công nghệ phần mềm",
        semester_id: semesterMap["HK251"].id,
      },
      {
        code: "CO3011",
        name: "Hệ điều hành",
        semester_id: semesterMap["HK251"].id,
      },
      {
        code: "CO3021",
        name: "Lập trình hướng đối tượng",
        semester_id: semesterMap["HK251"].id,
      },
    ];

    for (const config of subjectConfigs) {
      const subj = await createSubject({
        ...config,
        description: `Subject ${config.code}`,
        total_students: 100,
      });
      console.log(`Created subject: ${subj.code}`);
    }

    process.exit(0);
  } catch (err) {
    console.error("Seeding schedules failed", err);
    process.exit(1);
  }
}

seed();
