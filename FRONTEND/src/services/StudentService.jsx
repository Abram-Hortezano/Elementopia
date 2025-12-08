import axios from "axios";

const API_URL = "http://localhost:8080/api/student";
//const API_URL = "https://elementopia.onrender.com/api/student";

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
      console.warn("Error parsing user token for StudentService:", e);
    }
  }
  return {
    headers: {
      "Content-Type": "application/json",
    }
  };
};

const StudentService = {
  
  /**
   * Get all students
   * @returns {Promise<Array>} List of student objects
   */
  getAllStudents: async () => {
    try {
      const response = await axios.get(`${API_URL}/getAll`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Failed to fetch students:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get a specific student by ID
   * @param {number} studentId - Student's ID
   * @returns {Promise<Object>} Student object
   */
  getStudentById: async (studentId) => {
    try {
      const response = await axios.get(`${API_URL}/${studentId}`, getAuthHeader());
      return response.data;
    } catch (error) {
      console.error("Failed to fetch student:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Get student by user ID
   * @param {number} userId - User's ID
   * @returns {Promise<Object>} Student object
   */
  getStudentByUserId: async (userId) => {
    try {
      const allStudents = await StudentService.getAllStudents();
      // Find student by userId in the array
      const student = allStudents.find(s => s.userId === userId);
      return student || null;
    } catch (error) {
      console.error("Failed to fetch student by userId:", error);
      throw error;
    }
  },

  /**
   * Assign student role to a user
   * @param {number} userId - User's ID to assign as student
   * @returns {Promise<Object>} Created student object
   */
  assignStudentRole: async (userId) => {
    try {
      const response = await axios.post(
        `${API_URL}/assign/${userId}`,
        {},
        getAuthHeader()
      );
      console.log(`✅ Assigned student role to user ${userId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to assign student role:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Delete a student
   * @param {number} studentId - Student's ID to delete
   * @returns {Promise<Object>} Success message
   */
  deleteStudent: async (studentId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/delete/${studentId}`,
        getAuthHeader()
      );
      console.log(`🗑️ Deleted student ${studentId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to delete student:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Create or get student record for a user
   * @param {number} userId - User's ID
   * @param {Object} studentData - Optional student data
   * @returns {Promise<Object>} Student object
   */
  createOrGetStudent: async (userId, studentData = {}) => {
    try {
      // First try to get existing student by userId
      const existingStudent = await StudentService.getStudentByUserId(userId);
      if (existingStudent) {
        console.log("Student already exists for user:", userId);
        return existingStudent;
      }

      // If no existing student, try to assign student role
      try {
        return await StudentService.assignStudentRole(userId);
      } catch (assignError) {
        console.warn("Failed to assign student role, trying to find in all students:", assignError);
        
        // Fallback: Check all students again with more flexible matching
        const allStudents = await StudentService.getAllStudents();
        const foundStudent = allStudents.find(s => 
          s.userId === userId || 
          s.user?.userId === userId ||
          s.user?.id === userId
        );
        
        if (foundStudent) {
          return foundStudent;
        }
        
        throw new Error(`No student found for user ${userId} and cannot create one`);
      }
    } catch (error) {
      console.error("Failed to create or get student:", error);
      throw error;
    }
  },

  /**
   * Get students with scores by combining StudentService and ScoreService
   * @param {import('./ScoreService')} scoreService - ScoreService instance
   * @returns {Promise<Array>} List of students with their scores
   */
  getStudentsWithScores: async (scoreService) => {
    try {
      const students = await StudentService.getAllStudents();
      const allScores = await scoreService.getAllScores();
      
      // Create a map of userId to score
      const scoreMap = {};
      allScores.forEach(score => {
        const userId = score.userId || score.user?.userId || score.user?.id;
        if (userId) {
          scoreMap[userId] = score.careerScore || score.score || 0;
        }
      });

      // Merge student data with scores
      return students.map(student => ({
        ...student,
        score: student.userId ? (scoreMap[student.userId] || 0) : 0
      }));
    } catch (error) {
      console.error("Failed to get students with scores:", error);
      throw error;
    }
  },

  /**
   * Search students by name, email, or username
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Filtered list of students
   */
  searchStudents: async (searchTerm) => {
    try {
      const students = await StudentService.getAllStudents();
      const lowerSearchTerm = searchTerm.toLowerCase();
      
      return students.filter(student => 
        (student.firstName && student.firstName.toLowerCase().includes(lowerSearchTerm)) ||
        (student.lastName && student.lastName.toLowerCase().includes(lowerSearchTerm)) ||
        (student.email && student.email.toLowerCase().includes(lowerSearchTerm)) ||
        (student.username && student.username.toLowerCase().includes(lowerSearchTerm)) ||
        (student.userId && student.userId.toString().includes(searchTerm))
      );
    } catch (error) {
      console.error("Failed to search students:", error);
      throw error;
    }
  },

  /**
   * Get students by section
   * @param {number} sectionId - Section ID
   * @returns {Promise<Array>} Students in the section
   */
  getStudentsBySection: async (sectionId) => {
    try {
      const students = await StudentService.getAllStudents();
      return students.filter(student => 
        student.section && 
        (student.section.sectionId === sectionId || student.section.id === sectionId)
      );
    } catch (error) {
      console.error("Failed to get students by section:", error);
      throw error;
    }
  }
};

export default StudentService;