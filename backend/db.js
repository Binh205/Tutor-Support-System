const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();

const DB_PATH = path.join(__dirname, "data.sqlite");

// Ensure directory exists
const dir = path.dirname(DB_PATH);
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error("Failed to open DB", err);
    process.exit(1);
  }
});

// Run migrations (simple)
db.serialize(() => {
  db.run(
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      username TEXT,
      name TEXT,
      faculty TEXT,
      phone TEXT,
      address TEXT,
      avatar_path TEXT,
      role TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );
  // sessions table

  // semesters table
  db.run(
    `CREATE TABLE IF NOT EXISTS semesters (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      start_date DATE,
      end_date DATE,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`
  );

  // subjects table
  db.run(
    `CREATE TABLE IF NOT EXISTS subjects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      semester_id INTEGER NOT NULL,
      total_students INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(semester_id) REFERENCES semesters(id)
    )`
  );

  // classes table (lớp học kèm)
  db.run(
    `CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject_id INTEGER NOT NULL,
      tutor_id INTEGER NOT NULL,
      semester_id INTEGER NOT NULL,
      max_capacity INTEGER DEFAULT 20,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(subject_id) REFERENCES subjects(id),
      FOREIGN KEY(tutor_id) REFERENCES users(id),
      FOREIGN KEY(semester_id) REFERENCES semesters(id)
    )`
  );

  // free_schedules table (lịch rảnh định kỳ của tutor)
  db.run(
    `CREATE TABLE IF NOT EXISTS free_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tutor_id INTEGER NOT NULL,
      semester_id INTEGER NOT NULL,
      days_of_week TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(tutor_id) REFERENCES users(id),
      FOREIGN KEY(semester_id) REFERENCES semesters(id)
    )`
  );

  // recurring_schedules table (lịch học định kỳ cho class)
  db.run(
    `CREATE TABLE IF NOT EXISTS recurring_schedules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      day_of_week INTEGER NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      start_week INTEGER DEFAULT 1,
      end_week INTEGER DEFAULT 15,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(class_id) REFERENCES classes(id)
    )`
  );

  // sessions table (buổi học cụ thể)
  db.run(
    `CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      recurring_schedule_id INTEGER,
      start_time DATETIME NOT NULL,
      end_time DATETIME NOT NULL,
      location_type TEXT DEFAULT 'offline',
      location_details TEXT,
      status TEXT DEFAULT 'scheduled',
      notes TEXT,
      cancellation_reason TEXT,
      rescheduled_to_session_id INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(recurring_schedule_id) REFERENCES recurring_schedules(id),
      FOREIGN KEY(rescheduled_to_session_id) REFERENCES sessions(id)
    )`
  );

  // class_registrations table (đăng ký class của sinh viên)
  db.run(
    `CREATE TABLE IF NOT EXISTS class_registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      class_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      registered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(student_id) REFERENCES users(id),
      UNIQUE(class_id, student_id)
    )`
  );

  // session_attendance table (điểm danh buổi học)
  db.run(
    `CREATE TABLE IF NOT EXISTS session_attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      status TEXT DEFAULT 'not_marked',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(session_id) REFERENCES sessions(id),
      FOREIGN KEY(student_id) REFERENCES users(id),
      UNIQUE(session_id, student_id)
    )`
  );

  // reschedule_polls table (poll vote buổi bù)
  db.run(
    `CREATE TABLE IF NOT EXISTS reschedule_polls (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cancelled_session_id INTEGER NOT NULL,
      class_id INTEGER NOT NULL,
      tutor_id INTEGER NOT NULL,
      reason TEXT,
      options TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      deadline DATETIME NOT NULL,
      status TEXT DEFAULT 'active',
      selected_option_id INTEGER,
      rescheduled_session_id INTEGER,
      closed_at DATETIME,
      FOREIGN KEY(cancelled_session_id) REFERENCES sessions(id),
      FOREIGN KEY(class_id) REFERENCES classes(id),
      FOREIGN KEY(tutor_id) REFERENCES users(id),
      FOREIGN KEY(rescheduled_session_id) REFERENCES sessions(id)
    )`
  );

  // poll_votes table (votes của sinh viên trong poll)
  db.run(
    `CREATE TABLE IF NOT EXISTS poll_votes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      option_id INTEGER NOT NULL,
      voted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(poll_id) REFERENCES reschedule_polls(id),
      FOREIGN KEY(student_id) REFERENCES users(id),
      UNIQUE(poll_id, student_id)
    )`
  );
});

