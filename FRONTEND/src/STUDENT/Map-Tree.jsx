import React, { useState, useEffect } from "react";
import "../assets/css/Map-tree.css";
import UserService from "../services/UserService";
import LessonCompletionService from "../services/lessonCompletionService";

// --- LESSON IMPORTS ---
import AtomBuilder from "../STUDENT/AtomBuilder";
import IonicBonding from "../STUDENT/IonicBonding";
import CovalentBonding from "../STUDENT/CovalentBonding";
import MoleMass from "../STUDENT/MoleMass";
import MolesToGrams from "../STUDENT/MolesToGrams";
import PercentComposition from "../STUDENT/PercentComposition";

// --- CHALLENGE IMPORTS ---
import AtomChallenge1 from "../components/Student Components/AtomChallenge1";
import AtomChallenge2 from "../components/Student Components/AtomChallenge2";
import AtomChallenge3 from "../components/Student Components/AtomChallenge3";
import IonicChallenge1 from "../components/Student Components/IonicChallenge1";
import IonicChallenge2 from "../components/Student Components/IonicChallenge2";
import IonicChallenge3 from "../components/Student Components/IonicChallenge3";
import CovalentChallenge1 from "../components/Student Components/CovalentChallenge1";
import CovalentChallenge2 from "../components/Student Components/CovalentChallenge2";
import CovalentChallenge3 from "../components/Student Components/CovalentChallenge3";
import MoleMassChallenge1 from "../components/Student Components/MoleMassChallenge1";
import MoleMassChallenge2 from "../components/Student Components/MoleMassChallenge2";
import MoleMassChallenge3 from "../components/Student Components/MoleMassChallenge3";
import MTGChallenge1 from "../components/Student Components/MTGChallenge1";
import MTGChallenge2 from "../components/Student Components/MTGChallenge2";
import MTGChallenge3 from "../components/Student Components/MTGChallenge3";
import PCChallenge1 from "../components/Student Components/PCChallenge1";
import PCChallenge2 from "../components/Student Components/PCChallenge2";
import PCChallenge3 from "../components/Student Components/PCChallenge3";

// --- NODE MAP ---
// Ensure these IDs match what your backend expects for "lessonId"
const nodes = [
  { id: 1, label: "The Atom", position: { top: "4%", left: "2%" }, lesson: "AtomBuilder" },
  { id: 7, label: "★", position: { top: "8%", left: "7%" }, lesson: "AtomChallenge1" },
  { id: 8, label: "★", position: { top: "11%", left: "10%" }, lesson: "AtomChallenge2" },
  { id: 9, label: "★", position: { top: "8%", left: "13%" }, lesson: "AtomChallenge3" },
  { id: 2, label: "Ionic Bonding", position: { top: "4%", left: "18%" }, lesson: "IonicBonding" },
  { id: 10, label: "★", position: { top: "12%", left: "22%" }, lesson: "IonicChallenge1" },
  { id: 11, label: "★", position: { top: "14%", left: "25%" }, lesson: "IonicChallenge2" },
  { id: 12, label: "★", position: { top: "11%", left: "28%" }, lesson: "IonicChallenge3" },
  { id: 3, label: "Covalent Bonding", position: { top: "16%", left: "34%" }, lesson: "CovalentBonding" },
  { id: 13, label: "★", position: { top: "20%", left: "39%" }, lesson: "CovalentChallenge1" },
  { id: 14, label: "★", position: { top: "25%", left: "42%" }, lesson: "CovalentChallenge2" },
  { id: 15, label: "★", position: { top: "31%", left: "44%" }, lesson: "CovalentChallenge3" },
  { id: 4, label: "Molar Mass", position: { top: "39%", left: "49%" }, lesson: "MoleMass" },
  { id: 16, label: "★", position: { top: "46%", left: "52%" }, lesson: "MoleMassChallenge1" },
  { id: 17, label: "★", position: { top: "53%", left: "54%" }, lesson: "MoleMassChallenge2" },
  { id: 18, label: "★", position: { top: "60%", left: "56%" }, lesson: "MoleMassChallenge3" },
  { id: 5, label: "Moles to Grams", position: { top: "64%", left: "61%" }, lesson: "MolesToGrams" },
  { id: 19, label: "★", position: { top: "69%", left: "66%" }, lesson: "MTGChallenge1" },
  { id: 20, label: "★", position: { top: "74%", left: "71%" }, lesson: "MTGChallenge2" },
  { id: 21, label: "★", position: { top: "79%", left: "75%" }, lesson: "MTGChallenge3" },
  { id: 6, label: "% Composition", position: { top: "82%", left: "80%" }, lesson: "PercentComposition" },
  { id: 22, label: "★", position: { top: "74%", left: "84%" }, lesson: "PCChallenge1" },
  { id: 23, label: "★", position: { top: "68%", left: "86%" }, lesson: "PCChallenge2" },
  { id: 24, label: "★", position: { top: "62%", left: "88%" }, lesson: "PCChallenge3" },
];

