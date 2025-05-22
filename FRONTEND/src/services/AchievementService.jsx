import axios from "axios";

const API_URL = "http://localhost:8080/api/achievement"; // Adjust if needed

const getAuthHeader = () => {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = user?.token; // Assuming your login response includes a token
  
  console.log('Auth Debug Info:', {
    userExists: !!user,
    tokenExists: !!token,
    tokenLength: token?.length,
    tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
  });
  
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const AchievementService = {
  // Get All Achievements
  getAllAchievements: async () => {
    try {
      const headers = getAuthHeader();
      console.log('getAllAchievements - Headers:', headers);
      
      const response = await axios.get(
        `${API_URL}/getAll`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get all achievements:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get Achievement by ID
  getAchievementById: async (id) => {
    try {
      const headers = getAuthHeader();
      console.log('getAchievementById - Headers:', headers);
      
      const response = await axios.get(
        `${API_URL}/get/${id}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get achievement by ID:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get Achievements by User
  getAchievementsByUser: async (userId) => {
    try {
      const headers = getAuthHeader();
      console.log('getAchievementsByUser - Headers:', headers);
      console.log('getAchievementsByUser - UserId:', userId);
      
      const response = await axios.get(
        `${API_URL}/user/${userId}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to get user achievements:", error.response?.data || error.message);
      throw error;
    }
  },

  // Create Achievement
  createAchievement: async (userId, achievementData) => {
    try {
      const headers = getAuthHeader();
      console.log('createAchievement - Headers:', headers);
      console.log('createAchievement - UserId:', userId);
      console.log('createAchievement - Data:', achievementData);
      console.log('createAchievement - URL:', `${API_URL}/create/${userId}`);
      
      const response = await axios.post(
        `${API_URL}/create/${userId}`,
        achievementData,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to create achievement:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: `${API_URL}/create/${userId}`,
        headers: getAuthHeader()
      });
      throw error;
    }
  },

  // Update Achievement
  updateAchievement: async (id, achievementData) => {
    try {
      const headers = getAuthHeader();
      console.log('updateAchievement - Headers:', headers);
      
      const response = await axios.put(
        `${API_URL}/update/${id}`,
        achievementData,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update achievement:", error.response?.data || error.message);
      throw error;
    }
  },

  // Delete Achievement
  deleteAchievement: async (id) => {
    try {
      const headers = getAuthHeader();
      console.log('deleteAchievement - Headers:', headers);
      
      const response = await axios.delete(
        `${API_URL}/delete/${id}`,
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to delete achievement:", error.response?.data || error.message);
      throw error;
    }
  },

  // Unlock Achievement
  unlockAchievement: async (userId, achievementId) => {
    try {
      const headers = getAuthHeader();
      console.log('unlockAchievement - Headers:', headers);
      console.log('unlockAchievement - UserId:', userId, 'AchievementId:', achievementId);
      
      const response = await axios.post(
        `${API_URL}/unlock?userId=${userId}&achievementId=${achievementId}`,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to unlock achievement:", error.response?.data || error.message);
      throw error;
    }
  },

  // Unlock Achievement by code name
  unlockAchievementByCode: async (userId, codeName) => {
    try {
      const headers = getAuthHeader();
      console.log('unlockAchievementByCode - Headers:', headers);
      console.log('unlockAchievementByCode - UserId:', userId, 'CodeName:', codeName);
      
      const response = await axios.post(
        `${API_URL}/unlockByCode?userId=${userId}&codeName=${codeName}`,
        {},
        { headers }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to unlock achievement by code:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: `${API_URL}/unlockByCode?userId=${userId}&codeName=${codeName}`,
        headers: getAuthHeader()
      });
      throw error;
    }
  },
};

export default AchievementService;