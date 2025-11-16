const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(DB_PATH);

console.log('Starting sessions table migration...');

db.serialize(() => {
  // Check if recurring_schedule_id column exists
  db.all("PRAGMA table_info(sessions)", (err, columns) => {
    if (err) {
      console.error('Error checking table schema:', err);
      db.close();
      return;
    }

    const hasRecurringScheduleId = columns.some(col => col.name === 'recurring_schedule_id');
    const hasRescheduledToSessionId = columns.some(col => col.name === 'rescheduled_to_session_id');

    console.log('Current columns:', columns.map(c => c.name).join(', '));
    console.log('Has recurring_schedule_id:', hasRecurringScheduleId);
    console.log('Has rescheduled_to_session_id:', hasRescheduledToSessionId);

    // Add missing columns
    if (!hasRecurringScheduleId) {
      console.log('Adding recurring_schedule_id column...');
      db.run(
        "ALTER TABLE sessions ADD COLUMN recurring_schedule_id INTEGER",
        (err) => {
          if (err) {
            console.error('Error adding recurring_schedule_id:', err);
          } else {
            console.log('✓ Added recurring_schedule_id column');
          }
        }
      );
    }

    if (!hasRescheduledToSessionId) {
      console.log('Adding rescheduled_to_session_id column...');
      db.run(
        "ALTER TABLE sessions ADD COLUMN rescheduled_to_session_id INTEGER",
        (err) => {
          if (err) {
            console.error('Error adding rescheduled_to_session_id:', err);
          } else {
            console.log('✓ Added rescheduled_to_session_id column');
          }

          // Close database after last operation
          setTimeout(() => {
            console.log('\nMigration completed!');
            console.log('Verifying new schema...');

            db.all("PRAGMA table_info(sessions)", (err, updatedColumns) => {
              if (err) {
                console.error('Error verifying schema:', err);
              } else {
                console.log('\nUpdated columns:');
                updatedColumns.forEach(col => {
                  console.log(`  - ${col.name} (${col.type})`);
                });
              }
              db.close();
            });
          }, 100);
        }
      );
    } else {
      // Both columns exist, close database
      console.log('All columns already exist. No migration needed.');
      db.close();
    }
  });
});
