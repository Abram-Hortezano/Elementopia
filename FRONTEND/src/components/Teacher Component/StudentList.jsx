import React, { useState, useEffect } from 'react';
import '../../assets/css/StudentList.css'; 
import SectionService from '../../services/SectionService';
import LessonService from '../../services/LessonService'; // 🟢 IMPORTED for Progress

const StudentList = ({ room, onBack, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Constants
  const TOTAL_MODULES = 10; // Adjust this based on your actual lesson count

  useEffect(() => {
    if (room?.roomCode) {
      fetchStudents();
    }
  }, [room]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch Lab Details (Students)
      const labData = await SectionService.getClassMembers(room.roomCode);
      const rawStudents = labData.students || [];

      // 2. 🟢 Fetch Scores for Calculation
      let allScores = [];
      try {
        allScores = await LessonService.getAllScores();
      } catch (scoreErr) {
        console.warn("Could not fetch scores, progress will be 0", scoreErr);
      }

      // 3. Merge Data
      const formattedStudents = rawStudents.map((s) => {
        const sId = s.userId || s.id;

        // Filter scores for this student
        const studentScores = allScores.filter(score => 
           score.student?.userId === sId || score.student?.id === sId
        );

        // Calculate Progress
        const uniqueCompleted = new Set(studentScores.map(sc => sc.lessonId)).size;
        const percentage = Math.round((uniqueCompleted / TOTAL_MODULES) * 100);
        
        // Calculate Total Score (Optional sum of all points)
        const totalPoints = studentScores.reduce((sum, sc) => sum + (sc.score || 0), 0);

        return {
          id: sId,
          studentId: `STU${sId.toString().padStart(3, '0')}`,
          name: `${s.firstName} ${s.lastName}`,
          email: s.email,
          progress: Math.min(percentage, 100), // 🟢 REAL DATA
          score: totalPoints,                  // 🟢 REAL DATA
          status: 'Active',
          lastActivity: 'N/A',
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
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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
    if (window.confirm(`Are you sure you want to remove ${student.name}?`)) {
       // Logic to remove student API call would go here
       setStudents(prev => prev.filter(s => s.id !== student.id));
    }
  };

  const getProgressBarClass = (progress) => {
    if (progress >= 80) return 'progress-high'; // You need CSS for this (green)
    if (progress >= 50) return 'progress-medium'; // (yellow/orange)
    return 'progress-low'; // (red)
  };

  const getStatusBadge = (status) => {
    const statusClass = status === 'Active' ? 'status-active' : 'status-inactive';
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const getDropdownPosition = (studentId) => {
    const index = students.findIndex(s => s.id === studentId);
    return index >= students.length - 2 ? 'bottom' : 'top';
  };

  if (loading) {
    return (
      <div className="student-list-container">
        <div className="loading" style={{color:'white'}}>Loading students...</div>
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
            <p>Code: <span className="room-code-badge">{room.roomCode}</span></p>
          </div>
        </div>
        <div className="header-right">
          <span className="student-count">Total Students: {students.length}</span>
          <button className="btn-secondary" onClick={fetchStudents}>
            Refresh
          </button>
        </div>
      </div>

      {error && <div className="error-banner" style={{background:'#fca5a5', color:'#7f1d1d', padding:'10px', borderRadius:'5px', marginBottom:'15px'}}>{error}</div>}

      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Student Name</th>
              <th>Email</th>
              {/* 🟢 UNCOMMENTED COLUMNS */}
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
                
                {/* 🟢 PROGRESS BAR UI */}
                <td>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${getProgressBarClass(student.progress)}`}
                        style={{ width: `${student.progress}%`, backgroundColor: student.progress >= 80 ? '#4caf50' : '#6c5dd3' }}
                      ></div>
                    </div>
                    <span className="progress-text">{student.progress}%</span>
                  </div>
                </td>
                <td>
                  <span className={`score`}>{student.score}</span>
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
                          <span className="icon">👤</span> Profile
                        </button>
                        <button className="dropdown-item remove" onClick={() => handleRemoveStudent(student)}>
                          <span className="icon">🚫</span> Remove
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
            <br/>
            Share the code <strong>{room.roomCode}</strong> to invite them!
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;