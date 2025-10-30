import { useEffect, useState } from "react";
import "../../assets/css/custom-room.css";
import LabService from "../../services/LabService";
import { Beaker, Users, Globe } from "lucide-react"; 

export default function PublicLab() {
  const [labs, setLabs] = useState([]);

  const fetchLabs = async () => {
    try {
      const data = await LabService.getAllLab();
      setLabs(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch labs:", error);
    }
  };

  useEffect(() => {
    fetchLabs();
  }, []);

  const handleJoinLab = (labId) => {
    console.log("Joining lab:", labId);
  };

  return (
    <div className="labs-container">
      <div className="labs-header">
        <h2 className="labs-title">All Laboratories</h2>
        <p className="labs-subtitle">Browse and join laboratories created by teachers</p>
      </div>
      <div className="labs-content">
        <div className="labs-list">
          {labs.map((lab) => (
            <div key={lab.labId} className="lab-card">
              <div className="lab-card-content">
                <div className="lab-info">
                  <div className="lab-icon-container">
                    <Beaker className="lab-icon" />
                  </div>
                  <div>
                    <h3 className="lab-name">{lab.laboratoryName}</h3>
                    <p className="lab-creator">Lab Code: {lab.labCode}</p>
                    <div className="lab-stats">
                      <div className="lab-stat">
                        <Users className="stat-icon" />
                        <span className="stat-text">{lab.students?.length ?? 0} students</span>
                      </div>
                      <div className="lab-stat">
                        <Beaker className="stat-icon" />
                        <span className="stat-text">{lab.lessons?.length ?? 0} lessons</span>
                      </div>
                      <div className="lab-stat">
                        <Globe className="stat-icon purple" />
                        <span className="stat-text">Lab ID: {lab.labId}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="lab-actions">
                  <button onClick={() => handleJoinLab(lab.labId)} className="join-lab-button">
                    Join Laboratory
                  </button>
                </div>
              </div>
            </div>
          ))}
          {labs.length === 0 && (
            <div className="empty-state">
              <Beaker className="empty-icon" />
              <p className="empty-text">No laboratories found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
