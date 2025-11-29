import React, { useState, useEffect } from "react";
import axios from "axios"; 
import "../assets/css/Map-tree.css";
import UserService from "../services/UserService";
import LessonCompletionService from "../services/lessonCompletionService"; 
import SectionService from "../services/SectionService";

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

// --- PREREQUISITES ---
const prerequisites = {
  1: null, 7: 1, 8: 7, 9: 8,
  2: 9, 10: 2, 11: 10, 12: 11,
  3: 12, 13: 3, 14: 13, 15: 14,
  4: 15, 16: 4, 17: 16, 18: 17,
  5: 18, 19: 5, 20: 19, 21: 20,
  6: 21, 22: 6, 23: 22, 24: 23,
};

// --- BACKEND TO NODE MAP ---
// Maps backend completion record IDs to frontend node IDs
const backendToNodeMap = {
  1: 1, 2: 7, 3: 8, 4: 9,
  5: 2, 6: 10, 7: 11, 8: 12,
  9: 3, 10: 13, 11: 14, 12: 15,
  13: 4, 14: 16, 15: 17, 16: 18,
  17: 5, 18: 19, 19: 20, 20: 21,
  21: 6, 22: 22, 23: 23, 24: 24,
};

// --- LESSON COMPONENTS ---
const lessonComponents = {
  AtomBuilder, AtomChallenge1, AtomChallenge2, AtomChallenge3,
  IonicBonding, IonicChallenge1, IonicChallenge2, IonicChallenge3,
  CovalentBonding, CovalentChallenge1, CovalentChallenge2, CovalentChallenge3,
  MoleMass, MoleMassChallenge1, MoleMassChallenge2, MoleMassChallenge3,
  MolesToGrams, MTGChallenge1, MTGChallenge2, MTGChallenge3,
  PercentComposition, PCChallenge1, PCChallenge2, PCChallenge3,
};

