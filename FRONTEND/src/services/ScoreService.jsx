import axios from "axios";

// const API_URL = "http://localhost:8080/api/score";
const API_URL = "https://elementopia.onrender.com/api/score";

const getAuthHeader = () => {
  const userStr = sessionStorage.getItem("user") || localStorage.getItem("user");

  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      const token = userObj.token || (typeof userObj === 'string' ? userObj : null);

      if (token) {
        return {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      }
    } catch (e) {
      console.warn("Error parsing user token for ScoreService:", e);
    }
  }
  return {
    headers: {
      "Content-Type": "application/json",
    }
  };
};

const ScoreService = {
  
  /**
   * Get a user's score
   * @param {number} userId - User's ID
   */
  getScore: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Failed to fetch score:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Add points when a challenge is completed
   * @param {number} userId - User's ID
   * @param {number} points - Points to add (default: 100)
   */
  addChallengeScore: async (userId, points = 100) => {
    try {
      const response = await axios.post(
        `${API_URL}/challenge/${userId}`,
        { points },
        getAuthHeader()
      );
      console.log(`💯 Added ${points} points to career score`);
      return response.data;
    } catch (error) {
      console.error("Failed to add challenge score:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get all scores (for leaderboard, etc.)
   */
  getAllScores: async () => {
    try {
      const response = await axios.get(`${API_URL}/all`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Failed to fetch all scores:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Update score with lesson completion (legacy method)
   */
  updateScoreWithLesson: async (userId, scoreDTO) => {
    try {
      const response = await axios.put(
        `${API_URL}/update/${userId}`,
        scoreDTO,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error("Failed to update score:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Create a score record for a user (if it doesn't exist)
   */
  createScore: async (userId) => {
    try {
      const response = await axios.post(
        `${API_URL}/create/${userId}`,
        {},
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      // If score already exists, that's okay
      if (error.response?.status === 400 || error.message?.includes("already exists")) {
        console.log("Score already exists for user");
        return null;
      }
      console.error("Failed to create score:", error.response?.data || error.message);
      throw error;
    }
  },
};

export default ScoreService;