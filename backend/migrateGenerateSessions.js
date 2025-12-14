/**
 * Script để generate sessions cho tất cả recurring schedules hiện có
 * Chạy script này một lần để tạo sessions cho các lịch học đã tồn tại
 *
 * Usage: node migrateGenerateSessions.js
 */

const db = require('./db');

async function migrateGenerateSessions() {
  try {
    console.log('🚀 Bắt đầu migrate generate sessions...\n');

    // Lấy tất cả recurring schedules
    const query = `SELECT id, class_id, day_of_week, start_time, end_time FROM recurring_schedules`;

    const recurringSchedules = await new Promise((resolve, reject) => {
      db.db.all(query, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });

    console.log(`📋 Tìm thấy ${recurringSchedules.length} recurring schedules\n`);

    let successCount = 0;
    let errorCount = 0;

    // Generate sessions cho từng recurring schedule
    for (const schedule of recurringSchedules) {
      try {
        console.log(`⏳ Đang generate sessions cho recurring schedule ID: ${schedule.id} (class_id: ${schedule.class_id})...`);

        const sessions = await db.generateSessionsFromRecurringSchedule(schedule.id);

        console.log(`✅ Đã tạo ${sessions.length} sessions cho recurring schedule ID: ${schedule.id}\n`);
        successCount++;
      } catch (error) {
        console.error(`❌ Lỗi khi generate sessions cho recurring schedule ID: ${schedule.id}:`, error.message);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('📊 KẾT QUẢ MIGRATE:');
    console.log(`✅ Thành công: ${successCount}/${recurringSchedules.length} recurring schedules`);
    console.log(`❌ Lỗi: ${errorCount}/${recurringSchedules.length} recurring schedules`);
    console.log('='.repeat(60) + '\n');

    console.log('✨ Hoàn thành migrate!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi khi migrate:', error);
    process.exit(1);
  }
}

// Chạy migration
migrateGenerateSessions();
