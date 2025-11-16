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
