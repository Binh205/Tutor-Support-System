const { createSemester, getSemesters, db } = require("./db");

async function seedSemesters() {
  try {
    console.log("Starting to seed semesters...\n");

    // Danh sách semesters
    const semesters = [
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

    for (const semesterData of semesters) {
      try {
        // Kiểm tra xem semester đã tồn tại chưa
        const checkExisting = await new Promise((resolve, reject) => {
          db.get(
            "SELECT * FROM semesters WHERE code = ?",
            [semesterData.code],
            (err, row) => {
              if (err) return reject(err);
              resolve(row);
            }
          );
        });

        if (checkExisting) {
          console.log(`Semester ${semesterData.code} already exists, skipping...`);
          continue;
        }

        // Tạo semester mới
        const semester = await createSemester(semesterData);
        console.log(
          `✓ Created: ${semester.code} - ${semester.name} (${semester.start_date} to ${semester.end_date})`
        );
      } catch (error) {
        console.error(
          `✗ Error creating semester ${semesterData.code}:`,
          error.message
        );
      }
    }

    console.log("\n✅ Seeding semesters completed!");

    // Hiển thị tất cả semesters hiện có
    const allSemesters = await getSemesters();
    console.log("\nAll semesters in database:");
    allSemesters.forEach((s) => {
      console.log(`  - ${s.code}: ${s.name} (${s.start_date} to ${s.end_date})`);
    });

    db.close();
  } catch (error) {
    console.error("Error seeding semesters:", error);
    db.close();
    process.exit(1);
  }
}

seedSemesters();
