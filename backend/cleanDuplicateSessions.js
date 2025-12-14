/**
 * Script để xóa sessions duplicate được tạo bởi migration
 * Giữ lại sessions cũ đã có status (completed, cancelled)
 * Xóa sessions mới có recurring_schedule_id
 */

const db = require('./db');

async function cleanDuplicateSessions() {
  try {
    console.log('🧹 Bắt đầu dọn dẹp sessions duplicate...\n');

    // Tìm các sessions duplicate (cùng ngày)
    // Nhóm theo class_id và DATE(start_time)
    const findDuplicatesQuery = `
      SELECT
        class_id,
        DATE(start_time) as session_date,
        COUNT(*) as count,
        GROUP_CONCAT(id ORDER BY id) as session_ids,
        GROUP_CONCAT(recurring_schedule_id ORDER BY id) as recurring_ids,
        GROUP_CONCAT(status ORDER BY id) as statuses
      FROM sessions
      GROUP BY class_id, DATE(start_time)
      HAVING count > 1
    `;

    const duplicates = await new Promise((resolve, reject) => {
      db.db.all(findDuplicatesQuery, [], (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      });
    });

    console.log(`📋 Tìm thấy ${duplicates.length} nhóm sessions bị duplicate\n`);

    let deletedCount = 0;
    let keptCount = 0;

    for (const dup of duplicates) {
      const ids = dup.session_ids.split(',').map(id => parseInt(id));
      const recurringIds = dup.recurring_ids.split(',');
      const statuses = dup.statuses.split(',');

      console.log(`\n📅 Class ${dup.class_id}, Ngày ${dup.session_date}:`);
      console.log(`   Sessions: ${dup.session_ids}`);
      console.log(`   Recurring IDs: ${dup.recurring_ids}`);
      console.log(`   Statuses: ${dup.statuses}`);

      // Quyết định xóa sessions nào:
      // 1. Ưu tiên giữ sessions CŨ (recurring_schedule_id = NULL hoặc rỗng)
      // 2. Nếu có session với status khác 'scheduled', giữ lại
      // 3. Xóa sessions MỚI (có recurring_schedule_id)

      const toDelete = [];
      const toKeep = [];

      ids.forEach((id, index) => {
        const recurringId = recurringIds[index];
        const status = statuses[index];

        // Giữ lại sessions cũ (không có recurring_schedule_id)
        if (!recurringId || recurringId === '' || recurringId === 'null' || recurringId === 'N/A') {
          toKeep.push(id);
          console.log(`   ✅ Giữ session ${id} (session cũ, status: ${status})`);
        }
        // Xóa sessions mới (có recurring_schedule_id)
        else {
          toDelete.push(id);
          console.log(`   ❌ Xóa session ${id} (session mới từ migration, recurring_id: ${recurringId})`);
        }
      });

      // Thực hiện xóa
      for (const id of toDelete) {
        await new Promise((resolve, reject) => {
          db.db.run('DELETE FROM sessions WHERE id = ?', [id], (err) => {
            if (err) return reject(err);
            resolve();
          });
        });
        deletedCount++;
      }

      keptCount += toKeep.length;
    }

    console.log('\n' + '='.repeat(80));
    console.log('📊 KẾT QUẢ DỌN DẸP:');
    console.log(`✅ Giữ lại: ${keptCount} sessions cũ`);
    console.log(`❌ Đã xóa: ${deletedCount} sessions duplicate`);
    console.log('='.repeat(80) + '\n');

    // Kiểm tra lại
    const finalCountQuery = `SELECT COUNT(*) as total FROM sessions`;
    const finalCount = await new Promise((resolve, reject) => {
      db.db.get(finalCountQuery, [], (err, row) => {
        if (err) return reject(err);
        resolve(row);
      });
    });

    console.log(`📊 Tổng số sessions còn lại: ${finalCount.total}\n`);

    console.log('✨ Dọn dẹp hoàn tất!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Lỗi:', error);
    process.exit(1);
  }
}

cleanDuplicateSessions();
