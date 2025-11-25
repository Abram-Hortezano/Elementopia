import axios from "axios";

// 1. BASE URL (Points to the root /api)
// 🚀 LIVE BACKEND
const BASE_URL = "https://elementopia.onrender.com/api";
// const BASE_URL = "http://localhost:8080/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    // console.warn("No token found!"); // Optional: Silence warning if checking on load
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

const LessonService = {
  // ==========================================
  //  PART 1: LESSON CONTENT (Your Existing Code)
  // ==========================================

  // Fetch all Lessons
  getAllLessons: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/lessons/getAll`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch all lessons:", error.response?.data || error.message);
      throw error;
    }
  },

  // Fetch a Lesson by ID
  getLessonById: async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/lessons/get/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch lesson ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Create a new Lesson
  createLesson: async (lessonData) => {
    try {
      const response = await axios.post(`${BASE_URL}/lessons/create`, lessonData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create lesson:", error.response?.data || error.message);
      throw error;
    }
  },

  // Add Topic to Lesson
  addTopic: async (lessonId, topicData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/lessons/${lessonId}/addTopic`,
        topicData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add topic:", error);
      throw error;
    }
  },

  // Add Subtopic
  addSubtopic: async (lessonId, topicId, subtopicData) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/lessons/${lessonId}/topic/${topicId}/add-subtopic`,
        subtopicData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add subtopic:", error);
      throw error;
    }
  },

  // Update Topic
  updateTopic: async (lessonId, topicId, updatedTopicData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/lessons/${lessonId}/topic/${topicId}/update`,
        updatedTopicData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update topic:", error);
      throw error;
    }
  },

  // Delete Topic
  deleteTopic: async (lessonId, topicId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/lessons/${lessonId}/topic/${topicId}/delete`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete topic:", error);
      throw error;
    }
  },

  // Update Subtopic
  updateSubtopic: async (lessonId, topicId, subtopicId, updatedSubtopicData) => {
    try {
      const response = await axios.put(
        `${BASE_URL}/lessons/${lessonId}/topic/${topicId}/subtopic/${subtopicId}/update`,
        updatedSubtopicData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update subtopic:", error);
      throw error;
    }
  },

  // Delete Subtopic
  deleteSubtopic: async (lessonId, topicId, subtopicId) => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/lessons/${lessonId}/topic/${topicId}/subtopic/${subtopicId}/delete`,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete subtopic:", error);
      throw error;
    }
  },

  // ==========================================
  //  PART 2: GAMIFICATION & PROGRESS (NEW)
  // ==========================================

  // Get list of completed lessons for a user
  // Endpoint: /api/lesson-completion/user/{userId}
  getCompletedLessons: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/lesson-completion/user/${userId}`, {
        headers: getAuthHeader(),
      });
      // Ensure we return an array
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Failed to fetch completions:", error);
      return []; // Return empty array on error so app doesn't crash
    }
  },

  // Mark a lesson as complete
  // Endpoint: /api/lesson-completion/complete
  markLessonComplete: async (lessonId, userId) => {
    try {
      const response = await axios.post(
        `${BASE_URL}/lesson-completion/complete`,
        { lessonId: lessonId, userId: userId }, // Adjust body based on backend requirement
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to mark complete:", error);
      throw error;
    }
  },

  // Get Student Scores (for Challenges)
  // Endpoint: /api/score/{userId}
  getStudentScores: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/score/${userId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch scores:", error);
      throw error;
    }
  }
};

export default LessonService;