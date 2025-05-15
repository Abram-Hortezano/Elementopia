import axios from "axios";

const API_URL = "http://localhost:8080/api/lessons";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found in localStorage!");
    throw new Error("Authorization token is missing.");
  }
  return { Authorization: `Bearer ${token}` };
};

const LessonService = {
  // Fetch all Lessons
  getAllLessons: async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`, {
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
      const response = await axios.get(`${API_URL}/get/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch lesson with ID ${id}:`, error.response?.data || error.message);
      throw error;
    }
  },

  // Create a new Lesson
  createLesson: async (lessonData) => {
    try {
      const response = await axios.post(`${API_URL}/create`, lessonData, {
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
      const response = await axios.post(`${API_URL}/${lessonId}/addTopic`, topicData, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to add topic:", error.response?.data || error.message);
      throw error;
    }
  },

  // Add Subtopic to Topic in a Lesson
  addSubtopic: async (lessonId, topicId, subtopicData) => {
    try {
      const response = await axios.post(
        `${API_URL}/${lessonId}/topic/${topicId}/add-subtopic`,
        subtopicData,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to add subtopic:", error.response?.data || error.message);
      throw error;
    }
  },

  // Update Topic in a Lesson
  updateTopic: async (lessonId, topicId, updatedTopicData) => {
    try {
      const response = await axios.put(
        `${API_URL}/${lessonId}/topic/${topicId}/update`,
        updatedTopicData,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update topic:", error.response?.data || error.message);
      throw error;
    }
  },

  // Delete Topic from Lesson
  deleteTopic: async (lessonId, topicId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${lessonId}/topic/${topicId}/delete`,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete topic:", error.response?.data || error.message);
      throw error;
    }
  },

  // Update Subtopic in a Topic
  updateSubtopic: async (lessonId, topicId, subtopicId, updatedSubtopicData) => {
    try {
      const response = await axios.put(
        `${API_URL}/${lessonId}/topic/${topicId}/subtopic/${subtopicId}/update`,
        updatedSubtopicData,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update subtopic:", error.response?.data || error.message);
      throw error;
    }
  },

  // Delete Subtopic from Topic
  deleteSubtopic: async (lessonId, topicId, subtopicId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${lessonId}/topic/${topicId}/subtopic/${subtopicId}/delete`,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete subtopic:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default LessonService;
