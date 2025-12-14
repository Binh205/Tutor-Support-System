const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, 'data.sqlite');
const db = new sqlite3.Database(dbPath);

/**
 * Migration script to fix subjects table UNIQUE constraint
 *
 * Current issue: subjects.code has UNIQUE constraint, preventing same subject
 * from being added to multiple semesters
 *
 * Solution: Change UNIQUE constraint from code alone to (code, semester_id) composite
 */

function migrateSubjectsSchema() {
  return new Promise((resolve, reject) => {
    console.log('🔄 Starting migration: subjects table schema...');

    db.serialize(() => {
      // Step 1: Create new table with correct schema
      console.log('📝 Step 1: Creating new subjects table with composite UNIQUE constraint...');
      db.run(`
        CREATE TABLE IF NOT EXISTS subjects_new (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT NOT NULL,
          name TEXT NOT NULL,
          description TEXT,
          semester_id INTEGER NOT NULL,
          total_students INTEGER DEFAULT 0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
          UNIQUE(code, semester_id)
        )
      `, (err) => {
        if (err) {
          console.error('❌ Error creating new table:', err);
          return reject(err);
        }
        console.log('✅ New table created successfully');

        // Step 2: Copy data from old table
        console.log('📝 Step 2: Copying data from old subjects table...');
        db.run(`
          INSERT INTO subjects_new (id, code, name, description, semester_id, total_students, created_at, updated_at)
          SELECT id, code, name, description, semester_id, total_students, created_at, updated_at
          FROM subjects
        `, (err) => {
          if (err) {
            console.error('❌ Error copying data:', err);
            return reject(err);
          }
          console.log('✅ Data copied successfully');

          // Step 3: Drop old table
          console.log('📝 Step 3: Dropping old subjects table...');
          db.run(`DROP TABLE subjects`, (err) => {
            if (err) {
              console.error('❌ Error dropping old table:', err);
              return reject(err);
            }
            console.log('✅ Old table dropped successfully');

            // Step 4: Rename new table
            console.log('📝 Step 4: Renaming subjects_new to subjects...');
            db.run(`ALTER TABLE subjects_new RENAME TO subjects`, (err) => {
              if (err) {
                console.error('❌ Error renaming table:', err);
                return reject(err);
              }
              console.log('✅ Table renamed successfully');

              // Step 5: Verify the new schema
              console.log('📝 Step 5: Verifying new schema...');
              db.all(`PRAGMA table_info(subjects)`, (err, rows) => {
                if (err) {
                  console.error('❌ Error verifying schema:', err);
                  return reject(err);
                }

                console.log('✅ New schema:');
                rows.forEach(col => {
                  console.log(`   - ${col.name}: ${col.type} ${col.notnull ? 'NOT NULL' : ''} ${col.pk ? 'PRIMARY KEY' : ''}`);
                });

                // Step 6: Check UNIQUE constraint
                db.all(`PRAGMA index_list(subjects)`, (err, indexes) => {
                  if (err) {
                    console.error('❌ Error checking indexes:', err);
                    return reject(err);
                  }

                  console.log('✅ Indexes:');
                  indexes.forEach(idx => {
                    console.log(`   - ${idx.name}: unique=${idx.unique}`);
                  });

                  console.log('\n✅ Migration completed successfully!');
                  console.log('📌 Now you can add the same subject code to different semesters.');
                  console.log('📌 Example: CO1007 can exist in both HK251 and HK252');

                  resolve();
                });
              });
            });
          });
        });
      });
    });
  });
}

// Run migration
migrateSubjectsSchema()
  .then(() => {
    db.close();
    console.log('\n🎉 Database connection closed. Migration complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Migration failed:', err);
    db.close();
    process.exit(1);
  });
