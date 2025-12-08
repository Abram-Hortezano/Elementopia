import React, { useState, useEffect, useCallback } from "react";
import "../../assets/css/StudentList.css";
import LessonService from "../../services/LessonService";
import ScoreService from "../../services/ScoreService";
import StudentService from "../../services/StudentService";
import UserService from "../../services/UserService";
import lessonCompletionService from "../../services/lessonCompletionService";

const StudentList = ({ room, onBack }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [studentsPerPage] = useState(10);

  const TOTAL_MODULES = 10;

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      let allStudentsFromStudentService = [];
      try {
        allStudentsFromStudentService = await StudentService.getAllStudents();
      } catch {
        allStudentsFromStudentService = [];
      }

      let allUsers = [];
      try {
        allUsers = await UserService.getAllUsers();
      } catch {
        allUsers = [];
      }

      let allScores = [];
      try {
        allScores = await ScoreService.getAllScores();
      } catch {
        allScores = [];
      }

      const userMap = {};
      allUsers.forEach((user) => {
        const userId = user.userId || user.id;
        if (userId) {
          userMap[userId] = {
            userId: userId,
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          };
        }
      });

      const scoreMap = {};
      allScores.forEach((score) => {
        const userId =
          score.userId ||
          score.user?.userId ||
          score.user?.id ||
          score.student?.userId ||
          score.studentId;

        if (userId) {
          const numericUserId = Number(userId);
          const scoreValue =
            score.careerScore ||
            score.score ||
            score.totalScore ||
            score.points ||
            0;
          scoreMap[numericUserId] = {
            value: scoreValue,
            details: score,
          };
        }
      });

      const roomSectionId = room?.sectionId || room?.id;

      const matchedStudents = allStudentsFromStudentService.filter(
        (student) => {
          const studentUserId = student.userId;

          if (!studentUserId || !userMap[studentUserId]) {
            return false;
          }

          if (!student.section) {
            return false;
          }

          const studentSectionId =
            student.section.sectionId ||
            student.section.id ||
            student.section?.section?.sectionId ||
            student.section?.section?.id;

          return studentSectionId == roomSectionId;
        }
      );

      // Fetch completions for ALL matched students in parallel (outside the map)
      const completionsPromises = matchedStudents.map(async (student) => {
        try {
          const completionId = student.studentId || student.userId;
          const completions = await lessonCompletionService.getUserCompletions(
            completionId
          );
          return { studentId: student.studentId, completions };
        } catch {
          return { studentId: student.studentId, completions: [] };
        }
      });

      const completionsResults = await Promise.allSettled(completionsPromises);
      const completionsMap = new Map();
      completionsResults.forEach((result) => {
        if (result.status === "fulfilled") {
          completionsMap.set(result.value.studentId, result.value.completions);
        }
      });

      // Get lessons count once
      let lessonsCount = TOTAL_MODULES;
      try {
        const lessons = await LessonService.getAllLessons();
        lessonsCount = Array.isArray(lessons) ? lessons.length : lessonsCount;
      } catch {
        /* empty */
      }

      const processedStudents = matchedStudents.map((student) => {
        const userId = Number(student.userId);
        const user = userMap[userId];

        if (!user) {
          return null;
        }

        const scoreData = scoreMap[userId];
        const userScore = scoreData ? scoreData.value : 0;

        // Get completions from the map (already fetched)
        const completions = completionsMap.get(student.studentId) || [];

        const uniqueCompleted = new Set(
          completions.map((c) => c.lessonId || c.lesson?.id)
        ).size;

        const percentage = Math.round(
          (uniqueCompleted / (lessonsCount || 1)) * 100
        );

        const sectionId = student.section?.sectionId || student.section?.id;
        const sectionName =
          student.section?.className || student.section?.name || "N/A";
        const sectionCode =
          student.section?.roomCode || student.section?.code || "N/A";

        return {
          id: student.studentId || userId,
          userId: userId,
          studentId: student.studentId,
          name:
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
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
          sectionCode: sectionCode,
        };
      });

      const validStudents = processedStudents.filter(Boolean);
      const sortedStudents = validStudents.sort((a, b) => b.score - a.score);

      setStudents(sortedStudents);
      setFilteredStudents(sortedStudents);
    } catch (error) {
      setError(
        `Error: ${
          error.message || "Could not load student list. Please try again."
        }`
      );
    } finally {
      setLoading(false);
    }
  }, [room]);

  useEffect(() => {
    if (room?.sectionId || room?.roomCode) {
      fetchStudents();
    }
  }, [room, fetchStudents]);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.userId
          .toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (student.studentId &&
          student.studentId
            .toString()
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        (student.email &&
          student.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredStudents(filtered);
    setCurrentPage(1);
  }, [students, searchTerm]);

  const refreshStudentScore = async (student) => {
    try {
      const scoreData = await ScoreService.getScore(student.userId);
      const newScore =
        scoreData.careerScore ||
        scoreData.score ||
        scoreData.totalScore ||
        scoreData.points ||
        0;

      setStudents((prev) =>
        prev.map((s) =>
          s.userId === student.userId
            ? { ...s, score: newScore, scoreDetails: scoreData, hasScore: true }
            : s
        )
      );

      setFilteredStudents((prev) =>
        prev.map((s) =>
          s.userId === student.userId
            ? { ...s, score: newScore, scoreDetails: scoreData, hasScore: true }
            : s
        )
      );

      return newScore;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  const toggleDropdown = (studentId, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === studentId ? null : studentId);
  };

  const handleViewProfile = (student) => {
    setActiveDropdown(null);
    alert(
      `Student Profile\n\nName: ${student.name}\nUser ID: ${
        student.userId
      }\nStudent ID: ${student.studentId || "N/A"}\nEmail: ${
        student.email || "N/A"
      }\nSection: ${student.sectionName}\nSection ID: ${
        student.sectionId || "N/A"
      }\nProgress: ${student.progress}%\nScore: ${
        student.score
      }\nCompleted Lessons: ${
        student.completionsCount || 0
      }\nHas Score Record: ${student.hasScore ? "Yes" : "No"}`
    );
  };

  const handleRefreshScore = async (student) => {
    setActiveDropdown(null);
    try {
      const newScore = await refreshStudentScore(student);
      if (newScore !== null) {
        alert(`✅ Score refreshed for ${student.name}\nNew Score: ${newScore}`);
      } else {
        alert(
          `❌ Could not refresh score for ${student.name}\nStudent may not have a score record yet.`
        );
      }
    } catch (err) {
      alert(`❌ Error refreshing score: ${err.message}`);
    }
  };

  const handleRemoveStudent = async (student) => {
    setActiveDropdown(null);
    if (
      window.confirm(
        `Are you sure you want to remove ${student.name}?\nThis action cannot be undone.`
      )
    ) {
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
      setFilteredStudents((prev) => prev.filter((s) => s.id !== student.id));
      alert(`${student.name} has been removed from the class.`);
    }
  };

  const getProgressBarClass = (progress) => {
    if (progress >= 80) return "progress-high";
    if (progress >= 50) return "progress-medium";
    return "progress-low";
  };

  const getScoreColor = (score) => {
    if (score >= 1000) return "#10b981";
    if (score >= 500) return "#3b82f6";
    if (score >= 100) return "#f59e0b";
    return "#ef4444";
  };

  const getStatusBadge = (status) => {
    const statusClass =
      status === "Active" ? "status-active" : "status-inactive";
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const getDropdownPosition = (studentId) => {
    const index = students.findIndex((s) => s.id === studentId);
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
                className={`page-number ${1 === currentPage ? "active" : ""}`}
                onClick={() => handlePageChange(1)}
              >
                1
              </button>
              {startPage > 2 && <span className="page-ellipsis">...</span>}
            </>
          )}

          {pageNumbers.map((number) => (
            <button
              key={number}
              className={`page-number ${
                number === currentPage ? "active" : ""
              }`}
              onClick={() => handlePageChange(number)}
            >
              {number}
            </button>
          ))}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && (
                <span className="page-ellipsis">...</span>
              )}
              <button
                className={`page-number ${
                  totalPages === currentPage ? "active" : ""
                }`}
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
  };

  if (loading) {
    return (
      <div className="student-list-container">
        <div className="loading" style={{ color: "white" }}>
          <div className="loading-spinner"></div>
          Loading students and scores...
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
              {room.sectionId && (
                <>
                  Section ID:{" "}
                  <span className="room-id-badge">{room.sectionId}</span>
                </>
              )}
              {room.roomCode && (
                <>
                  Code: <span className="room-code-badge">{room.roomCode}</span>
                </>
              )}
            </p>
          </div>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search by name, ID, username, or email..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {error && (
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
            {currentStudents.map((student, index) => {
              const rank = indexOfFirstStudent + index + 1;
              return (
                <tr key={student.id}>
                  <td>
                    <div className="rank-container">
                      {rank <= 3 ? (
                        <span className={`rank rank-${rank}`}>
                          {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                        </span>
                      ) : (
                        <span className="rank-number">#{rank}</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="id-container">
                      <span className="student-id">
                        STU
                        {student.studentId
                          ? student.studentId.toString().padStart(3, "0")
                          : "N/A"}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div className="student-info">
                      <div className="student-name">{student.name}</div>
                    </div>
                  </td>
                  <td>
                    <span className="student-email">
                      {student.email || "—"}
                    </span>
                  </td>

                  <td>
                    <div className="progress-container">
                      <div className="progress-bar">
                        <div
                          className={`progress-fill ${getProgressBarClass(
                            student.progress
                          )}`}
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{student.progress}%</span>
                    </div>
                  </td>

                  <td>
                    <div className="score-container">
                      <span
                        className="score-value"
                        style={{
                          color: getScoreColor(student.score),
                          fontWeight: "bold",
                        }}
                      >
                        {student.score}
                      </span>
                      <span className="score-label">points</span>
                      {!student.hasScore && (
                        <span
                          className="no-score-warning"
                          style={{ fontSize: "10px", color: "#ff9800" }}
                        >
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
                        <div
                          className={`dropdown-menu ${getDropdownPosition(
                            student.id
                          )}`}
                        >
                          <button
                            className="dropdown-item view"
                            onClick={() => handleViewProfile(student)}
                          >
                            <span className="icon">👤</span> View Profile
                          </button>
                          <button
                            className="dropdown-item refresh"
                            onClick={() => handleRefreshScore(student)}
                          >
                            <span className="icon">🔄</span> Refresh Score
                          </button>
                          <div className="dropdown-divider"></div>
                          <button
                            className="dropdown-item remove"
                            onClick={() => handleRemoveStudent(student)}
                          >
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
            <div className="no-students-icon">👨‍🎓</div>
            <h3>No students enrolled yet</h3>
            <p>
              {room.sectionId && (
                <>
                  Section ID: <strong>{room.sectionId}</strong>
                  <br />
                </>
              )}
              Share the class code{" "}
              <strong className="highlight-code">{room.roomCode}</strong> with
              your students to invite them!
            </p>
            <button className="btn-primary" onClick={fetchStudents}>
              Check Again
            </button>
          </div>
        )}

        {renderPagination()}

        <div className="pagination-info">
          Showing {indexOfFirstStudent + 1} to{" "}
          {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
          {filteredStudents.length} students
          {filteredStudents.length > 0 && (
            <span style={{ marginLeft: "20px", color: "#4caf50" }}>
              {filteredStudents.filter((s) => s.hasScore).length} have score
              records
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentList;
