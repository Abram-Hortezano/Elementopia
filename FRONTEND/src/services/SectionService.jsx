import axios from "axios";

<<<<<<< HEAD
const API_URL = "https://elementopia.onrender.com/api/section";
// const API_URL = "http://localhost:8080/api/section";

=======
// const API_URL = "https://elementopia.onrender.com/api/section";
const API_URL = "http://localhost:8080/api/section";
>>>>>>> b16b07a6e52f982e4721b7f14ddee6a0b2fc3269

const getAuthHeader = () => {
  let token = localStorage.getItem("token");

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
  // Create Section
  createSection: async (data) => {
    try {
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
      console.error("Failed to create section:", error);
      throw error;
    }
  },
  // Join Section
  joinSection: async (sectionCode, studentId) => {
    try {
      const response = await axios.post(
        `${API_URL}/join`,
        {
          sectionCode: sectionCode,
          studentId: studentId,
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

  // Get Class Members
  getClassMembers: async (sectionCode) => {
    try {
      const response = await axios.get(`${API_URL}/getClassMembers`, {
        params: { code: sectionCode },
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to fetch class members:", error);
      throw error;
    }
  },

  // Get Teacher ID
  getTeacherId: async () => {
    try {
<<<<<<< HEAD

      const response = await axios.get(`https://elementopia.onrender.com/api/teacher/me`, {
=======
      const response = await axios.get(`http://localhost:8080/api/teacher/me`, {
>>>>>>> b16b07a6e52f982e4721b7f14ddee6a0b2fc3269
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get teacher info:", error);
      throw error;
    }
  },

  // Get Teacher Sections
  getAllSectionsByTeacherId: async (teacherId) => {
    try {
      const response = await axios.get(`${API_URL}/teacher/${teacherId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to get teacher sections:", error);
      throw error;
    }
  },

  // Get Student Sections
  getSectionsByStudentId: async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/student/${studentId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.warn(error);
      return [];
    }
  },

  deleteLab: async (labId) => {
    try {
      const response = await axios.delete(`${API_URL}/${labId}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Failed to delete lab:", error);
      throw error;
    }
  },
};

export default SectionService;
