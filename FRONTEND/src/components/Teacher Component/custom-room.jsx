import { useState } from "react";
import { Users, BookOpen, Plus, Search, Beaker, Edit, Trash, Globe, Lock, X } from "lucide-react";
import CreateLaboratory from "./create-lab";
import "../../assets/css/custom-room.css";

export default function CustomRoomView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [createLabModalOpen, setCreateLabModalOpen] = useState(false); // This controls the modal visibility
  const [myLabsModalOpen, setMyLabsModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Mock data for public laboratories
  const publicLaboratories = [
    {
      id: 1,
      name: "Chemistry 101 Lab",
      creator: "Prof. Johnson",
      students: 24,
      experiments: 8,
      isPublic: true,
    },
    {
      id: 2,
      name: "Advanced Organic Chemistry Lab",
      creator: "Dr. Smith",
      students: 18,
      experiments: 12,
      isPublic: true,
    },
    {
      id: 3,
      name: "Biochemistry Fundamentals Lab",
      creator: "Prof. Williams",
      students: 22,
      experiments: 6,
      isPublic: true,
    },
    {
      id: 4,
      name: "Inorganic Chemistry Lab",
      creator: "Dr. Brown",
      students: 15,
      experiments: 10,
      isPublic: true,
    },
  ];

  // Mock data for user's laboratories
  const myLaboratories = [
    {
      id: 101,
      name: "My Chemistry Class",
      students: 20,
      experiments: 5,
      isPublic: false,
    },
    {
      id: 102,
      name: "Chemistry Club",
      students: 12,
      experiments: 3,
      isPublic: true,
    },
  ];

  const filteredPublicLabs = searchQuery
    ? publicLaboratories.filter(
        (lab) =>
          lab.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lab.creator.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : publicLaboratories;

  const handleCreateLab = (data) => {
    console.log("Laboratory created:", data);
    // Send this data to your backend
    // Then redirect to the laboratory details page
    // router.push(`/dashboard/laboratory/${Date.now()}`); // Uncomment if using routing
  };

  const handleJoinLab = (labId) => {
    // Join the laboratory
    // router.push(`/dashboard/laboratory/${labId}`); // Uncomment if using routing
  };

  return (
    <div className="custom-room-container">
      <div className="custom-room-header">
        <div className="custom-room-title-container">
          <h1 className="custom-room-title">Custom Laboratories</h1>
          <p className="custom-room-subtitle">Explore and join public laboratories or create your own</p>
        </div>
        <div className="custom-room-actions">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search laboratories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={() => setCreateLabModalOpen(prevState => !prevState)} className="create-lab-button">
            <Plus className="button-icon" /> Create Laboratory
          </button>
          <button onClick={() => setMyLabsModalOpen(true)} className="my-labs-button">
            My Laboratories
          </button>
        </div>
      </div>

      {/* Create Laboratory Modal */}
      {createLabModalOpen && (
        <CreateLaboratory
          isOpen={createLabModalOpen}
          onClose={() => setCreateLabModalOpen(false)}
          onSubmit={handleCreateLab}
        />
      )}

      {/* Summary Cards */}
      <div className="summary-cards">
        {/* Card 1 */}
        <div className="summary-card">
          <div className="card-content">
            <div>
              <p className="card-label">Public Laboratories</p>
              <p className="card-value">{publicLaboratories.length}</p>
            </div>
            <Globe className="card-icon purple-icon" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="summary-card my-labs-card">
          <div className="card-content">
            <div>
              <p className="card-label">My Laboratories</p>
              <p className="card-value">{myLaboratories.length}</p>
            </div>
            <Beaker className="card-icon pink-icon" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="summary-card">
          <div className="card-content">
            <div>
              <p className="card-label">Total Experiments</p>
              <p className="card-value">
                {publicLaboratories.reduce((sum, lab) => sum + lab.experiments, 0)}
              </p>
            </div>
            <BookOpen className="card-icon yellow-icon" />
          </div>
        </div>
      </div>

      {/* Public Laboratories */}
      <div className="labs-container">
        <div className="labs-header">
          <h2 className="labs-title">Public Laboratories</h2>
          <p className="labs-subtitle">Browse and join public laboratories created by teachers</p>
        </div>
        <div className="labs-content">
          <div className="labs-list">
            {filteredPublicLabs.map((lab) => (
              <div key={lab.id} className="lab-card">
                <div className="lab-card-content">
                  <div className="lab-info">
                    <div className="lab-icon-container">
                      <Beaker className="lab-icon" />
                    </div>
                    <div>
                      <h3 className="lab-name">{lab.name}</h3>
                      <p className="lab-creator">Created by {lab.creator}</p>
                      <div className="lab-stats">
                        <div className="lab-stat">
                          <Users className="stat-icon" />
                          <span className="stat-text">{lab.students} students</span>
                        </div>
                        <div className="lab-stat">
                          <Beaker className="stat-icon" />
                          <span className="stat-text">{lab.experiments} experiments</span>
                        </div>
                        {lab.isPublic && (
                          <div className="lab-stat">
                            <Globe className="stat-icon purple" />
                            <span className="stat-text">Public</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="lab-actions">
                    <button onClick={() => handleJoinLab(lab.id)} className="join-lab-button">
                      Join Laboratory
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredPublicLabs.length === 0 && (
              <div className="empty-state">
                <Beaker className="empty-icon" />
                <p className="empty-text">No laboratories found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* My Laboratories Modal */}
      {myLabsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">My Laboratories</h2>
                <p className="modal-subtitle">Laboratories you have created or joined</p>
              </div>
              <button onClick={() => setMyLabsModalOpen(false)} className="close-button">
                <X className="close-icon" />
              </button>
            </div>

            <div className="modal-content">
              {myLaboratories.length > 0 ? (
                <div className="my-labs-list">
                  {myLaboratories.map((lab) => (
                    <div key={lab.id} className="my-lab-card">
                      <div className="my-lab-content">
                        <div className="lab-info">
                          <div className="lab-icon-container">
                            <Beaker className="lab-icon" />
                          </div>
                          <div>
                            <div className="lab-name-container">
                              <h3 className="lab-name">{lab.name}</h3>
                              {lab.isPublic ? (
                                <Globe className="visibility-icon purple" />
                              ) : (
                                <Lock className="visibility-icon pink" />
                              )}
                            </div>
                            <div className="lab-stats">
                              <div className="lab-stat">
                                <Users className="stat-icon" />
                                <span className="stat-text">{lab.students} students</span>
                              </div>
                              <div className="lab-stat">
                                <Beaker className="stat-icon" />
                                <span className="stat-text">{lab.experiments} experiments</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="my-lab-actions">
                          <button
                            onClick={() => {
                              setMyLabsModalOpen(false);
                              router.push(`/dashboard/laboratory/${lab.id}`);
                            }}
                            className="manage-button"
                          >
                            <Edit className="button-icon" /> Manage
                          </button>
                          <button className="delete-button">
                            <Trash className="button-icon" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <Beaker className="empty-icon" />
                  <p className="empty-text">You haven't created any laboratories yet</p>
                </div>
              )}
            </div>

            <div className="modal-footer">
              <button
                onClick={() => {
                  setMyLabsModalOpen(false);
                  setCreateLabModalOpen(true);
                }}
                className="create-lab-button"
              >
                <Plus className="button-icon" /> Create Laboratory
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