function getUserById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function getUserByUsername(username) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function createUser({
  email,
  password_hash,
  username,
  name,
  faculty,
  phone,
  address,
  avatar_path,
  role,
}) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO users (email, password_hash, username, name, faculty, phone, address, avatar_path, role) VALUES (?,?,?,?,?,?,?,?,?)`;
    db.run(
      stmt,
      [
        email,
        password_hash,
        username,
        name,
        faculty,
        phone,
        address,
        avatar_path,
        role,
      ],
      function (err) {
        if (err) return reject(err);
        getUserById(this.lastID).then(resolve).catch(reject);
      }
    );
  });
}

function updateUser(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return Promise.resolve();
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => fields[k]);
  values.push(id);
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE users SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values,
      function (err) {
        if (err) return reject(err);
        getUserById(id).then(resolve).catch(reject);
      }
    );
  });
}

// ===== Semester helpers =====
function createSemester({ code, name, start_date, end_date }) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO semesters (code, name, start_date, end_date) VALUES (?,?,?,?)`;
    db.run(stmt, [code, name, start_date, end_date], function (err) {
      if (err) return reject(err);
      db.get(
        "SELECT * FROM semesters WHERE id = ?",
        [this.lastID],
        (e, row) => {
          if (e) return reject(e);
          resolve(row);
        }
      );
    });
  });
}

