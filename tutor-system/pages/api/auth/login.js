// pages/api/auth/login.js
import { loginUser } from "../../../mockDB";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  // Gọi hàm login từ mockDB
  const result = loginUser(email, password);

  if (result.success) {
    return res.status(200).json({
      success: true,
      user: result.user,
    });
  } else {
    return res.status(401).json({
      success: false,
      error: result.error,
    });
  }
}
