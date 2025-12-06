import axios from "axios";

// const API_URL = "https://elementopia.onrender.com/api/lesson-completion";
const API_URL = "http://localhost:8080/api/lesson-completion";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  }
  return {};
};

const LessonCompletionService = {

  completeLesson: async (userId, lessonId) => {
    console.log(`LessonCompletionService: completeLesson called with userId=${userId}, lessonId=${lessonId}`);
    try {

      const completionData = { userId, lessonId };
      const response = await axios.post(
        `${API_URL}/complete`, 
        completionData, 
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Failed to complete lesson:", error.response?.data || error.message);
      throw error;
    }
  },

  getUserCompletions: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Failed to fetch user completions:", error.response?.data || error.message);
      throw error;
    }
  },

  deleteCompletion: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Failed to delete completion:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default LessonCompletionService;