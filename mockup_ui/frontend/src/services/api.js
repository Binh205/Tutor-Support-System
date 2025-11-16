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

// Attach Authorization header from localStorage if token exists
apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // ignore
  }
  return config;
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

// ============ SCHEDULE APIs ============

export const getSemestersAPI = async () => {
  try {
    const response = await apiClient.get(`/tutor/semesters`);
    return response.data;
  } catch (error) {
    console.error(
      "Get semesters error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getSubjectsAPI = async (semesterId) => {
  try {
    const response = await apiClient.get(
      `/tutor/semester/${semesterId}/subjects`
    );
    return response.data;
  } catch (error) {
    console.error("Get subjects error:", error.response?.data || error.message);
    throw error;
  }
};

export const createFreeScheduleAPI = async (payload) => {
  try {
    const response = await apiClient.post(`/tutor/schedule`, payload);
    return response.data;
  } catch (error) {
    console.error(
      "Create free schedule error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getFreeScheduleAPI = async (tutorId, semesterId) => {
  try {
    const response = await apiClient.get(`/tutor/schedule`, {
      params: { tutorId, semesterId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get free schedule error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const updateFreeScheduleAPI = async (scheduleId, payload) => {
  try {
    const response = await apiClient.put(
      `/tutor/schedule/${scheduleId}`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Update free schedule error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const createRecurringScheduleAPI = async (classId, payload) => {
  try {
    const response = await apiClient.post(
      `/tutor/class/${classId}/recurring-schedule`,
      payload
    );
    return response.data;
  } catch (error) {
    console.error(
      "Create recurring schedule error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getRecurringSchedulesAPI = async (classId) => {
  try {
    const response = await apiClient.get(
      `/tutor/class/${classId}/recurring-schedule`
    );
    return response.data;
  } catch (error) {
    console.error(
      "Get recurring schedules error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Class APIs
export const createClassAPI = async (payload) => {
  try {
    const response = await apiClient.post(`/tutor/class`, payload);
    return response.data;
  } catch (error) {
    console.error("Create class error:", error.response?.data || error.message);
    throw error;
  }
};

export const getClassesByTutorAPI = async (tutorId, semesterId) => {
  try {
    const response = await apiClient.get(`/tutor/classes`, {
      params: { tutorId, semesterId },
    });
    return response.data;
  } catch (error) {
    console.error("Get classes error:", error.response?.data || error.message);
    throw error;
  }
};

export const getTutorSchedulesAPI = async (tutorId, semesterId) => {
  try {
    const response = await apiClient.get(`/tutor/tutor-schedules`, {
      params: { tutorId, semesterId },
    });
    return response.data;
  } catch (error) {
    console.error("Get tutor schedules error:", error.response?.data || error.message);
    throw error;
  }
};

// ============ STUDENT APIs ============

/**
 * Get current semester
 * @returns {Promise} - Current semester data
 */
export const getCurrentSemesterAPI = async () => {
  try {
    const response = await apiClient.get(`/student/current-semester`);
    return response.data;
  } catch (error) {
    console.error(
      "Get current semester error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Get subjects by semester
 * @param {number} semesterId - Semester ID
 * @returns {Promise} - Subjects list
 */
export const getSubjectsBySemesterAPI = async (semesterId) => {
  try {
    const response = await apiClient.get(`/student/subjects`, {
      params: { semesterId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get subjects error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Get classes by subject
 * @param {number} subjectId - Subject ID
 * @returns {Promise} - Classes list
 */
export const getClassesBySubjectAPI = async (subjectId) => {
  try {
    const response = await apiClient.get(`/student/classes-by-subject`, {
      params: { subjectId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get classes by subject error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Get available classes for student by semester
 * @param {number} semesterId - Semester ID
 * @returns {Promise} - Available classes list
 */
export const getAvailableClassesAPI = async (semesterId) => {
  try {
    const response = await apiClient.get(`/student/classes`, {
      params: { semesterId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get available classes error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Register student in a class
 * @param {number} classId - Class ID
 * @param {number} studentId - Student ID
 * @returns {Promise} - Registration response
 */
export const registerClassAPI = async (classId, studentId) => {
  try {
    const response = await apiClient.post(
      `/student/classes/${classId}/register`,
      {
        student_id: studentId,
      }
    );
    return response.data;
  } catch (error) {
    // Handle 409 duplicate registration
    if (error.response?.status === 409) {
      throw {
        statusCode: 409,
        message: error.response?.data?.error || "Đã đăng ký rồi",
      };
    }
    console.error(
      "Register class error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Get student's registered classes
 * @param {number} studentId - Student ID
 * @returns {Promise} - Registered classes
 */
export const getStudentRegisteredClassesAPI = async (studentId) => {
  try {
    const response = await apiClient.get(`/student/registered-classes`, {
      params: { studentId },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Get registered classes error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Unregister student from class
 * @param {number} classId - Class ID
 * @param {number} studentId - Student ID
 * @returns {Promise} - Unregister response
 */
export const unregisterClassAPI = async (classId, studentId) => {
  try {
    const response = await apiClient.delete(
      `/student/classes/${classId}/unregister`,
      {
        data: { student_id: studentId },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      "Unregister class error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export default apiClient;
