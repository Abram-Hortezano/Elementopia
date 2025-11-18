import React, { useState, useEffect } from 'react';
import '../../assets/css/StudentList.css';

const StudentList = ({ room, onBack, onClose }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);

  // Sample student data - replace with actual API call
  const sampleStudents = [
    {
      id: 1,
      studentId: 'STU001',
      name: 'John Doe',
      email: 'john.doe@student.edu',
      progress: 75,
      score: 85,
      status: 'Active',
      lastActivity: '2024-01-15',
      joinDate: '2024-01-01'
    },
    {
      id: 2,
      studentId: 'STU002',
      name: 'Jane Smith',
      email: 'jane.smith@student.edu',
      progress: 90,
      score: 92,
      status: 'Active',
      lastActivity: '2024-01-14',
      joinDate: '2024-01-01'
    },
    {
      id: 3,
      studentId: 'STU003',
      name: 'Mike Johnson',
      email: 'mike.johnson@student.edu',
      progress: 60,
      score: 72,
      status: 'Active',
      lastActivity: '2024-01-13',
      joinDate: '2024-01-02'
    },
    {
      id: 4,
      studentId: 'STU004',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@student.edu',
      progress: 45,
      score: 68,
      status: 'Inactive',
      lastActivity: '2024-01-10',
      joinDate: '2024-01-01'
    },
    {
      id: 5,
      studentId: 'STU005',
      name: 'David Brown',
      email: 'david.brown@student.edu',
      progress: 85,
      score: 88,
      status: 'Active',
      lastActivity: '2024-01-15',
      joinDate: '2024-01-03'
    }
  ];

  useEffect(() => {
    // Simulate API call to fetch students for this room
    setTimeout(() => {
      setStudents(sampleStudents);
      setLoading(false);
    }, 1000);
  }, [room]);

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

  const handleViewProgress = (student) => {
    console.log('View progress for:', student);
    setActiveDropdown(null);
    // Navigate to detailed progress page or show modal
  };

  const handleSendMessage = (student) => {
    console.log('Send message to:', student);
    setActiveDropdown(null);
    // Open message modal or redirect to messaging
  };

  const handleRemoveStudent = (student) => {
    setActiveDropdown(null);
    if (window.confirm(`Are you sure you want to remove ${student.name} from this laboratory?`)) {
      console.log('Remove student:', student);
      setStudents(students.filter(s => s.id !== student.id));
    }
  };

  const handleViewProfile = (student) => {
    console.log('View profile:', student);
    setActiveDropdown(null);
    // Navigate to student profile
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
    const isLastRow = studentId === students[students.length - 1]?.id;
    return isLastRow ? 'bottom' : 'top';
  };

  if (loading) {
    return (
      <div className="student-list-container">
        <div className="loading">Loading students...</div>
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
            <h2>{room.className} - Students</h2>
            <p>Room Code: <span className="room-code-badge">{room.roomCode}</span></p>
          </div>
        </div>
        <div className="header-right">
          <span className="student-count">Total Students: {students.length}</span>
          <button className="btn-secondary" onClick={() => console.log('Export data')}>
            Export Data
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="students-table">
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Student Name</th>
              <th>Email</th>
              <th>Progress</th>
              <th>Score</th>
              <th>Status</th>
              <th>Last Activity</th>
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
                    <div className="join-date">Joined: {student.joinDate}</div>
                  </div>
                </td>
                <td>
                  <span className="student-email">{student.email}</span>
                </td>
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
                  <span className={`score ${student.score >= 80 ? 'score-high' : student.score >= 60 ? 'score-medium' : 'score-low'}`}>
                    {student.score}
                  </span>
                </td>
                <td>
                  {getStatusBadge(student.status)}
                </td>
                <td>
                  <span className="last-activity">{student.lastActivity}</span>
                </td>
                <td>
                  <div className="dropdown-container">
                    <button 
                      className="dropdown-trigger"
                      onClick={(e) => toggleDropdown(student.id, e)}
                      title="Actions"
                    >
                      ⋮
                    </button>
                    
                    {activeDropdown === student.id && (
                      <div className={`dropdown-menu ${getDropdownPosition(student.id)}`}>
                        <button 
                          className="dropdown-item view"
                          onClick={() => handleViewProfile(student)}
                        >
                          <span className="icon">👤</span>
                          View Profile
                        </button>
                        <button 
                          className="dropdown-item progress"
                          onClick={() => handleViewProgress(student)}
                        >
                          <span className="icon">📊</span>
                          View Progress
                        </button>
                        <button 
                          className="dropdown-item message"
                          onClick={() => handleSendMessage(student)}
                        >
                          <span className="icon">✉️</span>
                          Send Message
                        </button>
                        <button 
                          className="dropdown-item remove"
                          onClick={() => handleRemoveStudent(student)}
                        >
                          <span className="icon">🚫</span>
                          Remove Student
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
            No students found in this laboratory.
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentList;