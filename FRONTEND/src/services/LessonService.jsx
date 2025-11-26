import axios from "axios";

// const BASE_URL = "https://elementopia.onrender.com/api";
const BASE_URL = "http://localhost:8080/api";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

const LessonService = {
 
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
  // 1. Save Lesson Progress (Called by Student Component)
  saveLessonProgress: async (payload) => {
    try {
      // payload: { lessonId: 1, score: 100, progress: true, student: { userId: 5 } }
      const response = await axios.post(`${BASE_URL}/lesson-scores`, payload, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Save Progress Error:", error);
      throw error;
    }
  },

  // 2. Get All Scores (Called by Teacher Dashboard)
  // Uses the NEW endpoint to get data for calculation
  getAllScores: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/lesson-scores`, {
        headers: getAuthHeader(),
      });
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error("Fetch Scores Error:", error);
      return [];
    }
  },

  // 3. Get Student Total Score (Career Score)
  getStudentScores: async (userId) => {
    try {
      const response = await axios.get(`${BASE_URL}/score/${userId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch career scores:", error);
      throw error;
    }
  },
  
  getCompletedLessons: async (userId) => {
      // We can reuse getAllScores and filter, or just use getAllScores
      try {
        const allScores = await LessonService.getAllScores();
        // Filter locally for this user
        return allScores.filter(s => s.student?.userId === userId || s.student?.id === userId);
      } catch (e) { return []; }
  }
};

export default LessonService;