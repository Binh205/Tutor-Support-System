# ✅ Migration: Fixed Subjects Table UNIQUE Constraint

## 🎯 Problem

The original database schema had:
```sql
code TEXT UNIQUE NOT NULL
```

This prevented the same subject code (e.g., CO1007) from being added to multiple semesters.

**Error encountered:**
```
UNIQUE constraint failed: subjects.code
```

When trying to add CO1007 to HK252, it failed because CO1007 already existed in HK251.

---

## ✅ Solution

Changed the UNIQUE constraint to be **composite** on `(code, semester_id)`:

```sql
UNIQUE(code, semester_id)
```

**Result:**
- ✅ Same subject can exist in different semesters
- ✅ Prevents duplicate subjects within the same semester
- ✅ Example: CO1007 can be in both HK251 and HK252

---

## 🔧 Migration Script

File: `backend/migrateSubjectsSchema.js`

**What it does:**
1. Creates new table `subjects_new` with correct schema
2. Copies all data from old `subjects` table
3. Drops old `subjects` table
4. Renames `subjects_new` to `subjects`
5. Verifies the new schema

**How to run:**
```bash
cd backend
node migrateSubjectsSchema.js
```

**Output:**
```
🔄 Starting migration: subjects table schema...
✅ New table created successfully
✅ Data copied successfully
✅ Old table dropped successfully
✅ Table renamed successfully
✅ Migration completed successfully!
```

---

## 📚 New Seeding Tool

File: `backend/seedSubjectsMultipleSemesters.js`

**Features:**
- Seed subjects for one or multiple semesters
- Idempotent (can run multiple times safely)
- Checks for existing subjects before inserting
- Detailed progress reporting

**Usage:**

### Seed all semesters:
```bash
node backend/seedSubjectsMultipleSemesters.js
```

### Seed specific semester:
```bash
node backend/seedSubjectsMultipleSemesters.js HK252
```

### Seed multiple specific semesters:
```bash
node backend/seedSubjectsMultipleSemesters.js HK251,HK252,HK253
```

**Example output:**
```
🌱 Starting to seed subjects for multiple semesters...

🎯 Target semesters:
   - HK252: Học kỳ 2 năm 2025-2026 (2026-02-01 → 2026-06-30)

📚 Seeding subjects for HK252 - Học kỳ 2 năm 2025-2026
   Creating 18 subjects...

   ✅ CO1007 - Cấu trúc rời rạc (250 students)
   ✅ CO1023 - Hệ thống số (220 students)
   ...

   Summary for HK252:
   - Created: 17
   - Skipped: 1
   - Errors: 0
```

---

## 🧪 Verification

File: `backend/checkSubjectsBySemester.js`

**What it does:**
- Lists all subjects grouped by code
- Shows which semesters each subject appears in
- Provides breakdown by semester

**How to run:**
```bash
cd backend
node checkSubjectsBySemester.js
```

**Example output:**
```
📊 All subjects by semester:

   CO1007 (HK251): Cấu trúc rời rạc
   CO1007 (HK252): Cấu trúc rời rạc

   CO1023 (HK251): Hệ thống số
   CO1023 (HK252): Hệ thống số

   ...

============================================================
Total subject entries: 37

Breakdown by semester:
   HK251: 19 subjects (Học kỳ 1 năm 2025-2026)
   HK252: 18 subjects (Học kỳ 2 năm 2025-2026)
============================================================
```

---

## 📊 Current Status

After migration and seeding:

- **HK251**: 19 subjects
- **HK252**: 18 subjects
- **Total entries**: 37 subject records

**Subjects available in both semesters:**
CO1007, CO1023, CO1027, CO2003, CO2013, CO2039, CO3001, CO3005, CO3009, CO3015, CO3057, CO3061, CO3091, CO3093, CO3103, CO3121, CO3141

---

## 🎓 18 Core Subjects

All scripts seed these 18 subjects:

1. **CO1007** - Cấu trúc rời rạc (250 students)
2. **CO1023** - Hệ thống số (220 students)
3. **CO1027** - Kỹ thuật lập trình (300 students)
4. **CO2003** - Cấu trúc dữ liệu và giải thuật (280 students)
5. **CO2013** - Hệ điều hành (200 students)
6. **CO2039** - Cơ sở dữ liệu (240 students)
7. **CO3001** - Công nghệ phần mềm (210 students)
8. **CO3005** - Phân tích và thiết kế thuật toán (160 students)
9. **CO3009** - Trí tuệ nhân tạo (190 students)
10. **CO3015** - Học máy (170 students)
11. **CO3021** - Xử lý ngôn ngữ tự nhiên (140 students)
12. **CO3057** - Lập trình Web (230 students)
13. **CO3061** - Phát triển ứng dụng di động (150 students)
14. **CO3091** - Thiết kế và phân tích hệ thống (130 students)
15. **CO3093** - Mạng máy tính (180 students)
16. **CO3103** - An toàn và bảo mật thông tin (160 students)
17. **CO3121** - Thị giác máy tính (120 students)
18. **CO3141** - Blockchain và ứng dụng (100 students)

---

## 📝 Database Schema (After Migration)

```sql
CREATE TABLE subjects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  semester_id INTEGER NOT NULL,
  total_students INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (semester_id) REFERENCES semesters(id) ON DELETE CASCADE,
  UNIQUE(code, semester_id)  -- ⭐ This is the key change
);
```

---

## 🚀 Quick Start Guide

### Step 1: Run Migration (if not done yet)
```bash
cd backend
node migrateSubjectsSchema.js
```

### Step 2: Seed Subjects for All Semesters
```bash
# Seed all available semesters
node seedSubjectsMultipleSemesters.js

# OR seed specific semesters
node seedSubjectsMultipleSemesters.js HK251,HK252
```

### Step 3: Verify
```bash
node checkSubjectsBySemester.js
```

---

## ⚠️ Important Notes

1. **Migration is one-time**: Once `migrateSubjectsSchema.js` is run, don't run it again unless you need to reset the schema

2. **Idempotent seeding**: You can run `seedSubjectsMultipleSemesters.js` multiple times safely - it checks for existing subjects

3. **Original seedSubjects.js still works**: The old script is still functional but only seeds HK251

4. **Backend restart not needed**: Database schema changes take effect immediately

---

## 🔍 Troubleshooting

### Still getting UNIQUE constraint error?

Make sure migration was completed successfully:
```bash
node backend/migrateSubjectsSchema.js
```

Check the output - should see "✅ Migration completed successfully!"

### Want to check current schema?

```bash
cd backend
sqlite3 data.sqlite "PRAGMA table_info(subjects);"
```

Should show `UNIQUE(code, semester_id)` constraint.

---

## 📞 Related Files

- `backend/migrateSubjectsSchema.js` - Migration script
- `backend/seedSubjectsMultipleSemesters.js` - New multi-semester seeding tool
- `backend/seedSubjects.js` - Original seeding script (HK251 only)
- `backend/checkSubjectsBySemester.js` - Verification tool
- `backend/db.js` - Database initialization (original schema)

---

## ✅ Completed

- [x] Identified UNIQUE constraint issue
- [x] Created migration script
- [x] Successfully migrated database schema
- [x] Tested adding duplicate subject codes to different semesters
- [x] Created new multi-semester seeding tool
- [x] Seeded HK252 with 18 subjects
- [x] Created verification tool
- [x] Documented the entire process

**Status:** ✅ All working correctly!
