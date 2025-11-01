const { getUser } = require("../mockDB");

// Login controller
const login = (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user
    const user = getUser(email);

    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password (simple check - no hashing for mock)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({
      success: true,
      message: "Login successful",
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};

module.exports = {
  login,
};
