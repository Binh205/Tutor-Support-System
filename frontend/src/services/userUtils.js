import apiClient from "./api";

// Derive backend origin from apiClient baseURL (apiClient.baseURL points to e.g. http://localhost:5000/api)
const BACKEND_ORIGIN = (apiClient?.defaults?.baseURL || "").replace(
  /\/api$/,
  ""
);

export function normalizeUser(user) {
  if (!user) return user;
  const u = { ...user };
  // If backend returns avatar_path, expose a convenient `avatar` absolute URL
  if (!u.avatar && u.avatar_path) {
    // avatar_path is like '/images/filename'
    u.avatar = `${BACKEND_ORIGIN}${u.avatar_path}`;
  }
  return u;
}

export function getCurrentUser() {
  const userStr = localStorage.getItem("user");
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return normalizeUser(user);
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
}

export default normalizeUser;
