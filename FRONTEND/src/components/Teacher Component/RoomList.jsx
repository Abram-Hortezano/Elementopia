import React, { useState, useEffect } from 'react';
import '../../assets/css/RoomList.css'; 
import CreateLaboratory from './create-lab';
import StudentList from './StudentList';

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Sample data - replace with actual API call
  const sampleRooms = [
    { 
      id: 1, 
      className: 'Mathematics 101', 
      roomCode: 'MATH101', 
      studentCount: 30,
      instructor: 'Dr. Smith',
      status: 'Active'
    },
    { 
      id: 2, 
      className: 'Science 201', 
      roomCode: 'SCI201', 
      studentCount: 25,
      instructor: 'Prof. Johnson',
      status: 'Active'
    },
    { 
      id: 3, 
      className: 'English 301', 
      roomCode: 'ENG301', 
      studentCount: 28,
      instructor: 'Dr. Williams',
      status: 'Inactive'
    },
    { 
      id: 4, 
      className: 'History 150', 
      roomCode: 'HIST150', 
      studentCount: 35,
      instructor: 'Prof. Brown',
      status: 'Active'
    },
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRooms(sampleRooms);
      setLoading(false);
    }, 1000);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any dropdown
      if (!event.target.closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Action handlers
  const handleView = (room) => {
    console.log('View room:', room);
    setActiveDropdown(null);
    setSelectedRoom(room);
  };

  const handleEdit = (room) => {
    console.log('Edit room:', room);
    setActiveDropdown(null);
    // Open edit modal or form
  };

  const handleDelete = (room) => {
    setActiveDropdown(null);
    if (window.confirm(`Are you sure you want to delete ${room.className}?`)) {
      console.log('Delete room:', room);
      // API call to delete room
      setRooms(rooms.filter(r => r.id !== room.id));
    }
  };

  const toggleDropdown = (roomId, event) => {
    event.stopPropagation(); // Prevent event bubbling
    setActiveDropdown(activeDropdown === roomId ? null : roomId);
  };

  const handleAddNewRoom = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateRoom = (newRoomData) => {
    console.log('New room data:', newRoomData);
    // Here you would typically make an API call to create the room
    // For now, we'll add it to the local state
    const newRoom = {
      id: rooms.length + 1,
      className: newRoomData.laboratoryName,
      roomCode: newRoomData.labCode,
      studentCount: newRoomData.studentIds ? newRoomData.studentIds.length : 0,
      instructor: 'You', // Since you're the creator
      status: 'Active'
    };
    setRooms([...rooms, newRoom]);
    setShowCreateModal(false);
  };

  const handleBackToList = () => {
    setSelectedRoom(null);
  };

  const getStatusBadge = (status) => {
    const statusClass = status === 'Active' ? 'status-active' : 'status-inactive';
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const getDropdownPosition = (roomId) => {
    const isLastRow = roomId === rooms[rooms.length - 1]?.id;
    return isLastRow ? 'bottom' : 'top';
  };

  if (loading) {
    return <div className="loading">Loading rooms...</div>;
  }

  return (
    <div className="room-list-container">
      {selectedRoom ? (
        <StudentList 
          room={selectedRoom} 
          onBack={handleBackToList}
          onClose={handleBackToList}
        />
      ) : (
        <>
          <div className="room-list-header">
            <h2>Laboratory</h2>
            <button className="btn-primary" onClick={handleAddNewRoom}>
              Add New Room
            </button>
          </div>

          <div className="table-container">
            <table className="rooms-table">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Room Code</th>
                  <th>Instructor</th>
                  <th>No. Of Students</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room.id}>
                    <td>
                      <div className="class-info">
                        <div className="class-name">{room.className}</div>
                      </div>
                    </td>
                    <td>
                      <span className="room-code">{room.roomCode}</span>
                    </td>
                    <td>
                      <span className="instructor">{room.instructor}</span>
                    </td>
                    <td>
                      <span className="student-count">{room.studentCount}</span>
                    </td>
                    <td>
                      {getStatusBadge(room.status)}
                    </td>
                    <td>
                      <div className="dropdown-container">
                        <button 
                          className="dropdown-trigger"
                          onClick={(e) => toggleDropdown(room.id, e)}
                          title="Actions"
                        >
                          ⋮
                        </button>
                        
                        {activeDropdown === room.id && (
                          <div className={`dropdown-menu ${getDropdownPosition(room.id)}`}>
                            <button 
                              className="dropdown-item view"
                              onClick={() => handleView(room)}
                            >
                              <span className="icon">👁️</span>
                              View Students
                            </button>
                            <button 
                              className="dropdown-item edit"
                              onClick={() => handleEdit(room)}
                            >
                              <span className="icon">✏️</span>
                              Edit Room
                            </button>
                            <button 
                              className="dropdown-item delete"
                              onClick={() => handleDelete(room)}
                            >
                              <span className="icon">🗑️</span>
                              Delete Room
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {rooms.length === 0 && (
              <div className="no-rooms">
                No rooms found. Create your first room!
              </div>
            )}
          </div>
        </>
      )}

      {/* Create Laboratory Modal */}
      {showCreateModal && (
        <CreateLaboratory 
          onClose={handleCloseModal}
          onCreate={handleCreateRoom}
        />
      )}
    </div>
  );
};

export default RoomList;