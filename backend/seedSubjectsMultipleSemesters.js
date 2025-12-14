const { createSubject, getSemesters, db } = require("./db");

/**
 * Seed subjects for multiple semesters
 * Usage:
 *   node seedSubjectsMultipleSemesters.js
 *   node seedSubjectsMultipleSemesters.js HK251
 *   node seedSubjectsMultipleSemesters.js HK251,HK252
 */

// Danh sách môn học (không bao gồm semester_id, sẽ được gán sau)
const SUBJECT_DEFINITIONS = [
  {
    code: "CO1007",
    name: "Cấu trúc rời rạc",
    description: "Môn học về lý thuyết tập hợp, đại số, tổ hợp và đồ thị",
    total_students: 250,
  },
  {
    code: "CO1023",
    name: "Hệ thống số",
    description: "Môn học về hệ thống số, logic số và thiết kế mạch số",
    total_students: 220,
  },
  {
    code: "CO1027",
    name: "Kỹ thuật lập trình",
    description: "Môn học về C++ và các kỹ thuật lập trình cơ bản",
    total_students: 300,
  },
  {
    code: "CO3093",
    name: "Mạng máy tính",
    description: "Môn học về kiến trúc mạng, giao thức và truyền thông mạng",
    total_students: 180,
  },
  {
    code: "CO2003",
    name: "Cấu trúc dữ liệu và giải thuật",
    description: "Môn học về các cấu trúc dữ liệu cơ bản và giải thuật",
    total_students: 280,
  },
  {
    code: "CO2013",
    name: "Hệ điều hành",
    description: "Môn học về kiến trúc và quản lý hệ điều hành",
    total_students: 200,
  },
  {
    code: "CO2039",
    name: "Cơ sở dữ liệu",
    description: "Môn học về thiết kế và quản trị cơ sở dữ liệu",
    total_students: 240,
  },
  {
    code: "CO3001",
    name: "Công nghệ phần mềm",
    description: "Môn học về quy trình phát triển phần mềm",
    total_students: 210,
  },
  {
    code: "CO3005",
    name: "Phân tích và thiết kế thuật toán",
    description: "Môn học về các kỹ thuật thiết kế và phân tích thuật toán",
    total_students: 160,
  },
  {
    code: "CO3009",
    name: "Trí tuệ nhân tạo",
    description: "Môn học về các phương pháp và ứng dụng trí tuệ nhân tạo",
    total_students: 190,
  },
  {
    code: "CO3015",
    name: "Học máy",
    description: "Môn học về các thuật toán và ứng dụng học máy",
    total_students: 170,
  },
  {
    code: "CO3021",
    name: "Xử lý ngôn ngữ tự nhiên",
    description: "Môn học về kỹ thuật xử lý và phân tích ngôn ngữ tự nhiên",
    total_students: 140,
  },
  {
    code: "CO3057",
    name: "Lập trình Web",
    description: "Môn học về phát triển ứng dụng Web front-end và back-end",
    total_students: 230,
  },
  {
    code: "CO3061",
    name: "Phát triển ứng dụng di động",
    description: "Môn học về lập trình ứng dụng trên nền tảng di động",
    total_students: 150,
  },
  {
    code: "CO3091",
    name: "Thiết kế và phân tích hệ thống",
    description: "Môn học về phương pháp thiết kế và phân tích hệ thống thông tin",
    total_students: 130,
  },
  {
    code: "CO3103",
    name: "An toàn và bảo mật thông tin",
    description: "Môn học về các kỹ thuật bảo mật và an toàn thông tin",
    total_students: 160,
  },
  {
    code: "CO3121",
    name: "Thị giác máy tính",
    description: "Môn học về xử lý ảnh và thị giác máy tính",
    total_students: 120,
  },
  {
    code: "CO3141",
    name: "Blockchain và ứng dụng",
    description: "Môn học về công nghệ blockchain và các ứng dụng",
    total_students: 100,
  },
];

