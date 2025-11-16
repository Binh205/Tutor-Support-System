const { getUserByEmail, getUserByUsername } = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_change_me";

// POST /api/auth/login
// Expecting { email, password } from frontend. Some clients may send { username, password }
// so support both by mapping username -> email if needed at the client side.
const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if ((!email && !username) || !password)
      return res
        .status(400)
        .json({ error: "Email/username and password required" });

    // Allow login by username OR email
    let user = null;
    if (username) {
      user = await getUserByUsername(username);
    } else if (email) {
      user = await getUserByEmail(email);
    }

    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const { password_hash, ...userWithoutPassword } = user;

    // Create JWT
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({ success: true, token, user: userWithoutPassword });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = { login };
