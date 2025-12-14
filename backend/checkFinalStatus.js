/**
 * Script để kiểm tra trạng thái cuối cùng
 */

const db = require('./db');

async function checkFinalStatus() {
  try {
    console.log('🔍 Kiểm tra trạng thái cuối cùng của hệ thống...\n');

    // Tổng số sessions
    const totalQuery = `SELECT COUNT(*) as total FROM sessions`;
    const total = await new Promise((resolve, reject) => {
      db.db.get(totalQuery, [], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    console.log(`📊 Tổng số sessions: ${total.total}\n`);

    // Sessions theo status
    const byStatusQuery = `
      SELECT status, COUNT(*) as count
      FROM sessions
      GROUP BY status
      ORDER BY count DESC
    `;

    const byStatus = await new Promise((resolve, reject) => {
      db.db.all(byStatusQuery, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });

    console.log('📊 Sessions theo status:');
    byStatus.forEach(s => {
      console.log(`   ${s.status.padEnd(15)}: ${s.count}`);
    });

    // Sessions theo class
    console.log('\n📊 Sessions theo class:');
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

    byClass.forEach(c => {
      console.log(`   Class ${c.id} (${c.name}): ${c.session_count} sessions`);
    });

    // Kiểm tra duplicate
    console.log('\n📊 Kiểm tra duplicate:');
    const duplicateQuery = `
      SELECT class_id, DATE(start_time) as date, COUNT(*) as count
      FROM sessions
      GROUP BY class_id, DATE(start_time)
      HAVING count > 1
    `;

    const duplicates = await new Promise((resolve, reject) => {
      db.db.all(duplicateQuery, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });

    if (duplicates.length > 0) {
      console.log(`   ❌ Tìm thấy ${duplicates.length} duplicate sessions`);
      duplicates.forEach(d => {
        console.log(`      Class ${d.class_id}, Ngày ${d.date}: ${d.count} sessions`);
      });
    } else {
      console.log('   ✅ Không có duplicate sessions');
    }

    // Sessions với recurring_schedule_id
    console.log('\n📊 Sessions theo recurring_schedule_id:');
    const byRecurringQuery = `
      SELECT
        CASE WHEN recurring_schedule_id IS NULL THEN 'NULL' ELSE 'NOT NULL' END as has_recurring,
        COUNT(*) as count
      FROM sessions
      GROUP BY has_recurring
    `;

    const byRecurring = await new Promise((resolve, reject) => {
      db.db.all(byRecurringQuery, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });

    byRecurring.forEach(r => {
      console.log(`   ${r.has_recurring.padEnd(15)}: ${r.count} sessions`);
    });

    console.log('\n✅ Kiểm tra hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

checkFinalStatus();
