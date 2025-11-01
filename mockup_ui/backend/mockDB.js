// Mock Database - In-memory storage
const db = {
  users: [
    {
      id: 1,
      email: "student1@example.com",
      password: "123456",
      name: "Nguyễn Văn A",
      role: "student",
      avatar: "N",
      createdAt: new Date(),
    },
    {
      id: 2,
      email: "tutor1@example.com",
      password: "123456",
      name: "Trần Thị B",
      role: "tutor",
      avatar: "T",
      createdAt: new Date(),
    },
  ],
  sessions: [
    {
      id: 1,
      tutor: "Trần Thị B",
      subject: "Toán học",
      date: "2025-10-25",
      time: "14:00 - 15:30",
      price: "150,000 VNĐ",
      status: "confirmed",
      studentId: 1,
    },
    {
      id: 2,
      tutor: "Lê Văn C",
      subject: "Tiếng Anh",
      date: "2025-10-26",
      time: "16:00 - 17:30",
      price: "200,000 VNĐ",
      status: "pending",
      studentId: 1,
    },
    {
      id: 3,
      tutor: "Phạm Thị D",
      subject: "Vật lý",
      date: "2025-10-27",
      time: "15:00 - 16:30",
      price: "180,000 VNĐ",
      status: "confirmed",
      studentId: 1,
    },
  ],
  tutors: [
    {
      id: 1,
      name: "Trần Thị B",
      email: "tutor1@example.com",
      subject: "Toán học",
      experience: "5 năm",
      rating: 4.8,
      price: "150,000 VNĐ/buổi",
      bio: "Gia sư toán có kinh nghiệm 5 năm",
      avatar: "T",
      createdAt: new Date(),
    },
    {
      id: 2,
      name: "Lê Văn C",
      email: "tutor2@example.com",
      subject: "Tiếng Anh",
      experience: "3 năm",
      rating: 4.6,
      price: "200,000 VNĐ/buổi",
      bio: "Gia sư tiếng anh chuyên gia bộ",
      avatar: "L",
      createdAt: new Date(),
    },
    {
      id: 3,
      name: "Phạm Thị D",
      email: "tutor3@example.com",
      subject: "Vật lý",
      experience: "4 năm",
      rating: 4.7,
      price: "180,000 VNĐ/buổi",
      bio: "Gia sư vật lý từ trường chuyên",
      avatar: "P",
      createdAt: new Date(),
    },
  ],
};

// User functions
const getUser = (email) => {
  return db.users.find((u) => u.email === email);
};

const getUserById = (id) => {
  return db.users.find((u) => u.id === id);
};

const createUser = (user) => {
  const newUser = {
    id: db.users.length + 1,
    ...user,
    createdAt: new Date(),
  };
  db.users.push(newUser);
  return newUser;
};

// Session functions
const getSessions = () => {
  return db.sessions;
};

const getSessionsByStudent = (studentId) => {
  return db.sessions.filter((s) => s.studentId === studentId);
};

const createSession = (session) => {
  const newSession = {
    id: db.sessions.length + 1,
    ...session,
  };
  db.sessions.push(newSession);
  return newSession;
};

// Tutor functions
const getTutors = () => {
  return db.tutors;
};

const getTutorById = (id) => {
  return db.tutors.find((t) => t.id === id);
};

module.exports = {
  db,
  getUser,
  getUserById,
  createUser,
  getSessions,
  getSessionsByStudent,
  createSession,
  getTutors,
  getTutorById,
};
