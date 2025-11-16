const path = require("path");
const fs = require("fs");
const { getUserById, updateUser } = require("../db");

// GET /api/users/:id
async function getProfile(req, res) {
  try {
    const id = Number(req.params.id);
    const user = await getUserById(id);
    if (!user) return res.status(404).json({ error: "Not found" });
    const { password_hash, ...u } = user;
    res.json(u);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to load user" });
  }
}

// PUT /api/users/:id
async function updateProfile(req, res) {
  try {
    const id = Number(req.params.id);
    const allowed = ["phone", "address", "email"];
    const payload = {};
    for (const k of allowed) {
      if (k in req.body) payload[k] = req.body[k];
    }
    const updated = await updateUser(id, payload);
    const { password_hash, ...u } = updated;
    res.json(u);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update user" });
  }
}

// POST /api/users/:id/avatar
async function uploadAvatar(req, res) {
  try {
    const id = Number(req.params.id);
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    // Save path relative to /images
    const avatarPath = `/images/${req.file.filename}`;
    const updated = await updateUser(id, { avatar_path: avatarPath });
    const { password_hash, ...u } = updated;
    res.json(u);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to upload avatar" });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  uploadAvatar,
};
