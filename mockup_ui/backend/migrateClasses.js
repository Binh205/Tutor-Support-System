const db = require('./db').db;

// Drop old classes table and recreate without UNIQUE constraint
db.serialize(() => {
  // Backup data first
  db.all('SELECT * FROM classes', [], (err, rows) => {
    if (err) {
      console.error('Error reading classes:', err);
      process.exit(1);
    }

    const classesBackup = rows || [];
    console.log('Backed up', classesBackup.length, 'classes');

    // Drop and recreate
    db.run('DROP TABLE IF EXISTS classes', (err) => {
      if (err) {
        console.error('Error dropping classes:', err);
        process.exit(1);
      }

      console.log('Dropped classes table');

      // Recreate without UNIQUE constraint
      db.run(`CREATE TABLE classes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        subject_id INTEGER NOT NULL,
        tutor_id INTEGER NOT NULL,
        semester_id INTEGER NOT NULL,
        max_capacity INTEGER DEFAULT 20,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(subject_id) REFERENCES subjects(id),
        FOREIGN KEY(tutor_id) REFERENCES users(id),
        FOREIGN KEY(semester_id) REFERENCES semesters(id)
      )`, (err) => {
        if (err) {
          console.error('Error creating classes:', err);
          process.exit(1);
        }

        console.log('Created new classes table (without UNIQUE constraint)');

        // Restore data
        if (classesBackup.length > 0) {
          const stmt = db.prepare('INSERT INTO classes (id, subject_id, tutor_id, semester_id, max_capacity, description, created_at) VALUES (?,?,?,?,?,?,?)');
          classesBackup.forEach(c => {
            stmt.run(c.id, c.subject_id, c.tutor_id, c.semester_id, c.max_capacity, c.description, c.created_at);
          });
          stmt.finalize(() => {
            console.log('Restored', classesBackup.length, 'classes');
            db.close();
            process.exit(0);
          });
        } else {
          console.log('No classes to restore');
          db.close();
          process.exit(0);
        }
      });
    });
  });
});