function getSemesters() {
  return new Promise((resolve, reject) => {
    db.all("SELECT * FROM semesters ORDER BY code ASC", [], (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
}

function getSemesterById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM semesters WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function getCurrentSemester() {
  return new Promise((resolve, reject) => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    db.get(
      "SELECT * FROM semesters WHERE date(?) BETWEEN date(start_date) AND date(end_date) LIMIT 1",
      [today],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

// ===== Subject helpers =====
function createSubject({
  code,
  name,
  description,
  semester_id,
  total_students,
}) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO subjects (code, name, description, semester_id, total_students) VALUES (?,?,?,?,?)`;
    db.run(
      stmt,
      [code, name, description, semester_id, total_students],
      function (err) {
        if (err) return reject(err);
        db.get(
          "SELECT * FROM subjects WHERE id = ?",
          [this.lastID],
          (e, row) => {
            if (e) return reject(e);
            resolve(row);
          }
        );
      }
    );
  });
}

function getSubjectsBySemester(semester_id) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM subjects WHERE semester_id = ? ORDER BY code",
      [semester_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

function getSubjectById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM subjects WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

// ===== Class helpers =====
function createClass({
  subject_id,
  tutor_id,
  semester_id,
  max_capacity,
  description,
}) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO classes (subject_id, tutor_id, semester_id, max_capacity, description) VALUES (?,?,?,?,?)`;
    db.run(
      stmt,
      [subject_id, tutor_id, semester_id, max_capacity, description],
      function (err) {
        if (err) return reject(err);
        db.get(
          "SELECT * FROM classes WHERE id = ?",
          [this.lastID],
          (e, row) => {
            if (e) return reject(e);
            resolve(row);
          }
        );
      }
    );
  });
}

function getClassById(id) {
  return new Promise((resolve, reject) => {
    db.get("SELECT * FROM classes WHERE id = ?", [id], (err, row) => {
      if (err) return reject(err);
      resolve(row);
    });
  });
}

function getClassesByTutorAndSemester(tutor_id, semester_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT c.id, c.subject_id, c.tutor_id, c.semester_id, c.max_capacity, c.description, c.created_at, c.updated_at,
              s.code as subject_code, s.name as subject_name,
              rs.day_of_week, rs.start_time, rs.end_time, rs.start_week, rs.end_week
       FROM classes c
       JOIN subjects s ON c.subject_id = s.id
       LEFT JOIN recurring_schedules rs ON c.id = rs.class_id
       WHERE c.tutor_id = ? AND c.semester_id = ?
       ORDER BY c.id`,
      [tutor_id, semester_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

function getClassesBySubject(subject_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT c.id, c.subject_id, c.tutor_id, c.semester_id, c.max_capacity, c.description,
              s.code as subject_code, s.name as subject_name,
              u.name as tutor_name, u.username as tutor_username,
              rs.day_of_week, rs.start_time, rs.end_time, rs.start_week, rs.end_week,
              COUNT(cr.id) as registered_count
       FROM classes c
       JOIN subjects s ON c.subject_id = s.id
       JOIN users u ON c.tutor_id = u.id
       LEFT JOIN recurring_schedules rs ON c.id = rs.class_id
       LEFT JOIN class_registrations cr ON c.id = cr.class_id
       WHERE c.subject_id = ?
       GROUP BY c.id
       ORDER BY u.name`,
      [subject_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

function deleteClass(class_id) {
  return new Promise((resolve, reject) => {
    // Delete class_registrations first
    db.run("DELETE FROM class_registrations WHERE class_id = ?", [class_id], (err1) => {
      if (err1) return reject(err1);

      // Delete recurring_schedules
      db.run("DELETE FROM recurring_schedules WHERE class_id = ?", [class_id], (err2) => {
        if (err2) return reject(err2);

        // Finally delete the class itself
        db.run("DELETE FROM classes WHERE id = ?", [class_id], function (err3) {
          if (err3) return reject(err3);
          resolve({ success: true, changes: this.changes });
        });
      });
    });
  });
}

// Get existing recurring schedules for a tutor to check conflicts
function getRecurringSchedulesByTutorAndSemester(tutor_id, semester_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT rs.*, c.subject_id, s.code as subject_code, s.name as subject_name
       FROM recurring_schedules rs
       JOIN classes c ON rs.class_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       WHERE c.tutor_id = ? AND c.semester_id = ?
       ORDER BY rs.day_of_week, rs.start_time`,
      [tutor_id, semester_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

// ===== Free Schedule helpers =====
function createFreeSchedule({
  tutor_id,
  semester_id,
  days_of_week,
  start_time,
  end_time,
}) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO free_schedules (tutor_id, semester_id, days_of_week, start_time, end_time) VALUES (?,?,?,?,?)`;
    db.run(
      stmt,
      [
        tutor_id,
        semester_id,
        JSON.stringify(days_of_week),
        start_time,
        end_time,
      ],
      function (err) {
        if (err) return reject(err);
        db.get(
          "SELECT * FROM free_schedules WHERE id = ?",
          [this.lastID],
          (e, row) => {
            if (e) return reject(e);
            row.days_of_week = JSON.parse(row.days_of_week);
            resolve(row);
          }
        );
      }
    );
  });
}

function getFreeScheduleByTutorAndSemester(tutor_id, semester_id) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM free_schedules WHERE tutor_id = ? AND semester_id = ?",
      [tutor_id, semester_id],
      (err, row) => {
        if (err) return reject(err);
        if (row) row.days_of_week = JSON.parse(row.days_of_week);
        resolve(row);
      }
    );
  });
}

function updateFreeSchedule(id, fields) {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(fields);
    if (keys.length === 0) return resolve();

    const updates = keys.map((k) => {
      if (k === "days_of_week") {
        return `${k} = ?`;
      }
      return `${k} = ?`;
    });
    const values = keys.map((k) => {
      if (k === "days_of_week") {
        return JSON.stringify(fields[k]);
      }
      return fields[k];
    });
    values.push(id);

    db.run(
      `UPDATE free_schedules SET ${updates.join(
        ", "
      )}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values,
      function (err) {
        if (err) return reject(err);
        db.get("SELECT * FROM free_schedules WHERE id = ?", [id], (e, row) => {
          if (e) return reject(e);
          if (row) row.days_of_week = JSON.parse(row.days_of_week);
          resolve(row);
        });
      }
    );
  });
}

function deleteFreeSchedule(id) {
  return new Promise((resolve, reject) => {
    db.run("DELETE FROM free_schedules WHERE id = ?", [id], function (err) {
      if (err) return reject(err);
      resolve({ success: true });
    });
  });
}

// ===== Recurring Schedule helpers =====
function createRecurringSchedule({
  class_id,
  day_of_week,
  start_time,
  end_time,
  start_week,
  end_week,
}) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO recurring_schedules (class_id, day_of_week, start_time, end_time, start_week, end_week) VALUES (?,?,?,?,?,?)`;
    db.run(
      stmt,
      [class_id, day_of_week, start_time, end_time, start_week, end_week],
      function (err) {
        if (err) return reject(err);
        db.get(
          "SELECT * FROM recurring_schedules WHERE id = ?",
          [this.lastID],
          (e, row) => {
            if (e) return reject(e);
            resolve(row);
          }
        );
      }
    );
  });
}

