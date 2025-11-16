const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getProfile,
  updateProfile,
  uploadAvatar,
} = require("../controllers/userController");

// Setup multer storage (store avatars in backend/images)
const uploadsDir = path.join(__dirname, "..", "images");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});
const upload = multer({ storage });

// GET /api/users/:id
router.get("/:id", getProfile);

// PUT /api/users/:id
router.put("/:id", updateProfile);

// POST avatar
router.post("/:id/avatar", upload.single("avatar"), uploadAvatar);

module.exports = router;