async function seedSubjectsForSemester(semester) {
  console.log(`\n📚 Seeding subjects for ${semester.code} - ${semester.name}`);
  console.log(`   Creating ${SUBJECT_DEFINITIONS.length} subjects...\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (const subjectDef of SUBJECT_DEFINITIONS) {
    try {
      // Kiểm tra xem môn học đã tồn tại chưa
      const checkExisting = await new Promise((resolve, reject) => {
        db.get(
          "SELECT * FROM subjects WHERE code = ? AND semester_id = ?",
          [subjectDef.code, semester.id],
          (err, row) => {
            if (err) return reject(err);
            resolve(row);
          }
        );
      });

      if (checkExisting) {
        console.log(`   ⏭️  ${subjectDef.code} - ${subjectDef.name} (already exists)`);
        skipped++;
        continue;
      }

      // Tạo môn học mới với semester_id
      const subjectData = {
        ...subjectDef,
        semester_id: semester.id,
      };

      const subject = await createSubject(subjectData);
      console.log(`   ✅ ${subject.code} - ${subject.name} (${subject.total_students} students)`);
      created++;
    } catch (error) {
      console.error(`   ❌ ${subjectDef.code}: ${error.message}`);
      errors++;
    }
  }

  console.log(`\n   Summary for ${semester.code}:`);
  console.log(`   - Created: ${created}`);
  console.log(`   - Skipped: ${skipped}`);
  console.log(`   - Errors: ${errors}`);

  return { created, skipped, errors };
}

async function seedSubjectsMultipleSemesters() {
  try {
    console.log("🌱 Starting to seed subjects for multiple semesters...\n");

    // Lấy danh sách semesters
    const allSemesters = await getSemesters();

    if (allSemesters.length === 0) {
      console.error("❌ No semesters found! Please run seedSemesters.js first.");
      process.exit(1);
    }

    // Kiểm tra command line arguments
    const args = process.argv.slice(2);
    let targetSemesters = [];

    if (args.length > 0) {
      // Nếu có arguments, chỉ seed cho những semester được chỉ định
      const requestedCodes = args[0].split(',').map(s => s.trim().toUpperCase());
      targetSemesters = allSemesters.filter(s => requestedCodes.includes(s.code));

      if (targetSemesters.length === 0) {
        console.error(`❌ No matching semesters found for: ${requestedCodes.join(', ')}`);
        console.log("\nAvailable semesters:");
        allSemesters.forEach(s => console.log(`   - ${s.code}: ${s.name}`));
        process.exit(1);
      }
    } else {
      // Nếu không có arguments, seed cho tất cả semesters
      targetSemesters = allSemesters;
    }

    console.log("🎯 Target semesters:");
    targetSemesters.forEach(s => {
      console.log(`   - ${s.code}: ${s.name} (${s.start_date} → ${s.end_date})`);
    });

    // Seed cho từng semester
    const results = [];
    for (const semester of targetSemesters) {
      const result = await seedSubjectsForSemester(semester);
      results.push({ semester: semester.code, ...result });
    }

    // Tổng kết
    console.log("\n" + "=".repeat(60));
    console.log("📊 FINAL SUMMARY");
    console.log("=".repeat(60));

    const totalCreated = results.reduce((sum, r) => sum + r.created, 0);
    const totalSkipped = results.reduce((sum, r) => sum + r.skipped, 0);
    const totalErrors = results.reduce((sum, r) => sum + r.errors, 0);

    results.forEach(r => {
      console.log(`\n${r.semester}:`);
      console.log(`   ✅ Created: ${r.created}`);
      console.log(`   ⏭️  Skipped: ${r.skipped}`);
      console.log(`   ❌ Errors: ${r.errors}`);
    });

    console.log("\n" + "=".repeat(60));
    console.log(`Total created: ${totalCreated}`);
    console.log(`Total skipped: ${totalSkipped}`);
    console.log(`Total errors: ${totalErrors}`);
    console.log("=".repeat(60));

    console.log("\n✅ Seeding completed!");

    db.close();
  } catch (error) {
    console.error("\n❌ Error seeding subjects:", error);
    db.close();
    process.exit(1);
  }
}

// Run the seeding
seedSubjectsMultipleSemesters();
