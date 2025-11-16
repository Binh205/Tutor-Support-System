const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.sqlite');

console.log('Starting sessions table migration...');

db.serialize(() => {
  // Drop the old sessions table
  db.run('DROP TABLE IF EXISTS sessions', (err) => {
    if (err) {
      console.error('Error dropping sessions table:', err);
      return;
    }
    console.log('✓ Old sessions table dropped');
  });

  // Create new sessions table with correct schema
  db.run(`
    CREATE TABLE sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      session_number INTEGER NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      location TEXT,
      status TEXT DEFAULT 'scheduled',
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(class_id) REFERENCES classes(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error creating sessions table:', err);
      return;
    }
    console.log('✓ New sessions table created');
  });

  // Drop and recreate session_attendance table if needed
  db.run('DROP TABLE IF EXISTS session_attendance', (err) => {
    if (err) {
      console.error('Error dropping session_attendance table:', err);
      return;
    }
    console.log('✓ Old session_attendance table dropped');
  });

  db.run(`
    CREATE TABLE session_attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      status TEXT DEFAULT 'registered',
      attended BOOLEAN DEFAULT 0,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(session_id) REFERENCES sessions(id) ON DELETE CASCADE,
      FOREIGN KEY(student_id) REFERENCES users(id),
      UNIQUE(session_id, student_id)
    )
  `, (err) => {
    if (err) {
      console.error('Error creating session_attendance table:', err);
      db.close();
      return;
    }
    console.log('✓ New session_attendance table created');
    console.log('\n✅ Migration completed successfully!');
    db.close();
  });
});
