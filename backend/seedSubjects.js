const { createSubject, getSemesters, db } = require("./db");

async function seedSubjects() {
  try {
    console.log("Starting to seed subjects...");

    // Lấy semester hiện tại (HK251)
    const semesters = await getSemesters();
    const currentSemester = semesters.find(s => s.code === "HK251");

    if (!currentSemester) {
      console.error("Semester HK251 not found!");
      process.exit(1);
    }

    console.log(`Using semester: ${currentSemester.code} - ${currentSemester.name}`);

    // Danh sách môn học
    const subjects = [
      {
        code: "CO1007",
        name: "Cấu trúc rời rạc",
        description: "Môn học về lý thuyết tập hợp, đại số, tổ hợp và đồ thị",
        semester_id: currentSemester.id,
        total_students: 250,
      },
      {
        code: "CO1023",
        name: "Hệ thống số",
        description: "Môn học về hệ thống số, logic số và thiết kế mạch số",
        semester_id: currentSemester.id,
        total_students: 220,
      },
      {
        code: "CO1027",
        name: "Kỹ thuật lập trình",
        description: "Môn học về C++ và các kỹ thuật lập trình cơ bản",
        semester_id: currentSemester.id,
        total_students: 300,
      },
      {
        code: "CO3093",
        name: "Mạng máy tính",
        description: "Môn học về kiến trúc mạng, giao thức và truyền thông mạng",
        semester_id: currentSemester.id,
        total_students: 180,
      },
      {
        code: "CO2003",
        name: "Cấu trúc dữ liệu và giải thuật",
        description: "Môn học về các cấu trúc dữ liệu cơ bản và giải thuật",
        semester_id: currentSemester.id,
        total_students: 280,
      },
      {
        code: "CO2013",
        name: "Hệ điều hành",
        description: "Môn học về kiến trúc và quản lý hệ điều hành",
        semester_id: currentSemester.id,
        total_students: 200,
      },
      {
        code: "CO2039",
        name: "Cơ sở dữ liệu",
        description: "Môn học về thiết kế và quản trị cơ sở dữ liệu",
        semester_id: currentSemester.id,
        total_students: 240,
      },
      {
        code: "CO3001",
        name: "Công nghệ phần mềm",
        description: "Môn học về quy trình phát triển phần mềm",
        semester_id: currentSemester.id,
        total_students: 210,
      },
      {
        code: "CO3005",
        name: "Phân tích và thiết kế thuật toán",
        description: "Môn học về các kỹ thuật thiết kế và phân tích thuật toán",
        semester_id: currentSemester.id,
        total_students: 160,
      },
      {
        code: "CO3009",
        name: "Trí tuệ nhân tạo",
        description: "Môn học về các phương pháp và ứng dụng trí tuệ nhân tạo",
        semester_id: currentSemester.id,
        total_students: 190,
      },
      {
        code: "CO3015",
        name: "Học máy",
        description: "Môn học về các thuật toán và ứng dụng học máy",
        semester_id: currentSemester.id,
        total_students: 170,
      },
      {
        code: "CO3021",
        name: "Xử lý ngôn ngữ tự nhiên",
        description: "Môn học về kỹ thuật xử lý và phân tích ngôn ngữ tự nhiên",
        semester_id: currentSemester.id,
        total_students: 140,
      },
      {
        code: "CO3057",
        name: "Lập trình Web",
        description: "Môn học về phát triển ứng dụng Web front-end và back-end",
        semester_id: currentSemester.id,
        total_students: 230,
      },
      {
        code: "CO3061",
        name: "Phát triển ứng dụng di động",
        description: "Môn học về lập trình ứng dụng trên nền tảng di động",
        semester_id: currentSemester.id,
        total_students: 150,
      },
      {
        code: "CO3091",
        name: "Thiết kế và phân tích hệ thống",
        description: "Môn học về phương pháp thiết kế và phân tích hệ thống thông tin",
        semester_id: currentSemester.id,
        total_students: 130,
      },
      {
        code: "CO3103",
        name: "An toàn và bảo mật thông tin",
        description: "Môn học về các kỹ thuật bảo mật và an toàn thông tin",
        semester_id: currentSemester.id,
        total_students: 160,
      },
      {
        code: "CO3121",
        name: "Thị giác máy tính",
        description: "Môn học về xử lý ảnh và thị giác máy tính",
        semester_id: currentSemester.id,
        total_students: 120,
      },
      {
        code: "CO3141",
        name: "Blockchain và ứng dụng",
        description: "Môn học về công nghệ blockchain và các ứng dụng",
        semester_id: currentSemester.id,
        total_students: 100,
      },
    ];

    console.log(`\nCreating ${subjects.length} subjects...\n`);

    for (const subjectData of subjects) {
      try {
        // Kiểm tra xem môn học đã tồn tại chưa
        const checkExisting = await new Promise((resolve, reject) => {
          db.get(
            "SELECT * FROM subjects WHERE code = ? AND semester_id = ?",
            [subjectData.code, subjectData.semester_id],
            (err, row) => {
              if (err) return reject(err);
              resolve(row);
            }
          );
        });

        if (checkExisting) {
          console.log(`Subject ${subjectData.code} already exists, skipping...`);
          continue;
        }

        // Tạo môn học mới
        const subject = await createSubject(subjectData);
        console.log(`✓ Created: ${subject.code} - ${subject.name} (${subject.total_students} students)`);
      } catch (error) {
        console.error(`✗ Error creating subject ${subjectData.code}:`, error.message);
      }
    }

    console.log("\n✅ Seeding subjects completed!");
    console.log(`Total subjects created: ${subjects.length}`);

    db.close();
  } catch (error) {
    console.error("Error seeding subjects:", error);
    db.close();
    process.exit(1);
  }
}

seedSubjects();
