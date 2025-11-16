const { db } = require("./db");

async function seedSessions() {
  try {
    console.log("Starting to seed sessions...");

    // Get all classes
    const classes = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM classes", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    if (classes.length === 0) {
      console.log("No classes found. Please create classes first.");
      process.exit(1);
    }

    console.log(`Found ${classes.length} classes`);

    // Clear existing sessions
    await new Promise((resolve, reject) => {
      db.run("DELETE FROM sessions", (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
    console.log("Cleared old sessions");

    // Create sample sessions for November 2025
    const sessionsData = [];

    for (const classData of classes) {
      // Create 8 sessions for each class (2 per week for 4 weeks in November)
      const sessions = [
        {
          class_id: classData.id,
          session_number: 1,
          start_time: "2025-11-04 08:00:00",
          end_time: "2025-11-04 10:00:00",
          location: "Phòng A101",
          status: "scheduled",
        },
        {
          class_id: classData.id,
          session_number: 2,
          start_time: "2025-11-06 08:00:00",
          end_time: "2025-11-06 10:00:00",
          location: "Phòng A101",
          status: "scheduled",
        },
        {
          class_id: classData.id,
          session_number: 3,
          start_time: "2025-11-11 08:00:00",
          end_time: "2025-11-11 10:00:00",
          location: "Phòng A102",
          status: "scheduled",
        },
        {
          class_id: classData.id,
          session_number: 4,
          start_time: "2025-11-13 08:00:00",
          end_time: "2025-11-13 10:00:00",
          location: "Phòng A102",
          status: "scheduled",
        },
        {
          class_id: classData.id,
          session_number: 5,
          start_time: "2025-11-18 08:00:00",
          end_time: "2025-11-18 10:00:00",
          location: "Phòng B201",
          status: "scheduled",
        },
        {
          class_id: classData.id,
          session_number: 6,
          start_time: "2025-11-20 08:00:00",
          end_time: "2025-11-20 10:00:00",
          location: "Phòng B201",
          status: "scheduled",
        },
        {
          class_id: classData.id,
          session_number: 7,
          start_time: "2025-11-25 08:00:00",
          end_time: "2025-11-25 10:00:00",
          location: "Phòng C301",
          status: "scheduled",
        },
        {
          class_id: classData.id,
          session_number: 8,
          start_time: "2025-11-27 08:00:00",
          end_time: "2025-11-27 10:00:00",
          location: "Phòng C301",
          status: "scheduled",
        },
      ];

      sessionsData.push(...sessions);
    }

    // Insert all sessions
    for (const session of sessionsData) {
      await new Promise((resolve, reject) => {
        db.run(
          `INSERT INTO sessions (class_id, session_number, start_time, end_time, location, status)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            session.class_id,
            session.session_number,
            session.start_time,
            session.end_time,
            session.location,
            session.status,
          ],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });
    }

    console.log(`✅ Created ${sessionsData.length} sessions successfully!`);

    // Now create session_attendance records for registered students
    const registrations = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM class_registrations", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    console.log(`Found ${registrations.length} approved class registrations`);

    // For each registration, create attendance records for all sessions of that class
    const allSessions = await new Promise((resolve, reject) => {
      db.all("SELECT * FROM sessions", (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });

    let attendanceCount = 0;
    for (const reg of registrations) {
      const classSessions = allSessions.filter(s => s.class_id === reg.class_id);

      for (const session of classSessions) {
        await new Promise((resolve, reject) => {
          db.run(
            `INSERT INTO session_attendance (session_id, student_id, status, attended)
             VALUES (?, ?, 'registered', 0)`,
            [session.id, reg.student_id],
            (err) => {
              if (err) {
                // Ignore duplicate errors
                if (!err.message.includes('UNIQUE constraint')) {
                  reject(err);
                } else {
                  resolve();
                }
              } else {
                attendanceCount++;
                resolve();
              }
            }
          );
        });
      }
    }

    console.log(`✅ Created ${attendanceCount} session attendance records!`);
    console.log("\n✅ All seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding sessions failed:", err);
    process.exit(1);
  }
}

seedSessions();
