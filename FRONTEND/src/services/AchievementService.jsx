import axios from "axios";

const API_URL = "https://elementopia.onrender.com/api/achievement"; // Adjust if needed

const getAuthHeader = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token; // Assuming your login response includes a token
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AchievementService = {
  // Get All Achievements
  getAllAchievements: async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to get all achievements:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get Achievement by ID
  getAchievementById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/get/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to get achievement by ID:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get Achievements by User
  getAchievementsByUser: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to get user achievements:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Create Achievement
  createAchievement: async (userId, achievementData) => {
    try {
      const response = await axios.post(
        `${API_URL}/create/${userId}`,
        achievementData,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to create achievement:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update Achievement
  updateAchievement: async (id, achievementData) => {
    try {
      const response = await axios.put(
        `${API_URL}/update/${id}`,
        achievementData,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to update achievement:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Delete Achievement
  deleteAchievement: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/delete/${id}`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to delete achievement:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Unlock Achievement
  unlockAchievement: async (userId, achievementId) => {
    try {
      const response = await axios.post(
        `${API_URL}/unlock?userId=${userId}&achievementId=${achievementId}`,
        {},
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to unlock achievement:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Unlock Achievement by code name
  unlockAchievementByCode: async (userId, codeName) => {
    try {
      const response = await axios.post(
        `${API_URL}/unlockByCode?userId=${userId}&codeName=${codeName}`,
        {},
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to unlock achievement by code:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default AchievementService;
