/**
 * Script để kiểm tra sessions bị duplicate
 */

const db = require('./db');

async function checkDuplicateSessions() {
  try {
    console.log('🔍 Kiểm tra sessions bị duplicate...\n');

    // Tìm các sessions có cùng class_id, start_time, end_time
    const duplicateQuery = `
      SELECT class_id, start_time, end_time, COUNT(*) as count,
             GROUP_CONCAT(id) as session_ids,
             GROUP_CONCAT(status) as statuses,
             GROUP_CONCAT(recurring_schedule_id) as recurring_ids
      FROM sessions
      GROUP BY class_id, start_time, end_time
      HAVING count > 1
      ORDER BY class_id, start_time
    `;

    const duplicates = await new Promise((resolve, reject) => {
      db.db.all(duplicateQuery, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });

    console.log(`❌ Tìm thấy ${duplicates.length} nhóm sessions bị duplicate\n`);

    if (duplicates.length > 0) {
      console.log('📋 Chi tiết các sessions bị duplicate:');
      console.log('='.repeat(120));

      for (const dup of duplicates) {
        console.log(`\nClass ID: ${dup.class_id} | Thời gian: ${dup.start_time}`);
        console.log(`  Số lượng duplicate: ${dup.count}`);
        console.log(`  Session IDs: ${dup.session_ids}`);
        console.log(`  Statuses: ${dup.statuses}`);
        console.log(`  Recurring IDs: ${dup.recurring_ids}`);
      }

      console.log('\n' + '='.repeat(120));
    }

    // Đếm tổng số sessions
    const totalQuery = `SELECT COUNT(*) as total FROM sessions`;
    const total = await new Promise((resolve, reject) => {
      db.db.get(totalQuery, [], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    console.log(`\n📊 Tổng số sessions trong database: ${total.total}`);

    // Đếm sessions theo class
    const byClassQuery = `
      SELECT c.id, sub.name, COUNT(s.id) as session_count
      FROM classes c
      LEFT JOIN sessions s ON c.id = s.class_id
      JOIN subjects sub ON c.subject_id = sub.id
      GROUP BY c.id
    `;

    const byClass = await new Promise((resolve, reject) => {
      db.db.all(byClassQuery, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });

    console.log('\n📊 Sessions theo class:');
    byClass.forEach(c => {
      console.log(`  Class ${c.id} (${c.name}): ${c.session_count} sessions`);
    });

    console.log('\n✅ Kiểm tra hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

checkDuplicateSessions();
