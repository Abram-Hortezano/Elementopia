import React, { useState, useEffect } from 'react';
import '../../assets/css/StudentList.css';
import SectionService from '../../services/SectionService';
import LessonService from '../../services/LessonService';
import lessonCompletionService from '../../services/lessonCompletionService';
import ScoreService from '../../services/ScoreService';

const StudentList = ({ room, onBack, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  const TOTAL_MODULES = 10;

  useEffect(() => {
    if (room?.roomCode) {
      fetchStudents();
    }
  }, [room]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch students in class
      const labData = await SectionService.getClassMembers(room.roomCode);
      const rawStudents = labData.students || [];

      // 2. Fetch lessons count
      let lessonsCount = TOTAL_MODULES;
      try {
        const lessons = await LessonService.getAllLessons();
        lessonsCount = Array.isArray(lessons) ? lessons.length : lessonsCount;
      } catch (e) {
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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = (studentId, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === studentId ? null : studentId);
  };

  const handleViewProfile = (student) => {
    setActiveDropdown(null);
    alert(`Viewing profile for ${student.name}\nScore: ${student.score}\nProgress: ${student.progress}%`);
  };

  const handleRemoveStudent = async (student) => {
    setActiveDropdown(null);
    if (window.confirm(`Remove ${student.name}?`)) {
      setStudents(prev => prev.filter(s => s.id !== student.id));
    }
  };

  const getProgressBarClass = (progress) => {
    if (progress >= 80) return "progress-high";
    if (progress >= 50) return "progress-medium";
    return "progress-low";
  };

  const getStatusBadge = (status) => {
    const statusClass = status === "Active" ? "status-active" : "status-inactive";
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const getDropdownPosition = (studentId) => {
    const index = students.findIndex(s => s.id === studentId);
    return index >= students.length - 2 ? "bottom" : "top";
  };

  if (loading) {
    return (
      <div className="student-list-container">
        <div className="loading" style={{ color: "white" }}>
          Loading students...
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
              Code: <span className="room-code-badge">{room.roomCode}</span>
            </p>
          </div>
        </div>

        <div className="header-right">
          <span className="student-count">Total Students: {students.length}</span>
          <button className="btn-secondary" onClick={fetchStudents}>Refresh</button>
        </div>
      </div>

      {error && (
        <div className="error-banner" style={{
          background: "#fca5a5",
          color: "#7f1d1d",
          padding: "10px",
          borderRadius: "5px",
          marginBottom: "15px"
        }}>
          {error}
        </div>
      )}

      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
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
            {students.map(student => (
              <tr key={student.id}>
                <td><span className="student-id">{student.studentId}</span></td>

                <td>
                  <div className="student-info">
                    <div className="student-name">{student.name}</div>
                  </div>
                </td>

                <td><span className="student-email">{student.email}</span></td>

                {/* Progress */}
                <td>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${getProgressBarClass(student.progress)}`}
                        style={{
                          width: `${student.progress}%`,
                          backgroundColor:
                            student.progress >= 80 ? "#4caf50" : "#6c5dd3"
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
                      <div className={`dropdown-menu ${getDropdownPosition(student.id)}`}>
                        <button className="dropdown-item view" onClick={() => handleViewProfile(student)}>
                          👤 Profile
                        </button>
                        <button className="dropdown-item remove" onClick={() => handleRemoveStudent(student)}>
                          🚫 Remove
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {students.length === 0 && (
          <div className="no-students">
            No students found in this section yet.
            <br />
            Share the code <strong>{room.roomCode}</strong> to invite them!
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;