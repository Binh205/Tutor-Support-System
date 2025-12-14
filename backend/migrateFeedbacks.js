const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const DB_PATH = path.join(__dirname, "data.sqlite");
const db = new sqlite3.Database(DB_PATH);

console.log("Starting session_feedbacks table migration...");

db.serialize(() => {
  // Create session_feedbacks table
  db.run(
    `CREATE TABLE IF NOT EXISTS session_feedbacks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      class_id INTEGER NOT NULL,
      tutor_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      is_anonymous BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(session_id) REFERENCES sessions(id),
      FOREIGN KEY(student_id) REFERENCES users(id),
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(tutor_id) REFERENCES users(id),
      UNIQUE(session_id, student_id)
    )`,
    (err) => {
      if (err) {
        console.error("Error creating session_feedbacks table:", err);
      } else {
        console.log("✓ Created session_feedbacks table");
      }
    }
  );

  // Verify table creation
  setTimeout(() => {
    db.all("PRAGMA table_info(session_feedbacks)", (err, columns) => {
      if (err) {
        console.error("Error verifying table:", err);
      } else {
        console.log("\nTable columns:");
        columns.forEach((col) => {
          console.log(`  - ${col.name} (${col.type})`);
        });
      }
      db.close();
      console.log("\n✅ Migration completed!");
    });
  }, 100);
});
