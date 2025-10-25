<<<<<<< HEAD
import React, { useState, useLayoutEffect, useRef } from 'react';
import Background from '../assets/Background/galaxy.jpg';
import "../assets/css/Map-tree.css";

// --- Import your lesson components ---
import AtomBuilder from '../STUDENT/AtomBuilder';
import IonicBonding from '../STUDENT/IonicBonding';

// --- DATA STRUCTURE with lesson mapping ---
const nodes = [
    { id: 1, label: 'The Atom',         position: { top: '20%', left: '50%' }, prerequisites: [], lesson: 'AtomBuilder' },
    { id: 2, label: 'Ionic Bonding',    position: { top: '20%', left: '30%' }, prerequisites: [1], lesson: 'IonicBonding' },
    { id: 3, label: 'Covalent Bonding', position: { top: '55%', left: '30%' }, prerequisites: [2], lesson: null }, // Lesson not yet built
    { id: 4, label: 'Molar Mass',       position: { top: '55%', left: '50%' }, prerequisites: [3], lesson: null },
    { id: 5, label: 'Moles to Grams',   position: { top: '80%', left: '50%' }, prerequisites: [4], lesson: null },
    { id: 6, label: '% Composition',    position: { top: '80%', left: '70%' }, prerequisites: [3, 5], lesson: null },
];

const connections = [
    { start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 4 },
    { start: 4, end: 5 }, { start: 5, end: 6 }
];

// --- Map lesson names to components ---
const lessonComponents = {
    AtomBuilder: AtomBuilder,
    IonicBonding: IonicBonding,
    // Add CovalentBonding and others when available
};

const getNodeById = (id) => nodes.find(node => node.id === id);

export default function MapTree() {
    const [completedNodes, setCompletedNodes] = useState(new Set());
    const [activeLesson, setActiveLesson] = useState(null); // <-- State to manage the open lesson
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
        // Only open a lesson if the node is unlocked and has a lesson assigned
        if (status === 'unlocked' && node.lesson) {
            setActiveLesson(node);
        }
    };
    
    const handleLessonComplete = () => {
        if (activeLesson) {
            setCompletedNodes(prev => new Set(prev).add(activeLesson.id));
        }
        setActiveLesson(null); // Close the lesson modal
    };
    
    // Determine which lesson component to show
    const CurrentLessonComponent = activeLesson ? lessonComponents[activeLesson.lesson] : null;

    return (
        <div className='Map-Container'>
            <img className='main-background' src={Background} alt="A galaxy background" />
            <div className='Node-Container' ref={containerRef}>
                {containerDims.width > 0 && connections.map(({ start, end }) => (
                    <ConnectorLine
                        key={`${start}-${end}`}
                        startNode={getNodeById(start)}
                        endNode={getNodeById(end)}
                        isCompleted={completedNodes.has(start)}
                        containerDims={containerDims}
                    />
                ))}
                {nodes.map(node => {
                    const isCompleted = completedNodes.has(node.id);
                    const isUnlocked = node.prerequisites.every(id => completedNodes.has(id));
                    let status = isCompleted ? 'completed' : isUnlocked ? 'unlocked' : 'locked';

                    return (
                        <div
                            key={node.id}
                            className={`node ${status}`}
                            style={{ top: node.position.top, left: node.position.left }}
                            // Updated onClick to use the new handler
                            onClick={() => handleNodeClick(node, status)}
                        >
                            <span className="node-label">{node.label}</span>
                        </div>
                    );
                })}
            </div>
            
            {/* --- This section renders the active lesson --- */}
            {activeLesson && CurrentLessonComponent && (
                <CurrentLessonComponent onComplete={handleLessonComplete} />
            )}
        </div>
    );
}

// --- The ConnectorLine component (no changes) ---
const ConnectorLine = ({ startNode, endNode, isCompleted, containerDims }) => {
    if (!startNode || !endNode || !containerDims.width) return null;

    const x1 = (parseFloat(startNode.position.left) / 100) * containerDims.width;
    const y1 = (parseFloat(startNode.position.top) / 100) * containerDims.height;
    const x2 = (parseFloat(endNode.position.left) / 100) * containerDims.width;
    const y2 = (parseFloat(endNode.position.top) / 100) * containerDims.height;

    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    const lineStyle = {
        position: 'absolute',
        left: `${x1}px`,
        top: `${y1}px`,
        width: `${length}px`,
        transform: `rotate(${angle}deg)`,
    };

    return <div className={`connector ${isCompleted ? 'completed' : 'locked'}`} style={lineStyle}></div>;
};
=======
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

// --- DUMMY CHALLENGE ---
const DummyChallenge = ({ onComplete }) => (
  <div className="lesson-inner">
    <h2>★ Dummy Challenge</h2>
    <p>This is a placeholder challenge. You can replace it later.</p>
    <button className="complete-btn" onClick={onComplete}>
      Mark Complete
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
  { id: 16, label: "★", position: { top: "46%", left: "52%" }, prerequisites: [4], lesson: "DummyChallenge" },
  { id: 17, label: "★", position: { top: "53%", left: "54%" }, prerequisites: [16], lesson: "DummyChallenge" },
  { id: 18, label: "★", position: { top: "60%", left: "56%" }, prerequisites: [17], lesson: "DummyChallenge" },
  { id: 5, label: "Moles to Grams", position: { top: "64%", left: "61%" }, prerequisites: [18], lesson: "MolesToGrams" },
  { id: 19, label: "★", position: { top: "69%", left: "66%" }, prerequisites: [5], lesson: "DummyChallenge" },
  { id: 20, label: "★", position: { top: "74%", left: "71%" }, prerequisites: [19], lesson: "DummyChallenge" },
  { id: 21, label: "★", position: { top: "79%", left: "75%" }, prerequisites: [20], lesson: "DummyChallenge" },
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
  MolesToGrams,
  PercentComposition,
  DummyChallenge,
};

export default function MapTree() {
  const [completedNodes, setCompletedNodes] = useState(new Set());
  const [activeLesson, setActiveLesson] = useState(null);

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

  const allCompleted = false; // keep END dim until all lessons are done
  const CurrentLessonComponent = activeLesson ? lessonComponents[activeLesson.lesson] : null;

  return (
    <div className="Map-Container">
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
>>>>>>> 452962dd8f3e113f23cebcf2fc5e4b9ac0f81e15
