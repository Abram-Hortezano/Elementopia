import axios from "axios";

// Match your other services
const API_URL = "https://elementopia.onrender.com/api/lesson-completion";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {};
};

const LessonCompletionService = {
  // Complete a lesson (POST /complete)
  completeLesson: async (completionData) => {
    // completionData should probably look like { userId: 1, lessonId: 1 }
    try {
      const response = await axios.post(
        `${API_URL}/complete`,
        completionData,
        { headers: getAuthHeader() }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to complete lesson:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get all completions for a user (GET /user/{userId})
  getUserCompletions: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: getAuthHeader(),
      });
      return response.data; // Assuming this returns an array of completion objects
    } catch (error) {
      console.error("Failed to fetch user completions:", error.response?.data || error.message);
      throw error;
    }
  },

  // Delete a completion record (DELETE /delete/{id})
  deleteCompletion: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to delete completion:", error.response?.data || error.message);
      throw error;
    }
  }
};

export default LessonCompletionService;