function getRecurringSchedulesByClass(class_id) {
  return new Promise((resolve, reject) => {
    db.all(
      "SELECT * FROM recurring_schedules WHERE class_id = ? ORDER BY day_of_week, start_time",
      [class_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows);
      }
    );
  });
}

function getRecurringScheduleById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      "SELECT * FROM recurring_schedules WHERE id = ?",
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

function updateRecurringSchedule(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return Promise.resolve();
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => fields[k]);
  values.push(id);
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE recurring_schedules SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values,
      function (err) {
        if (err) return reject(err);
        db.get(
          "SELECT * FROM recurring_schedules WHERE id = ?",
          [id],
          (e, row) => {
            if (e) return reject(e);
            resolve(row);
          }
        );
      }
    );
  });
}

function deleteRecurringSchedule(id) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM recurring_schedules WHERE id = ?",
      [id],
      function (err) {
        if (err) return reject(err);
        resolve({ success: true });
      }
    );
  });
}

// ===== Class Registration helpers =====
function registerStudentInClass(class_id, student_id) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO class_registrations (class_id, student_id) VALUES (?,?)`;
    db.run(stmt, [class_id, student_id], function (err) {
      if (err) {
        // Check for UNIQUE constraint violation (409)
        if (err.code === "SQLITE_CONSTRAINT") {
          return reject({ statusCode: 409, message: "Đã đăng ký rồi" });
        }
        return reject(err);
      }
      db.get(
        `SELECT cr.id, cr.class_id, cr.student_id, cr.registered_at,
                c.subject_id, c.tutor_id, c.semester_id, c.max_capacity, c.description,
                s.code as subject_code, s.name as subject_name
         FROM class_registrations cr
         JOIN classes c ON cr.class_id = c.id
         JOIN subjects s ON c.subject_id = s.id
         WHERE cr.id = ?`,
        [this.lastID],
        (e, row) => {
          if (e) return reject(e);
          resolve(row);
        }
      );
    });
  });
}

function getRegisteredClassesByStudent(student_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT cr.id as registration_id, cr.registered_at,
              c.id as class_id, c.subject_id, c.tutor_id, c.semester_id, c.max_capacity, c.description,
              s.code as subject_code, s.name as subject_name,
              u.username as tutor_username, u.name as tutor_name,
              rs.day_of_week, rs.start_time, rs.end_time, rs.start_week, rs.end_week
       FROM class_registrations cr
       JOIN classes c ON cr.class_id = c.id
       JOIN subjects s ON c.subject_id = s.id
       JOIN users u ON c.tutor_id = u.id
       LEFT JOIN recurring_schedules rs ON c.id = rs.class_id
       WHERE cr.student_id = ?
       ORDER BY c.semester_id DESC, s.code`,
      [student_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

function getClassesForStudent(semester_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT c.id, c.subject_id, c.tutor_id, c.semester_id, c.max_capacity, c.description,
              s.code as subject_code, s.name as subject_name,
              u.username as tutor_username, u.name as tutor_name,
              COUNT(cr.id) as registered_count
       FROM classes c
       JOIN subjects s ON c.subject_id = s.id
       JOIN users u ON c.tutor_id = u.id
       LEFT JOIN class_registrations cr ON c.id = cr.class_id
       WHERE c.semester_id = ?
       GROUP BY c.id
       ORDER BY s.code`,
      [semester_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

function unregisterStudentFromClass(class_id, student_id) {
  return new Promise((resolve, reject) => {
    db.run(
      "DELETE FROM class_registrations WHERE class_id = ? AND student_id = ?",
      [class_id, student_id],
      function (err) {
        if (err) return reject(err);
        resolve({ success: true });
      }
    );
  });
}

// ===== Session helpers =====

// Hàm generate sessions từ recurring schedule
async function generateSessionsFromRecurringSchedule(recurring_schedule_id) {
  try {
    // 1. Lấy thông tin recurring schedule
    const recurringSchedule = await getRecurringScheduleById(recurring_schedule_id);
    if (!recurringSchedule) {
      throw new Error("Recurring schedule not found");
    }

    // 2. Lấy thông tin class để biết semester
    const classInfo = await getClassById(recurringSchedule.class_id);
    if (!classInfo) {
      throw new Error("Class not found");
    }

    // 3. Lấy thông tin semester để biết start_date và end_date
    const semester = await getSemesterById(classInfo.semester_id);
    if (!semester || !semester.start_date || !semester.end_date) {
      throw new Error("Semester not found or missing dates");
    }

    const semesterStart = new Date(semester.start_date);
    const semesterEnd = new Date(semester.end_date);

    // 4. Tính toán các ngày trong semester
    const sessions = [];
    let currentDate = new Date(semesterStart);
    let weekNumber = 1;

    // Di chuyển đến ngày đầu tiên khớp với day_of_week
    while (currentDate.getDay() !== recurringSchedule.day_of_week) {
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 5. Tính số tuần tối đa trong semester
    const totalWeeks = Math.ceil((semesterEnd - semesterStart) / (7 * 24 * 60 * 60 * 1000));
    const maxWeek = recurringSchedule.end_week || totalWeeks;

    console.log(`Semester: ${semester.code}, Total weeks: ${totalWeeks}, Max week: ${maxWeek}`);

    // 6. Tạo sessions cho mỗi tuần
    while (currentDate <= semesterEnd && weekNumber <= maxWeek) {
      // Chỉ tạo session nếu nằm trong khoảng start_week đến end_week
      if (weekNumber >= (recurringSchedule.start_week || 1)) {
        // Tạo datetime cho session
        const sessionDate = currentDate.toISOString().split('T')[0]; // YYYY-MM-DD
        const start_time = `${sessionDate} ${recurringSchedule.start_time}`;
        const end_time = `${sessionDate} ${recurringSchedule.end_time}`;

        // Kiểm tra xem session đã tồn tại chưa (dựa trên class_id và ngày)
        const existingSession = await new Promise((resolve, reject) => {
          db.get(
            `SELECT id FROM sessions
             WHERE class_id = ? AND DATE(start_time) = DATE(?)
             LIMIT 1`,
            [recurringSchedule.class_id, start_time],
            (err, row) => {
              if (err) return reject(err);
              resolve(row);
            }
          );
        });

        // Chỉ tạo session mới nếu chưa tồn tại
        if (!existingSession) {
          const session = await createSession({
            class_id: recurringSchedule.class_id,
            session_number: weekNumber,
            recurring_schedule_id: recurring_schedule_id,
            start_time: start_time,
            end_time: end_time,
            location_type: 'offline',
            location_details: '',
            status: 'scheduled',
            notes: '',
          });

          sessions.push(session);
        } else {
          console.log(`Session already exists for ${sessionDate}, skipping...`);
        }
      }

      // Di chuyển đến tuần tiếp theo (cùng ngày trong tuần)
      currentDate.setDate(currentDate.getDate() + 7);
      weekNumber++;
    }

    return sessions;
  } catch (error) {
    console.error("Error generating sessions:", error);
    throw error;
  }
}

function createSession({
  class_id,
  session_number,
  recurring_schedule_id,
  start_time,
  end_time,
  location_type,
  location_details,
  status,
  notes,
}) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO sessions (class_id, session_number, recurring_schedule_id, start_time, end_time, location_type, location_details, status, notes)
                  VALUES (?,?,?,?,?,?,?,?,?)`;
    db.run(
      stmt,
      [
        class_id,
        session_number || null,
        recurring_schedule_id || null,
        start_time,
        end_time,
        location_type || "offline",
        location_details || "",
        status || "scheduled",
        notes || "",
      ],
      function (err) {
        if (err) return reject(err);
        db.get("SELECT * FROM sessions WHERE id = ?", [this.lastID], (e, row) => {
          if (e) return reject(e);
          resolve(row);
        });
      }
    );
  });
}

