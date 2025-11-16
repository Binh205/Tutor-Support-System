const { db } = require("./db");

async function migrateSessions() {
  try {
    console.log("Starting migration: Adding location_type and location_details columns...");

    // Add location_type column
    await new Promise((resolve, reject) => {
      db.run(
        `ALTER TABLE sessions ADD COLUMN location_type TEXT DEFAULT 'offline'`,
        (err) => {
          if (err) {
            if (err.message.includes("duplicate column name")) {
              console.log("⚠️  Column location_type already exists, skipping...");
              resolve();
            } else {
              reject(err);
            }
          } else {
            console.log("✅ Added column: location_type");
            resolve();
          }
        }
      );
    });

    // Add location_details column
    await new Promise((resolve, reject) => {
      db.run(
        `ALTER TABLE sessions ADD COLUMN location_details TEXT`,
        (err) => {
          if (err) {
            if (err.message.includes("duplicate column name")) {
              console.log("⚠️  Column location_details already exists, skipping...");
              resolve();
            } else {
              reject(err);
            }
          } else {
            console.log("✅ Added column: location_details");
            resolve();
          }
        }
      );
    });

    // Migrate existing location data to location_details
    await new Promise((resolve, reject) => {
      db.run(
        `UPDATE sessions SET location_details = location WHERE location_details IS NULL`,
        (err) => {
          if (err) reject(err);
          else {
            console.log("✅ Migrated existing location data to location_details");
            resolve();
          }
        }
      );
    });

    console.log("\n✅ Migration completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

migrateSessions();
// Add this to run cancellation_reason migration
const { db: db2 } = require("./db");
db2.run('ALTER TABLE sessions ADD COLUMN cancellation_reason TEXT', (err) => { 
  if (err && !err.message.includes('duplicate')) {
    console.error(err);
  } else {
    console.log('✅ Added cancellation_reason column'); 
  }
  db2.close();
});
