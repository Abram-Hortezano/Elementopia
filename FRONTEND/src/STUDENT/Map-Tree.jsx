import React, { useState } from "react";
import "../assets/css/Map-tree.css";

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
import MoleMassChallenge1 from "../components/Student Components/MoleMassChallenge1";
import MoleMassChallenge2 from "../components/Student Components/MoleMassChallenge2";
import MoleMassChallenge3 from "../components/Student Components/MoleMassChallenge3";
import MolesToGramsChallenge1 from "../components/Student Components/MolesToGramsChallenge1";
import MolesToGramsChallenge2 from "../components/Student Components/MolesToGramsChallenge2";
import MolesToGramsChallenge3 from "../components/Student Components/MolesToGramsChallenge3";

// --- DUMMY CHALLENGE ---
// Pass deductions (e.g., 0) when completing
const DummyChallenge = ({ onComplete }) => (
  <div className="lesson-inner">
    <h2>★ Dummy Challenge</h2>
    <p>This is a placeholder challenge. Replace it later.</p>
    <button className="complete-btn" onClick={() => onComplete(0)}>
      Mark Complete (0 deductions)
    </button>
  </div>
);

// --- NODE MAP ---
const nodes = [
  { id: 1, label: "The Atom", position: { top: "4%", left: "2%" }, lesson: "AtomBuilder" },
  { id: 7, label: "★", position: { top: "8%", left: "7%" }, prerequisites: [1], lesson: "AtomChallenge1" },
  { id: 8, label: "★", position: { top: "11%", left: "10%" }, prerequisites: [7], lesson: "AtomChallenge2" },
  { id: 9, label: "★", position: { top: "8%", left: "13%" }, prerequisites: [8], lesson: "AtomChallenge3" },
  { id: 2, label: "Ionic Bonding", position: { top: "4%", left: "18%" }, prerequisites: [9], lesson: "IonicBonding" },
  { id: 10, label: "★", position: { top: "12%", left: "22%" }, prerequisites: [2], lesson: "IonicChallenge1" },
  { id: 11, label: "★", position: { top: "14%", left: "25%" }, prerequisites: [10], lesson: "IonicChallenge2" },
  { id: 12, label: "★", position: { top: "11%", left: "28%" }, prerequisites: [11], lesson: "IonicChallenge3" },
  { id: 3, label: "Covalent Bonding", position: { top: "16%", left: "34%" }, prerequisites: [12], lesson: "CovalentBonding" },
  { id: 13, label: "★", position: { top: "20%", left: "39%" }, prerequisites: [3], lesson: "DummyChallenge" },
  { id: 14, label: "★", position: { top: "25%", left: "42%" }, prerequisites: [13], lesson: "DummyChallenge" },
  { id: 15, label: "★", position: { top: "31%", left: "44%" }, prerequisites: [14], lesson: "DummyChallenge" },
  { id: 4, label: "Molar Mass", position: { top: "39%", left: "49%" }, prerequisites: [15], lesson: "MoleMass" },
  { id: 16, label: "★", position: { top: "46%", left: "52%" }, prerequisites: [4], lesson: "MoleMassChallenge1" },
  { id: 17, label: "★", position: { top: "53%", left: "54%" }, prerequisites: [16], lesson: "MoleMassChallenge2" },
  { id: 18, label: "★", position: { top: "60%", left: "56%" }, prerequisites: [17], lesson: "MoleMassChallenge3" },
  { id: 5, label: "Moles to Grams", position: { top: "64%", left: "61%" }, prerequisites: [18], lesson: "MolesToGrams" },
  { id: 19, label: "★", position: { top: "69%", left: "66%" }, prerequisites: [5], lesson: "MolesToGramsChallenge1" },
  { id: 20, label: "★", position: { top: "74%", left: "71%" }, prerequisites: [19], lesson: "MolesToGramsChallenge2" },
  { id: 21, label: "★", position: { top: "79%", left: "75%" }, prerequisites: [20], lesson: "MolesToGramsChallenge3" },
  { id: 6, label: "% Composition", position: { top: "82%", left: "80%" }, prerequisites: [21], lesson: "PercentComposition" },
  { id: 22, label: "★", position: { top: "74%", left: "84%" }, prerequisites: [6], lesson: "DummyChallenge" },
  { id: 23, label: "★", position: { top: "68%", left: "86%" }, prerequisites: [22], lesson: "DummyChallenge" },
  { id: 24, label: "★", position: { top: "62%", left: "88%" }, prerequisites: [23], lesson: "DummyChallenge" },
];