function getSessionById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT s.*, c.subject_id, c.tutor_id, c.semester_id,
              sub.code as subject_code, sub.name as subject_name,
              u.name as tutor_name, u.username as tutor_username
       FROM sessions s
       JOIN classes c ON s.class_id = c.id
       JOIN subjects sub ON c.subject_id = sub.id
       JOIN users u ON c.tutor_id = u.id
       WHERE s.id = ?`,
      [id],
      (err, row) => {
        if (err) return reject(err);
        resolve(row);
      }
    );
  });
}

function getSessionsByStudentAndMonth(student_id, year, month) {
  return new Promise((resolve, reject) => {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    db.all(
      `SELECT s.*, c.subject_id, c.tutor_id, c.semester_id,
              sub.code as subject_code, sub.name as subject_name,
              u.name as tutor_name, u.username as tutor_username
       FROM sessions s
       JOIN classes c ON s.class_id = c.id
       JOIN subjects sub ON c.subject_id = sub.id
       JOIN users u ON c.tutor_id = u.id
       JOIN class_registrations cr ON c.id = cr.class_id
       WHERE cr.student_id = ?
         AND date(s.start_time) >= date(?)
         AND date(s.start_time) <= date(?)
       ORDER BY s.start_time`,
      [student_id, startDate, endDate],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

function getSessionsByTutorAndMonth(tutor_id, year, month) {
  return new Promise((resolve, reject) => {
    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;
    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    db.all(
      `SELECT s.*, c.subject_id, c.semester_id,
              sub.code as subject_code, sub.name as subject_name
       FROM sessions s
       JOIN classes c ON s.class_id = c.id
       JOIN subjects sub ON c.subject_id = sub.id
       WHERE c.tutor_id = ?
         AND date(s.start_time) >= date(?)
         AND date(s.start_time) <= date(?)
       ORDER BY s.start_time`,
      [tutor_id, startDate, endDate],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

function getSessionsByTutorAndSemester(tutor_id, semester_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT s.*, c.subject_id, c.semester_id,
              sub.code as subject_code, sub.name as subject_name
       FROM sessions s
       JOIN classes c ON s.class_id = c.id
       JOIN subjects sub ON c.subject_id = sub.id
       WHERE c.tutor_id = ? AND c.semester_id = ?
       ORDER BY s.start_time`,
      [tutor_id, semester_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

function getSessionsByStudentAndSemester(student_id, semester_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT s.*, c.subject_id, c.tutor_id, c.semester_id,
              sub.code as subject_code, sub.name as subject_name,
              u.name as tutor_name, u.username as tutor_username
       FROM sessions s
       JOIN classes c ON s.class_id = c.id
       JOIN subjects sub ON c.subject_id = sub.id
       JOIN users u ON c.tutor_id = u.id
       JOIN class_registrations cr ON c.id = cr.class_id
       WHERE cr.student_id = ? AND c.semester_id = ?
       ORDER BY s.start_time`,
      [student_id, semester_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

function updateSession(id, fields) {
  const keys = Object.keys(fields);
  if (keys.length === 0) return Promise.resolve();
  const setClause = keys.map((k) => `${k} = ?`).join(", ");
  const values = keys.map((k) => fields[k]);
  values.push(id);
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE sessions SET ${setClause}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      values,
      function (err) {
        if (err) return reject(err);
        getSessionById(id).then(resolve).catch(reject);
      }
    );
  });
}

function cancelSession(id, cancellation_reason) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE sessions SET status = 'cancelled', cancellation_reason = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [cancellation_reason, id],
      function (err) {
        if (err) return reject(err);
        getSessionById(id).then(resolve).catch(reject);
      }
    );
  });
}

function completeSession(id) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE sessions SET status = 'completed', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [id],
      function (err) {
        if (err) return reject(err);
        getSessionById(id).then(resolve).catch(reject);
      }
    );
  });
}

// ===== Reschedule Poll helpers =====
function createReschedulePoll({
  cancelled_session_id,
  class_id,
  tutor_id,
  reason,
  options,
  deadline,
}) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO reschedule_polls (cancelled_session_id, class_id, tutor_id, reason, options, deadline)
                  VALUES (?,?,?,?,?,?)`;
    db.run(
      stmt,
      [
        cancelled_session_id,
        class_id,
        tutor_id,
        reason,
        JSON.stringify(options),
        deadline,
      ],
      function (err) {
        if (err) return reject(err);
        db.get(
          "SELECT * FROM reschedule_polls WHERE id = ?",
          [this.lastID],
          (e, row) => {
            if (e) return reject(e);
            if (row) row.options = JSON.parse(row.options);
            resolve(row);
          }
        );
      }
    );
  });
}

