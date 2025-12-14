/**
 * Script để kiểm tra đăng ký của student
 */

const db = require('./db');

async function checkRegistrations() {
  try {
    console.log('🔍 Kiểm tra đăng ký của students...\n');

    // Lấy danh sách students
    const studentsQuery = `SELECT id, username, name FROM users WHERE role = 'student'`;
    const students = await new Promise((resolve, reject) => {
      db.db.all(studentsQuery, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });

    console.log(`📊 Tổng số students: ${students.length}\n`);

    // Kiểm tra từng student
    for (const student of students) {
      console.log(`👤 Student: ${student.name} (${student.username}) - ID: ${student.id}`);

      // Lấy các class đã đăng ký
      const registrations = await db.getRegisteredClassesByStudent(student.id);
      console.log(`   📚 Đã đăng ký ${registrations.length} môn học:`);

      if (registrations.length > 0) {
        registrations.forEach(reg => {
          console.log(`      - ${reg.subject_name} (Class ID: ${reg.class_id}) - Giáo viên: ${reg.tutor_name}`);
          console.log(`        Lịch: Thứ ${reg.day_of_week + 1}, ${reg.start_time} - ${reg.end_time}`);
        });
      } else {
        console.log(`      (Chưa đăng ký môn nào)`);
      }

      // Lấy sessions của student
      const now = new Date();
      const sessions = await db.getSessionsByStudentAndMonth(student.id, now.getFullYear(), now.getMonth() + 1);
      console.log(`   📅 Số buổi học trong tháng này: ${sessions.length}`);

      if (sessions.length > 0) {
        console.log(`      Buổi học gần nhất:`);
        sessions.slice(0, 3).forEach(s => {
          console.log(`      - ${s.subject_name}: ${s.start_time} (${s.status})`);
        });
      }

      console.log('');
    }

    console.log('✅ Kiểm tra hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

checkRegistrations();