const lessonComponents = {
  AtomBuilder,
  AtomChallenge1,
  AtomChallenge2,
  AtomChallenge3,
  IonicBonding,
  IonicChallenge1,
  IonicChallenge2,
  IonicChallenge3,
  CovalentBonding,
  MoleMass,
MoleMassChallenge1,
MoleMassChallenge2,
MoleMassChallenge3,
  MolesToGrams,
MolesToGramsChallenge1,
MolesToGramsChallenge2,
MolesToGramsChallenge3,
  PercentComposition,
  DummyChallenge,
};


// --- Define Score Constants ---
const MAX_SCORE_PER_LESSON = 10;
const MAX_TOTAL_SCORE = nodes.length * MAX_SCORE_PER_LESSON;

export default function MapTree() {
  const [completedNodes, setCompletedNodes] = useState(new Set());
  const [activeLesson, setActiveLesson] = useState(null);
  const [lastDeductions, setLastDeductions] = useState(0);
  const [totalScore, setTotalScore] = useState(MAX_TOTAL_SCORE);

  const handleNodeClick = (node, status) => {
    if ((status === "unlocked" || status === "completed") && node.lesson) {
      setActiveLesson(node);
    }
  };

  // --- Modified handleLessonComplete to accept deductions ---
  const handleLessonComplete = (deductions = 0) => {
    if (activeLesson) {
      const isAlreadyCompleted = completedNodes.has(activeLesson.id);

      // Add to completed set
      setCompletedNodes((prev) => new Set(prev).add(activeLesson.id));

      setActiveLesson(null);

      // --- Only deduct points on the first completion ---
      if (!isAlreadyCompleted) {
        setTotalScore((prevScore) => prevScore - deductions);

        setLastDeductions(deductions);
      }else{
        setLastDeductions(0);
}
    }
    setActiveLesson(null);
  };

  // --- Dynamically check if all nodes are completed ---
  const allCompleted = completedNodes.size === nodes.length;
  const CurrentLessonComponent = activeLesson ? lessonComponents[activeLesson.lesson] : null;

  return (
    <div className="Map-Container">

      <div className="total-score-display">
        Score: {totalScore} / {MAX_TOTAL_SCORE}
      </div>

      <div className="Node-Container">
        {nodes.map((node) => {
          const isCompleted = completedNodes.has(node.id);
          const isUnlocked = true;
          const status = isCompleted ? "completed" : isUnlocked ? "unlocked" : "locked";

          return (
            <div
              key={node.id}
              className={`node ${status}`}
              data-type={node.label.includes("★") ? "★" : "lesson"}
              style={{ top: node.position.top, left: node.position.left }}
              onClick={() => handleNodeClick(node, status)}
            >
              <span className="node-label">{node.label.replace("★ ", "")}</span>
            </div>
          );
        })}

        {/* END Circle */}
        <div className={`end-circle ${allCompleted ? "unlocked" : "locked"}`}>END</div>
      </div>

      {/* Fullscreen Modal */}
      {activeLesson && CurrentLessonComponent && (
        <div className="lesson-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setActiveLesson(null);
            }
          }}>
          <div className="lesson-inner">
            <div className="lesson-header">
              <button className="close-btn" onClick={() => setActiveLesson(null)}>
                ✖
              </button>
            </div>
            <div className="lesson-body">
              {/* --- Pass the modified handler to the component --- */}
              <CurrentLessonComponent onComplete={handleLessonComplete} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}