import axios from "axios";

<<<<<<< HEAD
<<<<<<< HEAD
const API_URL = "https://elementopia.onrender.com/api/lesson-completion";
// const API_URL = "http://localhost:8080/api/lesson-completion";
 
=======
// const API_URL = "https://elementopia.onrender.com/api/lesson-completion";
const API_URL = "http://localhost:8080/api/lesson-completion";
>>>>>>> 4bfa4e84b82433430b7e9332cc8c4a74c0004d7d

const getAuthHeader = () => {
  const userStr =
    sessionStorage.getItem("user") || localStorage.getItem("user");

  if (userStr) {
    try {
      const userObj = JSON.parse(userStr);
      const token =
        userObj.token || (typeof userObj === "string" ? userObj : null);

      if (token) {
        return {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        };
      }
    } catch (e) {
      console.warn("Error parsing user token for LessonCompletionService:", e);
    }
=======
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
>>>>>>> da630a33ee0bc17957d9c32073f216188f169921
  }
  return {};
};

const LessonCompletionService = {
<<<<<<< HEAD
  // Complete a lesson (POST /complete)
  completeLesson: async (studentId, lessonId) => {
    try {
      const completionData = { studentId, lessonId };

=======

  completeLesson: async (userId, lessonId) => {
    console.log(`LessonCompletionService: completeLesson called with userId=${userId}, lessonId=${lessonId}`);
    try {

      const completionData = { userId, lessonId };
>>>>>>> da630a33ee0bc17957d9c32073f216188f169921
      const response = await axios.post(
        `${API_URL}/complete`,
        completionData,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to complete lesson:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getUserCompletions: async (userId) => {
    try {
<<<<<<< HEAD
      const response = await axios.get(
        `${API_URL}/user/${studentId}`,
        getAuthHeader()
      );
=======
      const response = await axios.get(`${API_URL}/user/${userId}`, getAuthHeader());
>>>>>>> da630a33ee0bc17957d9c32073f216188f169921
      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch user completions:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  deleteCompletion: async (id) => {
    try {
      const response = await axios.delete(
        `${API_URL}/delete/${id}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      console.error(
        "Failed to delete completion:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};

export default LessonCompletionService;