function getPollById(id) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT rp.*, s.start_time as original_start_time, s.end_time as original_end_time,
              c.subject_id, sub.code as subject_code, sub.name as subject_name,
              u.name as tutor_name
       FROM reschedule_polls rp
       JOIN sessions s ON rp.cancelled_session_id = s.id
       JOIN classes c ON rp.class_id = c.id
       JOIN subjects sub ON c.subject_id = sub.id
       JOIN users u ON rp.tutor_id = u.id
       WHERE rp.id = ?`,
      [id],
      (err, row) => {
        if (err) return reject(err);
        if (row) row.options = JSON.parse(row.options);
        resolve(row);
      }
    );
  });
}

function getPollsByClass(class_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT rp.*, s.start_time as original_start_time, s.end_time as original_end_time
       FROM reschedule_polls rp
       JOIN sessions s ON rp.cancelled_session_id = s.id
       WHERE rp.class_id = ?
       ORDER BY rp.created_at DESC`,
      [class_id],
      (err, rows) => {
        if (err) return reject(err);
        if (rows) {
          rows = rows.map((r) => {
            r.options = JSON.parse(r.options);
            return r;
          });
        }
        resolve(rows || []);
      }
    );
  });
}

function getPollsByStudent(student_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT DISTINCT rp.*, s.start_time as original_start_time, s.end_time as original_end_time,
              c.subject_id, sub.code as subject_code, sub.name as subject_name,
              u.name as tutor_name
       FROM reschedule_polls rp
       JOIN sessions s ON rp.cancelled_session_id = s.id
       JOIN classes c ON rp.class_id = c.id
       JOIN subjects sub ON c.subject_id = sub.id
       JOIN users u ON rp.tutor_id = u.id
       JOIN class_registrations cr ON c.id = cr.class_id
       WHERE cr.student_id = ? AND rp.status = 'active'
       ORDER BY rp.deadline ASC`,
      [student_id],
      (err, rows) => {
        if (err) return reject(err);
        if (rows) {
          rows = rows.map((r) => {
            r.options = JSON.parse(r.options);
            return r;
          });
        }
        resolve(rows || []);
      }
    );
  });
}

function voteOnPoll(poll_id, student_id, option_id) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO poll_votes (poll_id, student_id, option_id) VALUES (?,?,?)
                  ON CONFLICT(poll_id, student_id) DO UPDATE SET option_id = ?, voted_at = CURRENT_TIMESTAMP`;
    db.run(stmt, [poll_id, student_id, option_id, option_id], function (err) {
      if (err) return reject(err);
      db.get(
        "SELECT * FROM poll_votes WHERE id = ?",
        [this.lastID],
        (e, row) => {
          if (e) return reject(e);
          resolve(row);
        }
      );
    });
  });
}

