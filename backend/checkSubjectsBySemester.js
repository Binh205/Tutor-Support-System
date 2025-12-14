const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./data.sqlite');

db.all(`
  SELECT s.id, s.code, s.name, sem.code as semester, sem.name as semester_name
  FROM subjects s
  JOIN semesters sem ON s.semester_id = sem.id
  ORDER BY s.code, sem.code
`, [], (err, rows) => {
  if (err) {
    console.error(err);
  } else {
    console.log('📊 All subjects by semester:\n');

    let currentCode = '';
    rows.forEach(r => {
      if (r.code !== currentCode) {
        if (currentCode !== '') console.log('');
        currentCode = r.code;
      }
      console.log(`   ${r.code} (${r.semester}): ${r.name}`);
    });

    console.log('\n' + '='.repeat(60));
    console.log(`Total subject entries: ${rows.length}`);

    // Count by semester
    const bySemester = {};
    rows.forEach(r => {
      if (!bySemester[r.semester]) {
        bySemester[r.semester] = { count: 0, name: r.semester_name };
      }
      bySemester[r.semester].count++;
    });

    console.log('\nBreakdown by semester:');
    Object.keys(bySemester).sort().forEach(sem => {
      console.log(`   ${sem}: ${bySemester[sem].count} subjects (${bySemester[sem].name})`);
    });
    console.log('='.repeat(60));
  }
  db.close();
});
