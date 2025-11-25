import React, { useState, useEffect } from 'react';
import '../../assets/css/StudentList.css'; // Ensure you have this CSS file
import SectionService from '../../services/SectionService'; // Import the service

const StudentList = ({ room, onBack, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    if (room?.roomCode) {
      fetchStudents();
    }
  }, [room]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError("");

      // 1. Fetch the Lab details (which includes the student list)
      // Uses the endpoint: GET /api/labs/{labCode}
      const labData = await SectionService.getClassMembers(room.roomCode);

      // 2. Extract and Map Students
      // Backend returns: { ..., students: [ {userId, firstName, lastName, email, ...} ] }
      const rawStudents = labData.students || [];

      const formattedStudents = rawStudents.map((s) => ({
        id: s.userId || s.id,
        studentId: `STU${(s.userId || s.id).toString().padStart(3, '0')}`, // Generate a display ID
        name: `${s.firstName} ${s.lastName}`,
        email: s.email,
        progress: 0, // Placeholder: Backend doesn't send this yet
        score: 0,    // Placeholder: Backend doesn't send this yet
        status: 'Active',
        lastActivity: 'N/A',
        joinDate: 'N/A' // Timestamp usually not sent in simple UserEntity
      }));

      setStudents(formattedStudents);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      setError("Could not load student list. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- UI HANDLERS (Same as your template) ---

  // Close dropdown when clicking outside
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
    console.log('View profile:', student);
    setActiveDropdown(null);
    alert(`Viewing profile for ${student.name}`);
  };

  const handleRemoveStudent = async (student) => {
    setActiveDropdown(null);
    if (window.confirm(`Are you sure you want to remove ${student.name}?`)) {
       // Note: Your backend needs a specific 'removeStudent' endpoint to do this real-time.
       // For now, we just update the UI.
       setStudents(prev => prev.filter(s => s.id !== student.id));
    }
  };

  const getProgressBarClass = (progress) => {
    if (progress >= 80) return 'progress-high';
    if (progress >= 60) return 'progress-medium';
    return 'progress-low';
  };

  const getStatusBadge = (status) => {
    const statusClass = status === 'Active' ? 'status-active' : 'status-inactive';
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const getDropdownPosition = (studentId) => {
    const index = students.findIndex(s => s.id === studentId);
    const isLastRow = index >= students.length - 2;
    return isLastRow ? 'bottom' : 'top';
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
              {/* <th>Progress</th> */} 
              {/* <th>Score</th> */}
              {/* Commented out Progress/Score until backend supports it to avoid confusion */}
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => (
              <tr key={student.id}>
                <td>
                  <span className="student-id">{student.studentId}</span>
                </td>
                <td>
                  <div className="student-info">
                    <div className="student-name">{student.name}</div>
                  </div>
                </td>
                <td>
                  <span className="student-email">{student.email}</span>
                </td>
                
                {/* Placeholder Columns for Future Use
                <td>
                  <div className="progress-container">
                    <div className="progress-bar">
                      <div 
                        className={`progress-fill ${getProgressBarClass(student.progress)}`}
                        style={{ width: `${student.progress}%` }}
                      ></div>
                    </div>
                    <span className="progress-text">{student.progress}%</span>
                  </div>
                </td>
                <td>
                  <span className={`score`}>
                    {student.score}
                  </span>
                </td>
                */}

                <td>
                  {getStatusBadge(student.status)}
                </td>
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