function getPollVotes(poll_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT pv.*, u.name as student_name, u.username as student_username
       FROM poll_votes pv
       JOIN users u ON pv.student_id = u.id
       WHERE pv.poll_id = ?
       ORDER BY pv.voted_at`,
      [poll_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

function closePoll(poll_id, selected_option_id, rescheduled_session_id) {
  return new Promise((resolve, reject) => {
    db.run(
      `UPDATE reschedule_polls SET status = 'closed', selected_option_id = ?, rescheduled_session_id = ?, closed_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [selected_option_id, rescheduled_session_id, poll_id],
      function (err) {
        if (err) return reject(err);
        getPollById(poll_id).then(resolve).catch(reject);
      }
    );
  });
}

// ===== Feedback helpers =====

function createFeedback({ session_id, student_id, class_id, tutor_id, rating, comment, is_anonymous }) {
  return new Promise((resolve, reject) => {
    const stmt = `INSERT INTO session_feedbacks (session_id, student_id, class_id, tutor_id, rating, comment, is_anonymous)
                  VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(
      stmt,
      [session_id, student_id, class_id, tutor_id, rating, comment || '', is_anonymous ? 1 : 0],
      function (err) {
        if (err) return reject(err);
        db.get('SELECT * FROM session_feedbacks WHERE id = ?', [this.lastID], (e, row) => {
          if (e) return reject(e);
          resolve(row);
        });
      }
    );
  });
}

function getFeedbacksByTutor(tutor_id, semester_id, class_id) {
  return new Promise((resolve, reject) => {
    let query = `
      SELECT sf.*,
             s.start_time as session_date,
             u.name as student_name,
             sub.code as subject_code,
             sub.name as subject_name,
             c.id as class_id
      FROM session_feedbacks sf
      JOIN sessions s ON sf.session_id = s.id
      JOIN users u ON sf.student_id = u.id
      JOIN classes c ON sf.class_id = c.id
      JOIN subjects sub ON c.subject_id = sub.id
      WHERE sf.tutor_id = ?
    `;

    const params = [tutor_id];

    if (semester_id) {
      query += ' AND c.semester_id = ?';
      params.push(semester_id);
    }

    if (class_id) {
      query += ' AND sf.class_id = ?';
      params.push(class_id);
    }

    query += ' ORDER BY sf.created_at DESC';

    db.all(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows || []);
    });
  });
}

function getCompletedSessionsWithoutFeedback(class_id, student_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT s.*, sub.code as subject_code, sub.name as subject_name
       FROM sessions s
       JOIN classes c ON s.class_id = c.id
       JOIN subjects sub ON c.subject_id = sub.id
       WHERE s.class_id = ?
         AND s.status = 'completed'
         AND s.id NOT IN (
           SELECT session_id FROM session_feedbacks WHERE student_id = ?
         )
       ORDER BY s.start_time DESC`,
      [class_id, student_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

function getCurrentClassesByStudent(student_id) {
  return new Promise((resolve, reject) => {
    db.all(
      `SELECT c.*,
              sub.code as subject_code,
              sub.name as subject_name,
              u.name as tutor_name,
              sem.code as semester_code,
              sem.name as semester_name
       FROM classes c
       JOIN subjects sub ON c.subject_id = sub.id
       JOIN users u ON c.tutor_id = u.id
       JOIN semesters sem ON c.semester_id = sem.id
       JOIN class_registrations cr ON c.id = cr.class_id
       WHERE cr.student_id = ?
         AND date('now') BETWEEN date(sem.start_date) AND date(sem.end_date)
       ORDER BY sub.code`,
      [student_id],
      (err, rows) => {
        if (err) return reject(err);
        resolve(rows || []);
      }
    );
  });
}

module.exports = {
  db,
  getUserByUsername,
  getUserById,
  createUser,
  updateUser,
  // semesters
  createSemester,
  getSemesters,
  getSemesterById,
  getCurrentSemester,
  // subjects
  createSubject,
  getSubjectsBySemester,
  getSubjectById,
  // classes
  createClass,
  getClassById,
  getClassesByTutorAndSemester,
  getClassesBySubject,
  deleteClass,
  // free_schedules
  createFreeSchedule,
  getFreeScheduleByTutorAndSemester,
  updateFreeSchedule,
  deleteFreeSchedule,
  // recurring_schedules
  createRecurringSchedule,
  getRecurringSchedulesByClass,
  getRecurringSchedulesByTutorAndSemester,
  getRecurringScheduleById,
  updateRecurringSchedule,
  deleteRecurringSchedule,
  // class_registrations
  registerStudentInClass,
  getRegisteredClassesByStudent,
  getClassesForStudent,
  unregisterStudentFromClass,
  // sessions
  generateSessionsFromRecurringSchedule,
  createSession,
  getSessionById,
  getSessionsByStudentAndMonth,
  getSessionsByTutorAndMonth,
  getSessionsByStudentAndSemester,
  getSessionsByTutorAndSemester,
  updateSession,
  cancelSession,
  completeSession,
  // reschedule_polls
  createReschedulePoll,
  getPollById,
  getPollsByClass,
  getPollsByStudent,
  voteOnPoll,
  getPollVotes,
  closePoll,
  // feedbacks
  createFeedback,
  getFeedbacksByTutor,
  getCompletedSessionsWithoutFeedback,
  getCurrentClassesByStudent,
};
