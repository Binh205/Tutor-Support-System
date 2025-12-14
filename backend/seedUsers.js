const bcrypt = require("bcryptjs");
const { getUserByUsername, createUser, updateUser } = require("./db");

async function seed() {
  const users = [
    {
      email: "student@hcmut.edu.vn",
      username: "student",
      password: "student",
      name: "Nguyễn Văn A",
      role: "student",
      faculty: "Khoa học Máy tính",
      phone: "0123456789",
      address: "123 Đường ABC, Quận DEF, TP.HCM",
    },
    {
      email: "tutor@hcmut.edu.vn",
      username: "tutor",
      password: "tutor",
      name: "Trần Văn B",
      role: "tutor",
      faculty: "Khoa học Máy tính",
      phone: "0123456789",
      address: "123 Đường ABC, Quận DEF, TP.HCM",
    },
    // 10 Students
    {
      email: "tranthib@student.hcmut.edu.vn",
      username: "tranthib",
      password: "123456",
      name: "Trần Thị B",
      role: "student",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0901234568",
      address: "Ký túc xá khu B, ĐHQG-HCM",
    },
    {
      email: "lethic@student.hcmut.edu.vn",
      username: "lethic",
      password: "123456",
      name: "Lê Thị C",
      role: "student",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0901234569",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "phamvand@student.hcmut.edu.vn",
      username: "phamvand",
      password: "123456",
      name: "Phạm Văn D",
      role: "student",
      faculty: "Khoa Điện - Điện tử",
      phone: "0901234570",
      address: "Ký túc xá khu A, ĐHQG-HCM",
    },
    {
      email: "hoangthie@student.hcmut.edu.vn",
      username: "hoangthie",
      password: "123456",
      name: "Hoàng Thị E",
      role: "student",
      faculty: "Khoa Cơ khí",
      phone: "0901234571",
      address: "123 Võ Văn Ngân, Thủ Đức",
    },
    {
      email: "vovanf@student.hcmut.edu.vn",
      username: "vovanf",
      password: "123456",
      name: "Võ Văn F",
      role: "student",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0901234572",
      address: "Ký túc xá khu B, ĐHQG-HCM",
    },
    {
      email: "dothig@student.hcmut.edu.vn",
      username: "dothig",
      password: "123456",
      name: "Đỗ Thị G",
      role: "student",
      faculty: "Khoa Khoa học Ứng dụng",
      phone: "0901234573",
      address: "456 Nguyễn Kiệm, Phú Nhuận",
    },
    {
      email: "buivanh@student.hcmut.edu.vn",
      username: "buivanh",
      password: "123456",
      name: "Bùi Văn H",
      role: "student",
      faculty: "Khoa Kỹ thuật Hóa học",
      phone: "0901234574",
      address: "Ký túc xá khu A, ĐHQG-HCM",
    },
    {
      email: "ngothii@student.hcmut.edu.vn",
      username: "ngothii",
      password: "123456",
      name: "Ngô Thị I",
      role: "student",
      faculty: "Khoa Quản lý Công nghiệp",
      phone: "0901234575",
      address: "789 Điện Biên Phủ, Q.3",
    },
    {
      email: "dangvank@student.hcmut.edu.vn",
      username: "dangvank",
      password: "123456",
      name: "Đặng Văn K",
      role: "student",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0901234576",
      address: "Ký túc xá khu B, ĐHQG-HCM",
    },
    {
      email: "doanvanl@student.hcmut.edu.vn",
      username: "doanvanl",
      password: "123456",
      name: "Đoàn Văn L",
      role: "student",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0901234577",
      address: "Ký túc xá khu A, ĐHQG-HCM",
    },
    // 10 Tutors
    {
      email: "tutorminh@hcmut.edu.vn",
      username: "tutorminh",
      password: "123456",
      name: "Nguyễn Văn Minh",
      role: "tutor",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0911111111",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutorhoa@hcmut.edu.vn",
      username: "tutorhoa",
      password: "123456",
      name: "Trần Thị Hoa",
      role: "tutor",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0911111112",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutorquang@hcmut.edu.vn",
      username: "tutorquang",
      password: "123456",
      name: "Lê Văn Quang",
      role: "tutor",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0911111113",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutorlan@hcmut.edu.vn",
      username: "tutorlan",
      password: "123456",
      name: "Phạm Thị Lan",
      role: "tutor",
      faculty: "Khoa Điện - Điện tử",
      phone: "0911111114",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutordung@hcmut.edu.vn",
      username: "tutordung",
      password: "123456",
      name: "Hoàng Văn Dũng",
      role: "tutor",
      faculty: "Khoa Cơ khí",
      phone: "0911111115",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutorlinh@hcmut.edu.vn",
      username: "tutorlinh",
      password: "123456",
      name: "Võ Thị Linh",
      role: "tutor",
      faculty: "Khoa Khoa học Ứng dụng",
      phone: "0911111116",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutortuan@hcmut.edu.vn",
      username: "tutortuan",
      password: "123456",
      name: "Đỗ Văn Tuấn",
      role: "tutor",
      faculty: "Khoa Kỹ thuật Hóa học",
      phone: "0911111117",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutormai@hcmut.edu.vn",
      username: "tutormai",
      password: "123456",
      name: "Bùi Thị Mai",
      role: "tutor",
      faculty: "Khoa Quản lý Công nghiệp",
      phone: "0911111118",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutornam@hcmut.edu.vn",
      username: "tutornam",
      password: "123456",
      name: "Ngô Văn Nam",
      role: "tutor",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0911111119",
      address: "268 Lý Thường Kiệt, Q.10",
    },
    {
      email: "tutorthao@hcmut.edu.vn",
      username: "tutorthao",
      password: "123456",
      name: "Đặng Thị Thảo",
      role: "tutor",
      faculty: "Khoa Khoa học và Kỹ thuật Máy tính",
      phone: "0911111120",
      address: "268 Lý Thường Kiệt, Q.10",
    },
  ];

  for (const u of users) {
    try {
      const exists = await getUserByUsername(u.username);
      const hash = await bcrypt.hash(u.password, 10);

      if (exists) {
        // Update existing user with new fields (idempotent seed)
        await updateUser(exists.id, {
          username: u.username,
          name: u.name,
          faculty: u.faculty,
          phone: u.phone || "",
          address: u.address || "",
          avatar_path: u.avatar_path || "",
          role: u.role,
          password_hash: hash,
        });
        console.log(`Updated user: ${u.username}`);
        continue;
      }

      const created = await createUser({
        email: u.email,
        password_hash: hash,
        username: u.username,
        name: u.name,
        faculty: u.faculty,
        phone: u.phone || "",
        address: u.address || "",
        avatar_path: u.avatar_path || "",
        role: u.role,
      });
      console.log("Created user", created.email);
    } catch (err) {
      console.error("Error creating user", u.email, err);
    }
  }
  process.exit(0);
}

seed();
