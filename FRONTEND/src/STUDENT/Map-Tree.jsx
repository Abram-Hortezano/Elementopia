import React, { useState, useLayoutEffect, useRef } from 'react';
import "../assets/css/Map-tree.css";

// --- Import lesson components ---
import AtomBuilder from '../STUDENT/AtomBuilder';
import IonicBonding from '../STUDENT/IonicBonding';
import CovalentBonding from '../STUDENT/CovalentBonding';

// --- DATA STRUCTURE with lesson mapping ---
const nodes = [
    { id: 1, label: 'The Atom',         position: { top: '20%', left: '50%' }, prerequisites: [], lesson: 'AtomBuilder' },
    { id: 2, label: 'Ionic Bonding',    position: { top: '20%', left: '30%' }, prerequisites: [1], lesson: 'IonicBonding' },
    { id: 3, label: 'Covalent Bonding', position: { top: '55%', left: '30%' }, prerequisites: [2], lesson: 'CovalentBonding' },
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
    AtomBuilder,
    IonicBonding,
    CovalentBonding,
};

const getNodeById = (id) => nodes.find(node => node.id === id);

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
        if (status === 'unlocked' && node.lesson) {
            setActiveLesson(node);
        }
    };

    const handleLessonComplete = () => {
        if (activeLesson) {
            setCompletedNodes(prev => new Set(prev).add(activeLesson.id));
        }
        setActiveLesson(null);
    };

    const CurrentLessonComponent = activeLesson ? lessonComponents[activeLesson.lesson] : null;

    return (
        <div className="Map-Container">
            <div className="Node-Container" ref={containerRef}>
                {containerDims.width > 0 && connections.map(({ start, end }) => (
                    <ConnectorLine
                        key={`${start}-${end}`}
                        startNode={getNodeById(start)}
                        endNode={getNodeById(end)}
                        completedNodes={completedNodes}
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
                            onClick={() => handleNodeClick(node, status)}
                        >
                            <span className="node-label">{node.label}</span>
                        </div>
                    );
                })}
            </div>

            {/* Active lesson modal */}
            {activeLesson && CurrentLessonComponent && (
                <div className="lesson-modal">
                    <div className="lesson-content">
                        <button className="close-btn" onClick={() => setActiveLesson(null)}>✖</button>
                        <CurrentLessonComponent onComplete={handleLessonComplete} />
                    </div>
                </div>
            )}
        </div>
    );
}

// --- ConnectorLine component ---
// --- ConnectorLine component ---
const ConnectorLine = ({ startNode, endNode, completedNodes, containerDims }) => {
    if (!startNode || !endNode || !containerDims.width) return null;

    const x1 = (parseFloat(startNode.position.left) / 100) * containerDims.width;
    const y1 = (parseFloat(startNode.position.top) / 100) * containerDims.height;
    const x2 = (parseFloat(endNode.position.left) / 100) * containerDims.width;
    const y2 = (parseFloat(endNode.position.top) / 100) * containerDims.height;

    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

    // --- Node status checks ---
    const startCompleted = completedNodes.has(startNode.id);
    const endCompleted = completedNodes.has(endNode.id);
    const endUnlocked = endNode.prerequisites.every(id => completedNodes.has(id));

    let status = "locked";

    if (startCompleted && endCompleted) {
        status = "completed";   // ✅ Both nodes done → green
    } else if (startCompleted && !endCompleted) {
        status = "active";      // 🔵 Start done but end not done yet → glowing
    } else if (!startCompleted && endUnlocked) {
        status = "active";      // 🔵 End is unlocked → glowing line
    }

    const lineStyle = {
        position: 'absolute',
        left: `${x1}px`,
        top: `${y1}px`,
        width: `${length}px`,
        transform: `rotate(${angle}deg)`,
    };

    return <div className={`connector ${status}`} style={lineStyle}></div>;
};
