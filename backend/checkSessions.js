/**
 * Script để kiểm tra sessions đã được tạo
 */

const db = require('./db');

async function checkSessions() {
  try {
    console.log('🔍 Kiểm tra sessions trong database...\n');

    // Đếm tổng số sessions
    const countQuery = `SELECT COUNT(*) as total FROM sessions`;
    const countResult = await new Promise((resolve, reject) => {
      db.db.get(countQuery, [], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    console.log(`📊 Tổng số sessions: ${countResult.total}\n`);

    // Lấy 10 sessions mẫu
    const sessionsQuery = `
      SELECT s.id, s.class_id, s.session_number, s.start_time, s.end_time, s.status, s.recurring_schedule_id,
             c.subject_id, sub.name as subject_name
      FROM sessions s
      JOIN classes c ON s.class_id = c.id
      JOIN subjects sub ON c.subject_id = sub.id
      LIMIT 10
    `;

    const sessions = await new Promise((resolve, reject) => {
      db.db.all(sessionsQuery, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });

    console.log('📋 10 sessions mẫu:');
    console.log('─'.repeat(100));
    sessions.forEach(s => {
      console.log(`ID: ${s.id} | Class: ${s.class_id} | Môn: ${s.subject_name} | Tuần: ${s.session_number} | Thời gian: ${s.start_time} | Status: ${s.status}`);
    });
    console.log('─'.repeat(100) + '\n');

    // Kiểm tra sessions theo class
    const sessionsByClassQuery = `
      SELECT c.id as class_id, sub.name as subject_name, COUNT(s.id) as session_count
      FROM classes c
      LEFT JOIN sessions s ON c.id = s.class_id
      JOIN subjects sub ON c.subject_id = sub.id
      GROUP BY c.id
    `;

    const sessionsByClass = await new Promise((resolve, reject) => {
      db.db.all(sessionsByClassQuery, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });

    console.log('📊 Sessions theo class:');
    console.log('─'.repeat(60));
    sessionsByClass.forEach(c => {
      console.log(`Class ID: ${c.class_id} | Môn: ${c.subject_name} | Số sessions: ${c.session_count}`);
    });
    console.log('─'.repeat(60) + '\n');

    console.log('✅ Kiểm tra hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

checkSessions();
