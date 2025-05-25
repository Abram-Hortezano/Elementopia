import axios from "axios";

const API_URL = "http://localhost:8080/api/user";
// const API_URL = "https://elementopia.onrender.com/api/user"; if not using localhost
// const API_URL = "https://elementopia.onrender.com/api/user";

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {};
};

const UserService = {
  // Login and get token
  loginUser: async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username,
        password,
      });

      const { token } = response.data;
      localStorage.setItem("token", token); // Store token securely
      return response.data;
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get current user info
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/current-user`, {
        headers: {
          ...getAuthHeader(),
        },
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch current user:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update profile info
  updateProfile: async (id, profileData) => {
    try {
      const response = await axios.put(
        `${API_URL}/updateProfile?id=${id}`,
        profileData,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to update profile:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Update entire user record (with optional password)
  updateUser: async (id, userData) => {
    try {
      const response = await axios.put(
        `${API_URL}/updateUser/${id}`,
        userData,
        {
          headers: {
            ...getAuthHeader(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to update user:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Register new user
  registerUser: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (error) {
      console.error(
        "Registration failed:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Logout by removing token
  logout: () => {
    localStorage.removeItem("token");
  },

  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/deleteUser/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("deletion failed:", error.response?.data || error.message);
      throw error;
    }
  },

  getUserRole: () => {
    return localStorage.getItem("role");
  },
};


export default UserService;