// --- COMPONENTS MAP ---
const lessonComponents = {
  AtomBuilder, AtomChallenge1, AtomChallenge2, AtomChallenge3,
  IonicBonding, IonicChallenge1, IonicChallenge2, IonicChallenge3,
  CovalentBonding, CovalentChallenge1, CovalentChallenge2, CovalentChallenge3,
  MoleMass, MoleMassChallenge1, MoleMassChallenge2, MoleMassChallenge3,
  MolesToGrams, MTGChallenge1, MTGChallenge2, MTGChallenge3,
  PercentComposition, PCChallenge1, PCChallenge2, PCChallenge3,
};

// --- HELPER COMPONENT: SECTION LOCK MODAL ---
const SectionLockModal = ({ onJoinSuccess }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await UserService.joinSection(code);
      onJoinSuccess();
    } catch (err) {
      setError(err.response?.data?.message || "Invalid section code. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section-modal-overlay">
      <div className="section-modal-content">
        <h2 className="section-modal-title">Restricted Area</h2>
        <p className="section-modal-text">
          You must join a class section to access the Learning Map.
          Please enter the code provided by your teacher.
        </p>
        <form onSubmit={handleSubmit} className="section-modal-form">
          <input 
            type="text" 
            className="section-modal-input"
            placeholder="Enter Section Code" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {error && <div className="section-modal-error">{error}</div>}
          <button type="submit" className="section-modal-btn" disabled={loading}>
            {loading ? "Verifying..." : "Unlock Map"}
          </button>
        </form>
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function MapTree() {
  // State for completed nodes (Set of IDs)
  const [completedNodes, setCompletedNodes] = useState(new Set());
  
  const [activeLesson, setActiveLesson] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // 1. Check Access & Fetch User Data
  useEffect(() => {
    const initData = async () => {
      try {
        const userData = await UserService.getCurrentUser();
        setCurrentUser(userData);

        // Check for section access
        if (userData && (userData.sectionCode || userData.sectionId)) {
          setHasAccess(true);
          // If they have access, load their progress
          await loadUserProgress(userData.userId || userData.id);
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error("Failed to verify section access", error);
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    initData();
  }, []);

  // Helper to load progress from API
  const loadUserProgress = async (userId) => {
    try {
      const completions = await LessonCompletionService.getUserCompletions(userId);
      // Assuming completion object has 'lessonId'. If it's just a list of IDs, adjust accordingly.
      const completedIds = new Set(completions.map(c => c.lessonId));
      setCompletedNodes(completedIds);
    } catch (err) {
      console.error("Could not load progress", err);
    }
  };

  const handleNodeClick = (node, status) => {
    if (!hasAccess) return;
    if (node.lesson) {
      setActiveLesson(node);
    }
  };

  // Handle lesson complete -> Call API
  const handleLessonComplete = async () => {
    if (activeLesson && currentUser) {
      try {
        // Optimistic update: Update UI immediately
        setCompletedNodes((prev) => {
          const updated = new Set(prev);
          updated.add(activeLesson.id);
          return updated;
        });

        // Call API to persist
        await LessonCompletionService.completeLesson({
          userId: currentUser.userId || currentUser.id,
          lessonId: activeLesson.id
        });
        
        console.log("✅ Completed & Saved:", activeLesson.id);
      } catch (error) {
        console.error("Failed to save completion to server", error);
        // Optional: Rollback state if save fails, or show error toast
      }
    }
    setActiveLesson(null);
  };

  const CurrentLessonComponent = activeLesson ? lessonComponents[activeLesson.lesson] : null;

  if (checkingAccess) return (
    <div className="Map-Container loading-container">
      <div className="loading-text">Loading Student Data...</div>
    </div>
  );

  return (
    <div className="Map-Container">
      {/* --- LOCK OVERLAY --- */}
      {!hasAccess && (
        <SectionLockModal onJoinSuccess={() => {
            setHasAccess(true);
            // Try loading progress again if they just joined
            if(currentUser) loadUserProgress(currentUser.userId || currentUser.id);
        }} />
      )}

      {/* --- MAP VIEW --- */}
      {!activeLesson && (
        <div className={`Node-Container ${!hasAccess ? "blurred" : ""}`}>
          {nodes.map((node) => {
            const isCompleted = completedNodes.has(node.id);
            const status = isCompleted ? "completed" : "unlocked";

            return (
              <div
                key={node.id}
                className={`node ${status}`}
                data-type={node.label.includes("★") ? "★" : "lesson"}
                style={{ top: node.position.top, left: node.position.left }}
                onClick={() => handleNodeClick(node, status)}
                title={status}
              >
                <span className="node-label">{node.label.replace("★ ", "")}</span>
              </div>
            );
          })}

          <div className={`end-circle ${nodes.every((n) => completedNodes.has(n.id)) ? "unlocked" : "locked"}`}>
            END
          </div>
        </div>
      )}

      {/* --- LESSON MODAL --- */}
      {activeLesson && CurrentLessonComponent && hasAccess && (
        <div className="lesson-modal">
          <div className="lesson-inner">
            <div className="lesson-header">
              <button className="close-btn" onClick={() => setActiveLesson(null)}>
                ✖
              </button>
            </div>
            <div className="lesson-body">
              <CurrentLessonComponent onComplete={handleLessonComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}