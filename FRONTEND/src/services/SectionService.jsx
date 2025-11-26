import axios from "axios";

// 🚀 LIVE BACKEND URL (matches your login token)
// const API_URL = "https://elementopia.onrender.com/api/labs";
const API_URL = "http://localhost:8080/api/labs";


// Robust Token Helper
const getAuthHeader = () => {
  let token = localStorage.getItem("token");

  // Fallback: Check inside 'user' object in localStorage or sessionStorage
  if (!token) {
    try {
      const userStr = localStorage.getItem("user") || sessionStorage.getItem("user");
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
    "Content-Type": "application/json"
  };
};

const SectionService = {
  // Create Section (Maps Frontend 'Section' -> Backend 'Lab')
  createSection: async (data) => {
    try {
      // Translation: Section Name -> Laboratory Name
      const payload = {
        laboratoryName: data.sectionName,
        labCode: data.sectionCode,
        creatorId: data.teacherId,
        studentIds: [],
        lessonIds: []
      };

      const response = await axios.post(`${API_URL}/create`, payload, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to create section:", error.response?.data || error.message);
      throw error;
    }
  },

  // Join Section (Maps to 'add-student')
  joinSection: async (data) => {
    try {
      const response = await axios.put(
        `${API_URL}/${data.sectionCode}/add-student`,
        {}, // Empty body
        {
          params: { studentId: data.studentId },
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to join section:", error.response?.data || error.message);
      throw error;
    }
  },

  // Get Class Members (Get Lab by Code)
  getClassMembers: async (sectionCode) => {
    try {
      const response = await axios.get(`${API_URL}/${sectionCode}`, {
        headers: getAuthHeader(),
      });
      return response.data; // Returns the full Lab Entity
    } catch (error) {
      console.error("Failed to get class members:", error.response?.data || error.message);
      throw error;
    }
  },

// Gets all Sections for a Teacher
  getAllSectionsByTeacherId: async (teacherId) => {
    try {
      const response = await axios.get(`${API_URL}/getAll`, {
        headers: getAuthHeader(),
      });
      
      const allLabs = response.data || [];
      
      return allLabs;
      
    } catch (error) {
      console.error("Failed to get teacher sections:", error.response?.data || error.message);
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
      console.error("Failed to delete lab:", error.response?.data || error.message);
      throw error;
    }
  },

};

export default SectionService;