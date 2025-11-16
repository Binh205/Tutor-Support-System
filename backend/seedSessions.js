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
      // Get recurring schedules for this class
      const schedules = await new Promise((resolve, reject) => {
        db.all(
          "SELECT * FROM recurring_schedules WHERE class_id = ?",
          [classData.id],
          (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
          }
        );
      });

      if (schedules.length === 0) {
        console.log(`No schedules found for class ${classData.id}, skipping...`);
        continue;
      }

      // November 2025 dates by day of week (0=Sunday, 1=Monday, etc.)
      const novemberDates = {
        0: [2, 9, 16, 23, 30], // Sunday
        1: [3, 10, 17, 24],    // Monday
        2: [4, 11, 18, 25],    // Tuesday
        3: [5, 12, 19, 26],    // Wednesday
        4: [6, 13, 20, 27],    // Thursday
        5: [7, 14, 21, 28],    // Friday
        6: [1, 8, 15, 22, 29], // Saturday
      };

      let sessionNumber = 1;

      for (const schedule of schedules) {
        const dates = novemberDates[schedule.day_of_week] || [];

        for (const day of dates) {
          const dateStr = `2025-11-${String(day).padStart(2, "0")}`;

          sessionsData.push({
            class_id: classData.id,
            session_number: sessionNumber++,
            start_time: `${dateStr} ${schedule.start_time}:00`,
            end_time: `${dateStr} ${schedule.end_time}:00`,
            location: "Phòng A101",
            status: "scheduled",
          });
        }
      }
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
