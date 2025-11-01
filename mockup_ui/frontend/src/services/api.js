import axios from "axios";

// API Base URL pointing to backend
const API_BASE_URL = "http://localhost:5000/api";

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ============ AUTH APIs ============

/**
 * Login with email and password
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise} - User data response
 */
export const loginAPI = async (email, password) => {
  try {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

// ============ SESSION APIs ============

/**
 * Get all sessions
 * @returns {Promise} - Sessions list
 */
export const getAllSessionsAPI = async () => {
  try {
    const response = await apiClient.get("/sessions");
    return response.data;
  } catch (error) {
    console.error("Get sessions error:", error.response?.data || error.message);
    throw error;
  }
};

/**
 * Get sessions by student ID
 * @param {number} studentId - Student ID
 * @returns {Promise} - Student's sessions
 */
export const getStudentSessionsAPI = async (studentId) => {
  try {
    const response = await apiClient.get(`/sessions/student/${studentId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Get student sessions error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// ============ TUTOR APIs ============

/**
 * Get all tutors
 * @returns {Promise} - Tutors list
 */
export const getAllTutorsAPI = async () => {
  try {
    const response = await apiClient.get("/sessions/tutors");
    return response.data;
  } catch (error) {
    console.error("Get tutors error:", error.response?.data || error.message);
    throw error;
  }
};

// ============ HEALTH CHECK ============

/**
 * Check if backend is running
 * @returns {Promise} - Server status
 */
export const healthCheckAPI = async () => {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    console.error("Health check error:", error.message);
    throw error;
  }
};

export default apiClient;