// --- SECTION MODAL ---
const SectionLockModal = ({ studentId, onJoinSuccess }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!studentId) {
      setError("User ID missing. Please refresh.");
      setLoading(false);
      return;
    }

    try {
      await SectionService.joinSection(code, studentId);
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
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            maxLength={6}
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
  const [completedNodes, setCompletedNodes] = useState(new Set());
  const [activeLesson, setActiveLesson] = useState(null);
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [totalScore, setTotalScore] = useState(0);

  const loadUserProgress = async (studentId) => {
    try {
      const completions = await LessonCompletionService.getUserCompletions(studentId);
      console.log("=== COMPLETION LOADING DEBUG ===");
      console.log("📊 Total completions from server:", completions?.length || 0);
      console.log("📦 Raw completions:", completions);
      
      if (completions && completions.length > 0) {
        console.log("📋 Sample completion structure:");
        const sample = completions[0];
        console.log("  - id:", sample.id);
        console.log("  - lessonId:", sample.lessonId);
        console.log("  - lesson:", sample.lesson);
        console.log("  - All keys:", Object.keys(sample));
      }

      const completedIds = new Set();
      (completions || []).forEach((c, index) => {
        console.log(`\n🔍 Processing completion ${index + 1}:`, c);

        let mappedId = null;

        // Try direct lessonId mapping
        const possibleKeys = [c.lessonId, c.lesson?.id, c.lesson?.lessonId, c.completionId];
        console.log(`  Checking keys:`, possibleKeys);
        
        for (const key of possibleKeys) {
          if (key != null && backendToNodeMap[key]) {
            mappedId = backendToNodeMap[key];
            console.log(`  ✅ MAPPED via key ${key} → nodeId=${mappedId}`);
            break;
          }
        }

        // Try name-based mapping as fallback
        if (mappedId == null) {
          const lessonName = c.lesson?.name || c.lessonName || c.name || c.title || c.label || c.lessonCode || c.lessonTitle;
          console.log(`  Trying name-based mapping with: "${lessonName}"`);
          
          if (lessonName) {
            const nodeMatch = nodes.find(n => n.lesson && n.lesson.toLowerCase() === String(lessonName).toLowerCase());
            if (nodeMatch) {
              mappedId = nodeMatch.id;
              console.log(`  ✅ MAPPED via exact name → nodeId=${mappedId}`);
            } else {
              const looseMatch = nodes.find(n => n.lesson && String(lessonName).toLowerCase().includes(n.lesson.toLowerCase()));
              if (looseMatch) {
                mappedId = looseMatch.id;
                console.log(`  ✅ MAPPED via loose name → nodeId=${mappedId}`);
              }
            }
          }
        }

        if (mappedId == null) {
          console.error(`  ❌ FAILED TO MAP completion:`, c);
          console.error(`  Available backend mapping keys:`, Object.keys(backendToNodeMap));
        } else {
          completedIds.add(mappedId);
        }
      });

      setCompletedNodes(completedIds);
      
      // 🏆 CALCULATE SCORE: Each completed challenge (★) = 100 points
      const challengeNodes = nodes.filter(n => n.label.includes("★"));
      const completedChallenges = challengeNodes.filter(n => completedIds.has(n.id));
      const calculatedScore = completedChallenges.length * 100;
      
      setTotalScore(calculatedScore);
      
      console.log(`✅ Loaded ${completedIds.size} completed lessons for student ID: ${studentId}`);
      console.log(`⭐ Completed ${completedChallenges.length}/${challengeNodes.length} challenges`);
      console.log(`🏆 Total Score: ${calculatedScore} points`);
      console.log("Completed Node IDs:", Array.from(completedIds).sort((a, b) => a - b));
    } catch (err) {
      console.warn("Could not load user completions on login.", err.response?.data || err.message);
      setCompletedNodes(new Set());
      setTotalScore(0);
    }
  };

  useEffect(() => {
    const initData = async () => {
      try {
        let userData = await UserService.getCurrentUser();
        setCurrentUser(userData);

        // Auto-create student profile if missing
        if (userData.role === "STUDENT" && !userData.student) {
          try {
            const userSession = JSON.parse(sessionStorage.getItem("user") || localStorage.getItem("user"));
            await axios.post("http://localhost:8080/api/student/add", {
              firstName: userData.firstName,
              lastName: userData.lastName,
              user: { userId: userData.userId || userData.id } 
            }, { 
              headers: { Authorization: `Bearer ${userSession?.token}`, "Content-Type": "application/json" } 
            });
            userData = await UserService.getCurrentUser();
            setCurrentUser(userData);
          } catch (e) { console.warn("Auto-create failed", e); }
        }

        if (userData.student && userData.student.section) {
          setHasAccess(true);
          const validStudentId = userData.student.studentId || userData.student.id;
          if (validStudentId) await loadUserProgress(validStudentId);
        } else {
          setHasAccess(false);
        }
      } catch (err) {
        setHasAccess(false);
      } finally {
        setCheckingAccess(false);
      }
    };

    initData();
  }, []);

  // Helper function to check if all prerequisites in the chain are completed
  const isPrerequisiteChainComplete = (nodeId) => {
    let currentId = nodeId;
    while (currentId !== null && currentId !== undefined) {
      const prereq = prerequisites[currentId];
      if (prereq === null || prereq === undefined) {
        return true;
      }
      if (!completedNodes.has(prereq)) {
        return false;
      }
      currentId = prereq;
    }
    return true;
  };

  const handleNodeClick = (node, isLocked) => {
    if (!hasAccess) return;
    if (isLocked) return alert("Please complete the previous lesson first.");
    if (node.lesson) setActiveLesson(node);
  };

  const handleLessonComplete = async () => {
    if (activeLesson && currentUser) {
      try {
        const validStudentId = currentUser.student?.studentId || currentUser.student?.id;
        if (!validStudentId) return console.error("Missing student ID");

        const lessonId = Object.keys(backendToNodeMap).find(
          key => backendToNodeMap[key] === activeLesson.id
        );

        console.log(`Completing lesson: nodeId=${activeLesson.id}, backendLessonId=${lessonId}`);

        if (!lessonId) {
          console.error(`Could not find backend lesson ID for node ${activeLesson.id}`);
          return;
        }

        await LessonCompletionService.completeLesson(validStudentId, parseInt(lessonId));
        
        // Reload progress to update score
        await loadUserProgress(validStudentId);
      } catch (err) {
        if (err.message?.includes("Lesson already completed")) {
          const validStudentId = currentUser.student?.studentId || currentUser.student?.id;
          await loadUserProgress(validStudentId);
        } else {
          console.error("Failed to save progress:", err);
        }
      }
    }
    setActiveLesson(null);
  };

  const CurrentLessonComponent = activeLesson ? lessonComponents[activeLesson.lesson] : null;

  if (checkingAccess) return <div className="Map-Container loading-container"><div className="loading-text">Loading Student Data...</div></div>;

  return (
    <div className="Map-Container">
      {!hasAccess && (
        <SectionLockModal
          studentId={currentUser?.student?.studentId || currentUser?.student?.id || currentUser?.userId}
          onJoinSuccess={async () => {
            setHasAccess(true);
            const updatedUser = await UserService.getCurrentUser();
            setCurrentUser(updatedUser);
            const validStudentId = updatedUser.student?.studentId || updatedUser.student?.id;
            await loadUserProgress(validStudentId);
          }}
        />
      )}

      {/* 🏆 SCORE DISPLAY BANNER */}
      {hasAccess && (
        <div className="score-banner">
          <div className="score-display">
            <span className="score-label">Total Score:</span>
            <span className="score-value">{totalScore}</span>
            <span className="score-stars">
              ⭐ {totalScore / 100} / {nodes.filter(n => n.label.includes("★")).length}
            </span>
          </div>
        </div>
      )}

      {!activeLesson && (
        <div className={`Node-Container ${!hasAccess ? "blurred" : ""}`}>
          {nodes.map(node => {
            const isCompleted = completedNodes.has(node.id);
            const isLocked = !isPrerequisiteChainComplete(node.id);
            const status = isCompleted ? "completed" : isLocked ? "locked" : "unlocked";

            return (
              <div
                key={node.id}
                className={`node ${status}`}
                data-type={node.label.includes("★") ? "★" : "lesson"}
                style={{ top: node.position.top, left: node.position.left }}
                onClick={() => handleNodeClick(node, isLocked)}
                title={status}
              >
                <span className="node-label">{node.label.replace("★ ", "")}</span>
              </div>
            );
          })}

          <div className={`end-circle ${nodes.every(n => completedNodes.has(n.id)) ? "unlocked" : "locked"}`}>END</div>
        </div>
      )}

      {activeLesson && CurrentLessonComponent && hasAccess && (
        <div className="lesson-modal">
          <div className="lesson-inner">
            <div className="lesson-header">
              <button className="close-btn" onClick={() => setActiveLesson(null)}>✖</button>
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