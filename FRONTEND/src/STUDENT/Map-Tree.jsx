import React, { useState, useLayoutEffect, useRef } from "react";
import "../assets/css/Map-tree.css";
import AtomBuilder from "../STUDENT/AtomBuilder";
import IonicBonding from "../STUDENT/IonicBonding";
import CovalentBonding from "../STUDENT/CovalentBonding";
import MoleMass from "../STUDENT/MoleMass";
import MolesToGrams from "../STUDENT/MolesToGrams";
import PercentComposition from "../STUDENT/PercentComposition";
import AtomChallenge1 from "../components/Student Components/AtomChallenge1";
import AtomChallenge2 from "../components/Student Components/AtomChallenge2";
import AtomChallenge3 from "../components/Student Components/AtomChallenge3";

// --- NODE MAP ---
const nodes = [
  // Atom + 3 Challenges
  { id: 1, label: "The Atom", position: { top: "35%", left: "10%" }, prerequisites: [], lesson: "AtomBuilder" },
  { id: 7, label: "★", position: { top: "35%", left: "25%" }, prerequisites: [1], lesson: "AtomChallenge1" },
  { id: 8, label: "★", position: { top: "35%", left: "40%" }, prerequisites: [7], lesson: "AtomChallenge2" },
  { id: 9, label: "★", position: { top: "35%", left: "55%" }, prerequisites: [8], lesson: "AtomChallenge3" },

  // Main lesson chain
  { id: 2, label: "Ionic Bonding", position: { top: "35%", left: "70%" }, prerequisites: [9], lesson: "IonicBonding" },
  { id: 3, label: "Covalent Bonding", position: { top: "55%", left: "70%" }, prerequisites: [2], lesson: "CovalentBonding" },
  { id: 4, label: "Molar Mass", position: { top: "70%", left: "70%" }, prerequisites: [3], lesson: "MoleMass" },
  { id: 5, label: "Moles to Grams", position: { top: "85%", left: "70%" }, prerequisites: [4], lesson: "MolesToGrams" },
  { id: 6, label: "% Composition", position: { top: "85%", left: "55%" }, prerequisites: [5], lesson: "PercentComposition" },
];

// --- CONNECTIONS ---
const connections = [
  { start: 1, end: 7 },
  { start: 7, end: 8 },
  { start: 8, end: 9 },
  { start: 9, end: 2 },
  { start: 2, end: 3 },
  { start: 3, end: 4 },
  { start: 4, end: 5 },
  { start: 5, end: 6 },
];

// --- MAP COMPONENTS ---
const lessonComponents = {
  AtomBuilder,
  AtomChallenge1,
  AtomChallenge2,
  AtomChallenge3,
  IonicBonding,
  CovalentBonding,
  MoleMass,
  MolesToGrams,
  PercentComposition,
};

const getNodeById = (id) => nodes.find((n) => n.id === id);

export default function MapTree() {
  const [completedNodes, setCompletedNodes] = useState(new Set());
  const [activeLesson, setActiveLesson] = useState(null);
  const containerRef = useRef(null);
  const [containerDims, setContainerDims] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (containerRef.current) {
      setContainerDims({
        width: containerRef.current.offsetWidth,
        height: containerRef.current.offsetHeight,
      });
    }
  }, []);

  const handleNodeClick = (node, status) => {
    if ((status === "unlocked" || status === "completed") && node.lesson) {
      setActiveLesson(node);
    }
  };

  const handleLessonComplete = () => {
    if (activeLesson) {
      setCompletedNodes((prev) => new Set(prev).add(activeLesson.id));
    }
    setActiveLesson(null);
  };

  const CurrentLessonComponent = activeLesson ? lessonComponents[activeLesson.lesson] : null;

  return (
    <div className="Map-Container">
      <div className="Node-Container" ref={containerRef}>
        {containerDims.width > 0 &&
          connections.map(({ start, end }) => (
            <ConnectorLine
              key={`${start}-${end}`}
              startNode={getNodeById(start)}
              endNode={getNodeById(end)}
              completedNodes={completedNodes}
              containerDims={containerDims}
            />
          ))}

        {nodes.map((node) => {
          const isCompleted = completedNodes.has(node.id);
          const isUnlocked = node.prerequisites.every((id) => completedNodes.has(id));
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
              {status === "completed" && <div className="replay-tooltip">Replay Lesson</div>}
            </div>
          );
        })}
      </div>

      {/* Modal for active lesson */}
      {activeLesson && CurrentLessonComponent && (
        <div className="lesson-modal">
          <div className="lesson-content">
            <button className="close-btn" onClick={() => setActiveLesson(null)}>
              ✖
            </button>
            <CurrentLessonComponent onComplete={handleLessonComplete} />
          </div>
        </div>
      )}
    </div>
  );
}

// --- ConnectorLine Component ---
const ConnectorLine = ({ startNode, endNode, completedNodes, containerDims }) => {
  if (!startNode || !endNode || !containerDims.width) return null;

  // Get raw positions
let x1 = (parseFloat(startNode.position.left) / 100) * containerDims.width;
let y1 = (parseFloat(startNode.position.top) / 100) * containerDims.height;
let x2 = (parseFloat(endNode.position.left) / 100) * containerDims.width;
let y2 = (parseFloat(endNode.position.top) / 100) * containerDims.height;

// Adjust to node centers
const NODE_SIZE = startNode.label.includes("★") ? 60 : 110; // your node sizes in px
const HALF_NODE = NODE_SIZE / 2;

x1 += HALF_NODE;
y1 += HALF_NODE;

const NODE_SIZE2 = endNode.label.includes("★") ? 60 : 110;
const HALF_NODE2 = NODE_SIZE2 / 2;

x2 += HALF_NODE2;
y2 += HALF_NODE2;


  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

  const startDone = completedNodes.has(startNode.id);
  const endDone = completedNodes.has(endNode.id);
  const endUnlocked = endNode.prerequisites.every((id) => completedNodes.has(id));

  let status = "locked";
  if (startDone && endDone) status = "completed";
  else if (startDone && !endDone) status = "active";
  else if (!startDone && endUnlocked) status = "active";

  return (
    <div
      className={`connector ${status}`}
      style={{
        position: "absolute",
        left: `${x1}px`,
        top: `${y1}px`,
        width: `${length}px`,
        height: "4px",
        transformOrigin: "0 50%",
        transform: `rotate(${angle}deg)`,
      }}
    />
  );
};
