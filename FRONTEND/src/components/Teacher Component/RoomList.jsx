import React, { useState, useEffect } from "react";
import "../../assets/css/RoomList.css";
import CreateLaboratory from "./create-lab";
import StudentList from "./StudentList";
import SectionService from "../../services/SectionService";
import UserService from "../../services/UserService";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [teacherId, setTeacherId] = useState(null);

  useEffect(() => {
    fetchRooms();
  }, []);

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

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const user = await UserService.getCurrentUser();
      const teacher = await SectionService.getTeacherId();
      setTeacherId(teacher.teacherId);

      // Assuming this returns the list of LabEntities
      const labs = await SectionService.getAllSectionsByTeacherId(
        teacher.teacherId
      );

      const formattedRooms = labs.map((lab) => ({
        id: lab.Id,
        className: lab.sectionName,
        roomCode: lab.sectionCode,
        studentCount: lab.students ? lab.students.length : 0,
        instructor: `${user.firstName} ${user.lastName}`,
        status: "Active",
      }));

      setRooms(formattedRooms);
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (room) => {
    setActiveDropdown(null);
    setSelectedRoom(room);
  };

  const handleEdit = (room) => {
    setActiveDropdown(null);
    alert("Edit feature coming soon!");
  };

  const handleDelete = async (room) => {
    setActiveDropdown(null);
    if (window.confirm(`Are you sure you want to delete ${room.className}?`)) {
      try {
        await SectionService.deleteLab(room.id);
        setRooms(rooms.filter((r) => r.id !== room.id));
      } catch (error) {
        console.error("Failed to delete room:", error);
        alert("Failed to delete room. Please try again.");
      }
    }
  };

  const toggleDropdown = (roomId, event) => {
    event.stopPropagation();
    setActiveDropdown(activeDropdown === roomId ? null : roomId);
  };

  const handleAddNewRoom = () => {
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
  };

  const handleCreateRoom = (newLabData) => {
    fetchRooms();
    setShowCreateModal(false);
  };

  const handleBackToList = () => {
    setSelectedRoom(null);
    // Refresh list in case student counts changed
    fetchRooms();
  };

  const getStatusBadge = (status) => {
    const statusClass =
      status === "Active" ? "status-active" : "status-inactive";
    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const getDropdownPosition = (roomId) => {
    const index = rooms.findIndex((r) => r.id === roomId);
    const isLastRow = index >= rooms.length - 2;
    return isLastRow ? "bottom" : "top";
  };

  if (loading) {
    return (
      <div className="loading" style={{ color: "white", padding: "20px" }}>
        Loading rooms...
      </div>
    );
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
            <h2>My Sections</h2>
            <button className="btn-primary" onClick={handleAddNewRoom}>
              Add New Section
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
                {rooms.map((room) => (
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
                      {/* 🟢 UPDATED: This will now show the correct count */}
                      <span className="student-count">{room.studentCount}</span>
                    </td>
                    <td>{getStatusBadge(room.status)}</td>
                    <td>
                      <div className="dropdown-container">
                        <button
                          className="dropdown-trigger"
                          onClick={(e) => toggleDropdown(room.id, e)}
                        >
                          ⋮
                        </button>

                        {activeDropdown === room.id && (
                          <div
                            className={`dropdown-menu ${getDropdownPosition(
                              room.id
                            )}`}
                          >
                            <button
                              className="dropdown-item view"
                              onClick={() => handleView(room)}
                            >
                              <span className="icon">👁️</span> View Students
                            </button>
                            <button
                              className="dropdown-item edit"
                              onClick={() => handleEdit(room)}
                            >
                              <span className="icon">✏️</span> Edit Room
                            </button>
                            <button
                              className="dropdown-item delete"
                              onClick={() => handleDelete(room)}
                            >
                              <span className="icon">🗑️</span> Delete Room
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
                No sections found. Create your first section!
              </div>
            )}
          </div>
        </>
      )}

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
