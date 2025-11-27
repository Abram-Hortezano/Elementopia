import axios from "axios";

// const API_URL = "https://elementopia.onrender.com/api/section";
const API_URL = "http://localhost:8080/api/section";

// Robust Token Helper
const getAuthHeader = () => {
  let token = localStorage.getItem("token");

  // Fallback: Check inside 'user' object in localStorage or sessionStorage
  if (!token) {
    try {
      const userStr =
        localStorage.getItem("user") || sessionStorage.getItem("user");
      if (userStr) {
        const user = JSON.parse(userStr);
        token = user.token || user.accessToken;
      }
    } catch (e) {
      console.warn("Error parsing user token:", e);
    }
  }

  if (!token) {
    console.error("⚠️ No auth token found!");
    throw new Error("Authorization token is missing. Please log in.");
  }

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

const SectionService = {
  // Create Section (Maps Frontend 'Section' -> Backend 'Lab')
  createSection: async (data) => {
    try {
      // Translation: Section Name -> Laboratory Name
      console.log(data);
      const payload = {
        sectionName: data.sectionName,
        sectionCode: data.sectionCode,
        teacherId: data.teacherId,
      };

      const response = await axios.post(`${API_URL}/create`, payload, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to create section:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Join Section (Maps to 'add-student')
  joinSection: async (data) => {
    try {
      const response = await axios.post(
        `${API_URL}/join`,
        {
          studentId: data.studentId,
          sectionCode: data.sectionCode,
        },
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to join section:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Get Class Members (Get Lab by Code)
  getClassMembers: async (sectionCode) => {
    try {
      const response = await axios.get(`${API_URL}/getClassMembers`, {
        params: { code: sectionCode },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch class members:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getTeacherId: async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/teacher/me`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to get class members:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  // Gets all Sections for a Teacher
  getAllSectionsByTeacherId: async (teacherId) => {
    try {
      const response = await axios.get(`${API_URL}/teacher/${teacherId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to get teacher sections:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteLab: async (labId) => {
    try {
      const response = await axios.delete(`${API_URL}/${labId}`, {
        headers: getAuthHeader(),
      });
      console.log("Deleting lab with ID:", labId);
      return response.data;
    } catch (error) {
      console.error(
        "Failed to delete lab:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default SectionService;
