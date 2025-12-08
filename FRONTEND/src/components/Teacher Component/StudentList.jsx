<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import '../../assets/css/StudentList.css';
import SectionService from '../../services/SectionService';
import LessonService from '../../services/LessonService';
import lessonCompletionService from '../../services/lessonCompletionService';
import ScoreService from '../../services/ScoreService';
<<<<<<< HEAD
=======
import UserService from '../../services/UserService';
import StudentService from '../../services/StudentService';
>>>>>>> f591f7050b89e8b55c8a5b556fcac5a858dcef76
=======
import React, { useState, useEffect } from "react";
import "../../assets/css/StudentList.css";
import SectionService from "../../services/SectionService";
import LessonService from "../../services/LessonService";
import lessonCompletionService from "../../services/lessonCompletionService";
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93

const StudentList = ({ room, onBack, onClose }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);

  const TOTAL_MODULES = 10;

  useEffect(() => {
    if (room?.sectionId || room?.roomCode) {
      fetchStudents();
    }
  }, [room]);

  useEffect(() => {
    const filtered = students.filter(student =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.userId.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
      (student.studentId && student.studentId.toString().toLowerCase().includes(searchTerm.toLowerCase())) ||
      (student.email && student.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [students, searchTerm]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

<<<<<<< HEAD
      // 1. Fetch students in class
      const labData = await SectionService.getClassMembers(room.roomCode);
      const rawStudents = labData.students || [];

      // 2. Fetch lessons count
      let lessonsCount = TOTAL_MODULES;
      try {
        const lessons = await LessonService.getAllLessons();
        lessonsCount = Array.isArray(lessons) ? lessons.length : lessonsCount;
      } catch (e) {
<<<<<<< HEAD
        console.warn("Lesson fetch failed, using default", e);
      }

      // Map students by usable ID
      const validStudents = rawStudents
        .map(s => {
          const id = s.studentId || s.userId || s.id;
          return id ? { raw: s, id } : null;
        })
        .filter(Boolean);

      // Debug: Show student IDs
      console.log("Student IDs from class:", validStudents.map(v => ({ id: v.id })));

      // 3. Fetch all lesson completions
      const completionsPromises = validStudents.map(vs =>
        lessonCompletionService
          .getUserCompletions(vs.id)
          .then(data => ({ id: vs.id, completions: data || [] }))
          .catch(err => {
            console.warn(`Cannot load completions for ${vs.id}`, err);
            return { id: vs.id, completions: [] };
          })
      );

      const completionsResults = await Promise.all(completionsPromises);
      const completionsById = Object.fromEntries(
        completionsResults.map(r => [r.id, r.completions])
      );

      // 4. Fetch all scores
      let allScores = [];
      try {
        allScores = await ScoreService.getAllScores();
        console.log("All scores fetched:", allScores);
        console.log("Score object structure:", allScores[0] || "No scores");
      } catch (e) {
        console.warn("Could not fetch scores", e);
      }

      // Debug: Show all user IDs from scores
      console.log("User IDs from scores:", allScores.map(s => ({
        userId: s.userId,
        user_id: s.user_id,
        userID: s.userID,
        score: s.score,
        careerScore: s.careerScore,
        id: s.id
      })));

      // 5. Format final student list
      const formattedStudents = validStudents.map(({ raw, id }) => {
        const completions = completionsById[id] || [];
        const uniqueCompleted = new Set(
          completions.map(c => c.lessonId || c.lesson?.id)
        ).size;

        const percentage = Math.round(
          (uniqueCompleted / (lessonsCount || 1)) * 100
        );

        // Extract score from fetched score list
        const studentScores = allScores.filter(sc => {
          // Try multiple possible ID fields
          const scoreUserId = sc.userId || sc.user_id || sc.userID || sc.id;
          const isMatch = Number(scoreUserId) === Number(id);
          
          if (isMatch) {
            console.log(`Match found for student ${id}:`, sc);
          }
          
          return isMatch;
        });

        console.log(`Student ${id} matching scores:`, studentScores);

        // Calculate total points - try multiple possible score fields
        const totalPoints = studentScores.reduce((sum, sc) => {
          // Try different possible score field names
          const scoreValue = sc.score || sc.careerScore || sc.points || sc.totalScore || 0;
          return sum + Number(scoreValue);
        }, 0);

        console.log(`StudentID ${id} → Total Points: ${totalPoints}`);

        return {
          id,
          studentId: `STU${id.toString().padStart(3, "0")}`,
          name: `${raw.firstName || raw.user?.firstName || ""} ${
            raw.lastName || raw.user?.lastName || ""
          }`.trim(),
          email: raw.email || raw.user?.email || "—",
          progress: Math.min(percentage, 100),
          score: totalPoints,
          status: "Active",
          lastActivity: "N/A",
        };
      });

      // Debug: Show final student data
      console.log("Final formatted students:", formattedStudents);

      setStudents(formattedStudents);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Could not load student list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Dropdown handler
=======
      let allStudentsFromStudentService = [];
      try {
        allStudentsFromStudentService = await StudentService.getAllStudents();
      } catch (studentError) {
        allStudentsFromStudentService = [];
      }

      let allUsers = [];
      try {
        allUsers = await UserService.getAllUsers();
      } catch (userError) {
        allUsers = [];
      }

      let allScores = [];
      try {
        allScores = await ScoreService.getAllScores();
      } catch (scoreError) {
        allScores = [];
      }

      const userMap = {};
      allUsers.forEach(user => {
        const userId = user.userId || user.id;
        if (userId) {
          userMap[userId] = {
            userId: userId,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName
          };
        }
      });

      const scoreMap = {};
      allScores.forEach(score => {
        const userId = score.userId || 
                      score.user?.userId || 
                      score.user?.id || 
                      score.student?.userId ||
                      score.studentId;
        
        if (userId) {
          const numericUserId = Number(userId);
          const scoreValue = score.careerScore || score.score || score.totalScore || score.points || 0;
          scoreMap[numericUserId] = {
            value: scoreValue,
            details: score
          };
        }
      });

      const roomSectionId = room?.sectionId || room?.id;

      const matchedStudents = allStudentsFromStudentService.filter(student => {
        const studentUserId = student.userId;
        
        if (!studentUserId || !userMap[studentUserId]) {
          return false;
        }

        if (!student.section) {
          return false;
        }

        const studentSectionId = student.section.sectionId || 
                                 student.section.id || 
                                 student.section?.section?.sectionId || 
                                 student.section?.section?.id;
        
        return studentSectionId == roomSectionId;
      });

      const processedStudents = await Promise.all(
        matchedStudents.map(async (student) => {
          const userId = Number(student.userId);
          const user = userMap[userId];
          
          if (!user) {
            return null;
          }

          const scoreData = scoreMap[userId];
          const userScore = scoreData ? scoreData.value : 0;

          let completions = [];
          try {
            const completionId = student.studentId || userId;
            completions = await lessonCompletionService.getUserCompletions(completionId);
          } catch (error) {
            completions = [];
          }

          let lessonsCount = TOTAL_MODULES;
          try {
            const lessons = await LessonService.getAllLessons();
            lessonsCount = Array.isArray(lessons) ? lessons.length : lessonsCount;
          } catch {}

          const uniqueCompleted = new Set(
            completions.map(c => c.lessonId || c.lesson?.id)
          ).size;

          const percentage = Math.round((uniqueCompleted / (lessonsCount || 1)) * 100);

          const sectionId = student.section?.sectionId || student.section?.id;
          const sectionName = student.section?.className || student.section?.name || 'N/A';
          const sectionCode = student.section?.roomCode || student.section?.code || 'N/A';

          return {
            id: student.studentId || userId,
            userId: userId,
            studentId: student.studentId,
            name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 
                  user.username || 
                  `User ${userId}`,
            username: user.username,
            email: user.email,
            progress: Math.min(percentage, 100),
            score: userScore,
            completionsCount: completions.length,
            status: "Active",
            hasScore: scoreData !== undefined,
            scoreDetails: scoreData ? scoreData.details : null,
            sectionId: sectionId,
            sectionName: sectionName,
            sectionCode: sectionCode
          };
        })
      );

      const validStudents = processedStudents.filter(Boolean);
      const sortedStudents = validStudents.sort((a, b) => b.score - a.score);

      setStudents(sortedStudents);
      setFilteredStudents(sortedStudents);

    } catch (error) {
      setError(`Error: ${error.message || "Could not load student list. Please try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const refreshStudentScore = async (student) => {
    try {
      const scoreData = await ScoreService.getScore(student.userId);
      const newScore = scoreData.careerScore || scoreData.score || scoreData.totalScore || scoreData.points || 0;
      
      setStudents(prev => prev.map(s => 
        s.userId === student.userId 
          ? { ...s, score: newScore, scoreDetails: scoreData, hasScore: true }
          : s
      ));
      
      setFilteredStudents(prev => prev.map(s => 
        s.userId === student.userId 
          ? { ...s, score: newScore, scoreDetails: scoreData, hasScore: true }
          : s
      ));
      
      return newScore;
    } catch (error) {
      return null;
    }
  };

>>>>>>> f591f7050b89e8b55c8a5b556fcac5a858dcef76
=======
        console.warn(
          "Could not fetch total lessons, keeping default totalModules",
          e
        );
        lessonsCount = TOTAL_MODULES;
      }

      // 3. Fetch each student's completions in parallel and merge data
      const validStudents = rawStudents
        .map((s) => {
          const sId = s.studentId || s.userId || s.id;
          return sId ? { raw: s, id: sId } : null;
        })
        .filter(Boolean);

      // Fetch completions for all students in parallel
      const completionsPromises = validStudents.map((vs) =>
        lessonCompletionService
          .getUserCompletions(vs.id)
          .then((data) => ({ id: vs.id, completions: data || [] }))
          .catch((err) => {
            console.warn(
              `Could not load completions for student ${vs.id}`,
              err
            );
            return { id: vs.id, completions: [] };
          })
      );

      const completionsResults = await Promise.all(completionsPromises);
      const completionsById = Object.fromEntries(
        completionsResults.map((r) => [r.id, r.completions])
      );

      // Fetch all scores once to compute total points per student (optional)
      let allScores = [];
      try {
        allScores = await LessonService.getAllScores();
      } catch (e) {
        console.warn("Could not fetch lesson scores for students", e);
      }

      const formattedStudents = validStudents.map(({ raw, id: sId }) => {
        const studentCompletions = completionsById[sId] || [];

        // Unique lesson IDs completed for this student
        const uniqueCompleted = new Set(
          studentCompletions.map((c) => c.lessonId || c.lesson?.id)
        ).size;
        const denominator = lessonsCount || 1;
        const percentage = Math.round((uniqueCompleted / denominator) * 100);

        // Total points from the pre-fetched scores
        const studentScores = allScores.filter(
          (score) =>
            score.student?.studentId === sId || score.student?.id === sId
        );
        const totalPoints = studentScores.reduce(
          (sum, sc) => sum + (sc.score || 0),
          0
        );

        return {
          id: sId,
          studentId: `STU${sId.toString().padStart(3, "0")}`,
          name: `${raw.firstName || raw.user?.firstName || ""} ${
            raw.lastName || raw.user?.lastName || ""
          }`.trim(),
          email: raw.email || raw.user?.email || "—",
          progress: Math.min(percentage, 100),
          score: totalPoints,
          status: "Active",
          lastActivity: "N/A",
        };
      });

      setStudents(formattedStudents);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Could not load student list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- UI HANDLERS ---
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };
<<<<<<< HEAD

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
=======
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
  }, []);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const toggleDropdown = (studentId, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === studentId ? null : studentId);
  };

  const handleViewProfile = (student) => {
    setActiveDropdown(null);
<<<<<<< HEAD
    alert(`Student Profile\n\nName: ${student.name}\nUser ID: ${student.userId}\nStudent ID: ${student.studentId || 'N/A'}\nEmail: ${student.email || 'N/A'}\nSection: ${student.sectionName}\nSection ID: ${student.sectionId || 'N/A'}\nProgress: ${student.progress}%\nScore: ${student.score}\nCompleted Lessons: ${student.completionsCount || 0}\nHas Score Record: ${student.hasScore ? 'Yes' : 'No'}`);
  };

  const handleRefreshScore = async (student) => {
    setActiveDropdown(null);
    try {
      const newScore = await refreshStudentScore(student);
      if (newScore !== null) {
        alert(`✅ Score refreshed for ${student.name}\nNew Score: ${newScore}`);
      } else {
        alert(`❌ Could not refresh score for ${student.name}\nStudent may not have a score record yet.`);
      }
    } catch (err) {
      alert(`❌ Error refreshing score: ${err.message}`);
    }
=======
    alert(
      `Viewing profile for ${student.name}\nScore: ${student.score}\nProgress: ${student.progress}%`
    );
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
  };

  const handleRemoveStudent = async (student) => {
    setActiveDropdown(null);
<<<<<<< HEAD
<<<<<<< HEAD
    if (window.confirm(`Remove ${student.name}?`)) {
      setStudents(prev => prev.filter(s => s.id !== student.id));
=======
    if (window.confirm(`Are you sure you want to remove ${student.name}?\nThis action cannot be undone.`)) {
      setStudents(prev => prev.filter(s => s.id !== student.id));
      setFilteredStudents(prev => prev.filter(s => s.id !== student.id));
      alert(`${student.name} has been removed from the class.`);
>>>>>>> f591f7050b89e8b55c8a5b556fcac5a858dcef76
=======
    if (window.confirm(`Are you sure you want to remove ${student.name}?`)) {
      // Logic to remove student API call would go here
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
    }
  };

  const getProgressBarClass = (progress) => {
    if (progress >= 80) return "progress-high";
    if (progress >= 50) return "progress-medium";
    return "progress-low";
<<<<<<< HEAD
  };

  const getScoreColor = (score) => {
    if (score >= 1000) return '#10b981';
    if (score >= 500) return '#3b82f6';
    if (score >= 100) return '#f59e0b';
    return '#ef4444';
  };

  const getScoreBadge = (score) => {
    let badgeText = '';
    let badgeClass = '';
    
    if (score >= 1000) {
      badgeText = '🏆 Master';
      badgeClass = 'score-badge-master';
    } else if (score >= 500) {
      badgeText = '⭐ Advanced';
      badgeClass = 'score-badge-advanced';
    } else if (score >= 100) {
      badgeText = '📚 Learner';
      badgeClass = 'score-badge-learner';
    } else {
      badgeText = '🌱 Beginner';
      badgeClass = 'score-badge-beginner';
    }
    
    return <span className={`score-badge ${badgeClass}`}>{badgeText}</span>;
  };

  const getStatusBadge = (status) => {
    const statusClass = status === "Active" ? "status-active" : "status-inactive";
=======
  };

  const getStatusBadge = (status) => {
    const statusClass =
      status === "Active" ? "status-active" : "status-inactive";
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const getDropdownPosition = (studentId) => {
<<<<<<< HEAD
    const index = students.findIndex(s => s.id === studentId);
    return index >= students.length - 2 ? "bottom" : "top";
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="pagination-container">
        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          ← Previous
        </button>

        <div className="page-numbers">
          {startPage > 1 && (
            <>
              <button
                className={`page-number ${1 === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              {startPage > 2 && <span className="page-ellipsis">...</span>}
            </>
          )}

          {pageNumbers.map(number => (
            <button
              key={number}
              className={`page-number ${number === currentPage ? 'active' : ''}`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="page-ellipsis">...</span>}
              <button
                className={`page-number ${totalPages === currentPage ? 'active' : ''}`}
                onClick={() => handlePageChange(totalPages)}
              >
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          className="pagination-btn"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next →
        </button>
      </div>
    );
=======
    const index = students.findIndex((s) => s.id === studentId);
    return index >= students.length - 2 ? "bottom" : "top";
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
  };

  if (loading) {
    return (
      <div className="student-list-container">
<<<<<<< HEAD
<<<<<<< HEAD
        <div className="loading" style={{ color: "white" }}>
          Loading students...
=======
        <div className="loading" style={{color:'white'}}>
          <div className="loading-spinner"></div>
          Loading students and scores...
>>>>>>> f591f7050b89e8b55c8a5b556fcac5a858dcef76
=======
        <div className="loading" style={{ color: "white" }}>
          Loading students...
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
        </div>
      </div>
    );
  }

  return (
    <div className="student-list-container">
      <div className="student-list-header">
        <div className="header-left">
          <button className="back-button" onClick={onBack}>
            ← Back to Laboratories
          </button>
          <div className="room-info">
            <h2>{room.className}</h2>
            <p>
<<<<<<< HEAD
<<<<<<< HEAD
              Code: <span className="room-code-badge">{room.roomCode}</span>
=======
              {room.sectionId && (
                <>Section ID: <span className="room-id-badge">{room.sectionId}</span></>
              )}
              {room.roomCode && (
                <>Code: <span className="room-code-badge">{room.roomCode}</span></>
              )}
>>>>>>> f591f7050b89e8b55c8a5b556fcac5a858dcef76
=======
              Code: <span className="room-code-badge">{room.roomCode}</span>
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
            </p>
          </div>
        </div>

        <div className="header-right">
<<<<<<< HEAD
<<<<<<< HEAD
          <span className="student-count">Total Students: {students.length}</span>
          <button className="btn-secondary" onClick={fetchStudents}>Refresh</button>
=======
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name, ID, username, or email..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
>>>>>>> f591f7050b89e8b55c8a5b556fcac5a858dcef76
=======
          <span className="student-count">
            Total Students: {students.length}
          </span>
          <button className="btn-secondary" onClick={fetchStudents}>
            Refresh
          </button>
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
        </div>
      </div>

      {error && (
<<<<<<< HEAD
        <div className="error-banner" style={{
          background: "#fca5a5",
          color: "#7f1d1d",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "15px"
        }}>
=======
        <div
          className="error-banner"
          style={{
            background: "#fca5a5",
            color: "#7f1d1d",
            padding: "10px",
            borderRadius: "5px",
            marginBottom: "15px",
          }}
        >
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
          {error}
        </div>
      )}

      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>ID</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Progress</th>
              <th>Score</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
<<<<<<< HEAD
<<<<<<< HEAD
            {students.map(student => (
              <tr key={student.id}>
                <td><span className="student-id">{student.studentId}</span></td>

=======
            {students.map((student) => (
              <tr key={student.id}>
                <td>
                  <span className="student-id">{student.studentId}</span>
                </td>
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
                <td>
                  <div className="student-info">
                    <div className="student-name">{student.name}</div>
                  </div>
                </td>
<<<<<<< HEAD

                <td><span className="student-email">{student.email}</span></td>

                {/* Progress */}
=======
                <td>
                  <span className="student-email">{student.email}</span>
                </td>

                {/* PROGRESS BAR UI */}
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
                <td>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
<<<<<<< HEAD
                        className={`progress-fill ${getProgressBarClass(student.progress)}`}
                        style={{
                          width: `${student.progress}%`,
                          backgroundColor:
                            student.progress >= 80 ? "#4caf50" : "#6c5dd3"
=======
                        className={`progress-fill ${getProgressBarClass(
                          student.progress
                        )}`}
                        style={{
                          width: `${student.progress}%`,
                          backgroundColor:
                            student.progress >= 80 ? "#4caf50" : "#6c5dd3",
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
                        }}
                      ></div>
                    </div>
                    <span className="progress-text">{student.progress}%</span>
                  </div>
                </td>

                {/* Score */}
                <td>
                  <span className="score">{student.score}</span>
                </td>

                <td>{getStatusBadge(student.status)}</td>

                <td>
                  <div className="dropdown-container">
                    <button
                      className="dropdown-trigger"
                      onClick={(e) => toggleDropdown(student.id, e)}
                    >
                      ⋮
                    </button>

                    {activeDropdown === student.id && (
<<<<<<< HEAD
                      <div className={`dropdown-menu ${getDropdownPosition(student.id)}`}>
                        <button className="dropdown-item view" onClick={() => handleViewProfile(student)}>
                          👤 Profile
                        </button>
                        <button className="dropdown-item remove" onClick={() => handleRemoveStudent(student)}>
                          🚫 Remove
=======
                      <div
                        className={`dropdown-menu ${getDropdownPosition(
                          student.id
                        )}`}
                      >
                        <button
                          className="dropdown-item view"
                          onClick={() => handleViewProfile(student)}
                        >
                          <span className="icon">👤</span> Profile
                        </button>
                        <button
                          className="dropdown-item remove"
                          onClick={() => handleRemoveStudent(student)}
                        >
                          <span className="icon">🚫</span> Remove
>>>>>>> 42b2c412b2f21dc736a10a42dac1eb12e501ae93
                        </button>
=======
            {currentStudents.map((student, index) => {
              const rank = indexOfFirstStudent + index + 1;
              return (
                <tr key={student.id}>
                  <td>
                    <div className="rank-container">
                      {rank <= 3 ? (
                        <span className={`rank rank-${rank}`}>
                          {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
                        </span>
                      ) : (
                        <span className="rank-number">#{rank}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="id-container">
                      <span className="student-id">STU{student.studentId ? student.studentId.toString().padStart(3, '0') : 'N/A'}</span>
                    </div>
                  </td>
                  <td>
                    <div className="student-info">
                      <div className="student-name">{student.name}</div>
                    </div>
                  </td>
                  <td><span className="student-email">{student.email || '—'}</span></td>
                  
                  <td>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div 
                          className={`progress-fill ${getProgressBarClass(student.progress)}`}
                          style={{ width: `${student.progress}%` }}
                        ></div>
>>>>>>> f591f7050b89e8b55c8a5b556fcac5a858dcef76
                      </div>
                      <span className="progress-text">{student.progress}%</span>
                    </div>
                  </td>
                  
                  <td>
                    <div className="score-container">
                      <span 
                        className="score-value" 
                        style={{ color: getScoreColor(student.score), fontWeight: 'bold' }}
                      >
                        {student.score}
                      </span>
                      <span className="score-label">points</span>
                      {!student.hasScore && (
                        <span className="no-score-warning" style={{fontSize: '10px', color: '#ff9800'}}>
                          No score record
                        </span>
                      )}
                    </div>
                  </td>
                  <td>{getStatusBadge(student.status)}</td>
                  <td>
                    <div className="dropdown-container">
                      <button 
                        className="dropdown-trigger"
                        onClick={(e) => toggleDropdown(student.id, e)}
                      >
                        ⋮
                      </button>
                      {activeDropdown === student.id && (
                        <div className={`dropdown-menu ${getDropdownPosition(student.id)}`}>
                          <button className="dropdown-item view" onClick={() => handleViewProfile(student)}>
                            <span className="icon">👤</span> View Profile
                          </button>
                          <button className="dropdown-item refresh" onClick={() => handleRefreshScore(student)}>
                            <span className="icon">🔄</span> Refresh Score
                          </button>
                          <div className="dropdown-divider"></div>
                          <button className="dropdown-item remove" onClick={() => handleRemoveStudent(student)}>
                            <span className="icon">🚫</span> Remove Student
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filteredStudents.length === 0 && (
          <div className="no-students">
<<<<<<< HEAD
            No students found in this section yet.
            <br />
            Share the code <strong>{room.roomCode}</strong> to invite them!
=======
            <div className="no-students-icon">👨‍🎓</div>
            <h3>No students enrolled yet</h3>
            <p>
              {room.sectionId && (
                <>Section ID: <strong>{room.sectionId}</strong><br /></>
              )}
              Share the class code <strong className="highlight-code">{room.roomCode}</strong> with your students to invite them!
            </p>
            <button className="btn-primary" onClick={fetchStudents}>
              Check Again
            </button>
>>>>>>> f591f7050b89e8b55c8a5b556fcac5a858dcef76
          </div>
        )}

        {renderPagination()}

        <div className="pagination-info">
          Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, filteredStudents.length)} of {filteredStudents.length} students
          {filteredStudents.length > 0 && (
            <span style={{marginLeft: '20px', color: '#4caf50'}}>
              {filteredStudents.filter(s => s.hasScore).length} have score records
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
