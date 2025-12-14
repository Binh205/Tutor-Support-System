/**
 * Script để xem chi tiết sessions của từng class
 */

const db = require('./db');

async function checkSessionsByClass() {
  try {
    console.log('🔍 Kiểm tra chi tiết sessions theo class...\n');

    // Lấy class 15 và 16 (Công nghệ phần mềm và Hệ điều hành)
    const classes = [15, 16];

    for (const classId of classes) {
      const sessionsQuery = `
        SELECT s.id, s.class_id, s.session_number, s.start_time, s.end_time, s.status, s.recurring_schedule_id, s.created_at,
               c.subject_id, sub.name as subject_name
        FROM sessions s
        JOIN classes c ON s.class_id = c.id
        JOIN subjects sub ON c.subject_id = sub.id
        WHERE s.class_id = ?
        ORDER BY s.start_time, s.id
      `;

      const sessions = await new Promise((resolve, reject) => {
        db.db.all(sessionsQuery, [classId], (err, rows) => {
          if (err) return reject(err);
          resolve(rows || []);
        });
      });

      console.log(`\n${'='.repeat(120)}`);
      console.log(`📚 Class ${classId}: ${sessions[0]?.subject_name || 'N/A'} - Tổng ${sessions.length} sessions`);
      console.log('='.repeat(120));

      // Nhóm theo ngày
      const byDate = {};
      sessions.forEach(s => {
        const date = s.start_time.split(' ')[0];
        if (!byDate[date]) byDate[date] = [];
        byDate[date].push(s);
      });

      Object.keys(byDate).sort().forEach(date => {
        const dateSessions = byDate[date];
        console.log(`\n📅 Ngày ${date}:`);

        if (dateSessions.length > 1) {
          console.log(`   ⚠️  DUPLICATE: ${dateSessions.length} sessions cùng ngày!`);
        }

        dateSessions.forEach(s => {
          console.log(`   ID: ${s.id.toString().padEnd(4)} | Tuần: ${(s.session_number || 'N/A').toString().padEnd(3)} | ${s.start_time} → ${s.end_time} | Status: ${s.status.padEnd(10)} | Recurring: ${s.recurring_schedule_id || 'N/A'} | Created: ${s.created_at}`);
        });
      });
    }

    console.log('\n' + '='.repeat(120));
    console.log('\n✅ Kiểm tra hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

checkSessionsByClass();
