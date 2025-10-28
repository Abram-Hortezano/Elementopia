import React, { useState } from "react";
import { Beaker, Calendar, Clock, Award } from "lucide-react";
import "../assets/css/student-progress-modal.css";

export default function StudentProgressModal({ isOpen, onClose, student }) {
  const [activeTab, setActiveTab] = useState("experiments");

  const experiments = [
    {
      id: 1,
      title: "Acid-Base Titration",
      type: "virtual-lab",
      completedDate: "2023-12-10",
      score: 85,
      timeSpent: "45 minutes",
    },
    {
      id: 2,
      title: "Periodic Table Quiz",
      type: "quiz",
      completedDate: "2023-12-05",
      score: 92,
      timeSpent: "20 minutes",
    },
    {
      id: 3,
      title: "Molecular Structure Building",
      type: "molecular-builder",
      completedDate: "2023-11-28",
      score: 78,
      timeSpent: "35 minutes",
    },
  ];

  const achievements = [
    { id: 1, name: "First Experiment", description: "Completed first experiment", date: "2023-11-25" },
    { id: 2, name: "Perfect Score", description: "Achieved 100% on a quiz", date: "2023-12-01" },
    { id: 3, name: "Quick Learner", description: "Completed 3 experiments in a week", date: "2023-12-08" },
  ];

  const overallProgress = Math.round(
    experiments.reduce((sum, exp) => sum + exp.score, 0) / (experiments.length || 1)
  );

//   if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Student Progress: {student.name}</h2>
          <p className="modal-subtitle">{student.email}</p>
        </div>

        <div className="modal-body">
          <div className="progress-section">
            <div className="progress-label">
              <span>Overall Progress</span>
              <span>{overallProgress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${overallProgress}%` }}></div>
            </div>
          </div>

          <div className="tabs-list">
            <button
              className={`tab-trigger ${activeTab === "experiments" ? "active-experiments" : ""}`}
              onClick={() => setActiveTab("experiments")}
            >
              Experiments
            </button>
            <button
              className={`tab-trigger ${activeTab === "achievements" ? "active-achievements" : ""}`}
              onClick={() => setActiveTab("achievements")}
            >
              Achievements
            </button>
          </div>

          {activeTab === "experiments" && (
            <div className="tab-content">
              <div className="experiment-list">
                {experiments.map((exp) => (
                  <div key={exp.id} className="experiment-card">
                    <div className="experiment-header">
                      <div>
                        <h3>{exp.title}</h3>
                        <div className="experiment-meta">
                          <Calendar className="icon" />
                          <span>Completed: {exp.completedDate}</span>
                          <Clock className="icon ml" />
                          <span>Time spent: {exp.timeSpent}</span>
                        </div>
                      </div>
                      <div className="score-badge">Score: {exp.score}%</div>
                    </div>
                    <div className="score-bar">
                      <div className="score-fill" style={{ width: `${exp.score}%` }}></div>
                    </div>
                  </div>
                ))}
                {experiments.length === 0 && (
                  <div className="empty-state">
                    <Beaker className="icon-lg" />
                    <p>No experiments completed yet</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="tab-content">
              <div className="achievement-grid">
                {achievements.map((ach) => (
                  <div key={ach.id} className="achievement-card">
                    <div className="achievement-icon">
                      <Award className="icon-sm" />
                    </div>
                    <div>
                      <h3>{ach.name}</h3>
                      <p className="desc">{ach.description}</p>
                      <p className="date">Earned on {ach.date}</p>
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <div className="empty-state">
                    <Award className="icon-lg" />
                    <p>No achievements earned yet</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="close-btn">Close</button>
        </div>
      </div>
    </div>
  );
}
