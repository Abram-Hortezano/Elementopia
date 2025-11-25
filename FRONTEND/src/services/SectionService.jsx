import axios from "axios";

const API_URL = "http://localhost:8080/api/section";
// const API_URL = "https://elementopia.onrender.com/api/lessons";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found!");
    throw new Error("Authorization token is missing.");
  }
  console.log("Using token:", token);
  return { Authorization: `Bearer ${token}` };
};

const SectionService = {
  createSection: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/create`, data, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to create section",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  //   sample usage:
  //     await SectionService.createSection({
  //         sectionName: sectionName,
  //         sectionCode: inputCode,
  //         teacherId:  teacherId,
  //     });

  joinSection: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/join`, data, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to join section",
        error.response?.data || error.message
      );
      throw error;
    }
  },
  //   sample usage:
  //     await SectionService.joinSection({
  //         studentId: studentId,
  //         sectionCode: inputCode,
  //     });

  getClassMembers: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/getClassMembers`, data, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to get class members",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getAllSectionsByTeacherId: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/getClassMembers`, data, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error(
        "Failed to get all sections handled by this teacher",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
