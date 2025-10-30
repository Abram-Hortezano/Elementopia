import React, { useState } from "react";
import "../assets/css/PercentComposition.css";

const compounds = [
  {
    name: "Water (H₂O)",
    elements: ["H", "H", "O"],
    composition: { H: 11.1, O: 88.9 },
    highest: "O",
  },
  {
    name: "Carbon Dioxide (CO₂)",
    elements: ["C", "O", "O"],
    composition: { C: 27.3, O: 72.7 },
    highest: "O",
  },
  {
    name: "Glucose (C₆H₁₂O₆)",
    elements: ["C", "H", "O"],
    composition: { C: 40.0, H: 6.7, O: 53.3 },
    highest: "O",
  },
];

export default function PercentComposition() {
  const [started, setStarted] = useState(false);
  const [mission, setMission] = useState(1);
  const [selectedCompound, setSelectedCompound] = useState(null);
  const [feedback, setFeedback] = useState("");

  // --- Challenge 1: Build the Compound ---
  const [droppedAtoms, setDroppedAtoms] = useState([]);

  const handleDropAtom = (atom) => {
    if (droppedAtoms.length < selectedCompound.elements.length) {
      setDroppedAtoms((prev) => [...prev, atom]);
    }
  };

  // --- Challenge 2: Match % Composition ---
  const [compositionAnswers, setCompositionAnswers] = useState({});
  const handleDropPercent = (element, percent) => {
    setCompositionAnswers((prev) => ({ ...prev, [element]: percent }));
  };

  const checkCompositionAnswers = () => {
    const correct = selectedCompound.composition;
    let allCorrect = true;

    for (const el in correct) {
      if (compositionAnswers[el] !== correct[el]) {
        allCorrect = false;
        break;
      }
    }

    setFeedback(allCorrect ? "✅ Excellent! Correct composition!" : "❌ Check your values again.");
    if (allCorrect) setTimeout(() => setMission(3), 1500);
  };

  // --- Challenge 3: Identify the Highest Contributor ---
  const handleHighestSelect = (el) => {
    if (el === selectedCompound.highest) {
      setFeedback("🎉 Correct! You've completed the composition analysis!");
    } else {
      setFeedback("❌ Not quite! Try again.");
    }
  };

  const startLesson = () => {
    setStarted(true);
    setSelectedCompound(compounds[Math.floor(Math.random() * compounds.length)]);
  };

  return (
    <div className="percentcomp-wrapper">
      {!started ? (
        <div className="intro-panel">
          <h1>Lesson 6: Percent Composition</h1>
          <p>
            Welcome, chemist! Your mission: determine how much each element
            contributes to a compound’s total mass. Analyze, calculate, and
            identify the element with the highest mass composition.
          </p>
          <button className="start-btn" onClick={startLesson}>
            Start Mission
          </button>
        </div>
      ) : (
        <div className="challenge-container">
          <h2>{selectedCompound.name}</h2>

          {/* Mission 1: Build the Molecule */}
          {mission === 1 && (
            <div className="challenge-panel">
              <h3>Mission 1: Build the Molecule</h3>
              <div className="compound-zone">
                {droppedAtoms.map((a, i) => (
                  <div key={i} className={`atom-tile ${a.toLowerCase()}`}>
                    {a}
                  </div>
                ))}
              </div>

              <div className="atom-bin">
                {["H", "C", "O", "N"].map((atom) => (
                  <div
                    key={atom}
                    className="atom-draggable"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text/plain", atom)}
                    onClick={() => handleDropAtom(atom)}
                  >
                    {atom}
                  </div>
                ))}
              </div>

              <button
                className="complete-btn"
                onClick={() => setMission(2)}
                disabled={droppedAtoms.length < selectedCompound.elements.length}
              >
                Confirm Structure
              </button>
            </div>
          )}

          {/* Mission 2: Match % Composition */}
          {mission === 2 && (
            <div className="challenge-panel">
              <h3>Mission 2: Match Each Element to its % Composition</h3>
              <div className="composition-dropzone">
                {Object.keys(selectedCompound.composition).map((el) => (
                  <div key={el} className="composition-slot">
                    <span className="el-symbol">{el}</span>
                    <div
                      className="drop-target"
                      onDrop={(e) => {
                        e.preventDefault();
                        const percent = parseFloat(e.dataTransfer.getData("text"));
                        handleDropPercent(el, percent);
                      }}
                      onDragOver={(e) => e.preventDefault()}
                    >
                      {compositionAnswers[el]
                        ? `${compositionAnswers[el]}%`
                        : "Drop % here"}
                    </div>
                  </div>
                ))}
              </div>

              <div className="percent-bin">
                {Object.values(selectedCompound.composition).map((p) => (
                  <div
                    key={p}
                    className="percent-tile"
                    draggable
                    onDragStart={(e) => e.dataTransfer.setData("text", p)}
                  >
                    {p}%
                  </div>
                ))}
              </div>

              <button className="complete-btn" onClick={checkCompositionAnswers}>
                Check Answers
              </button>
            </div>
          )}

          {/* Mission 3: Identify the Highest Contributor */}
          {mission === 3 && (
            <div className="challenge-panel">
              <h3>Mission 3: Identify the Highest Contributor</h3>
              <p>
                Which element contributes the most to the total mass of{" "}
                {selectedCompound.name}?
              </p>
              <div className="element-options">
                {Object.keys(selectedCompound.composition).map((el) => (
                  <button
                    key={el}
                    className="element-btn"
                    onClick={() => handleHighestSelect(el)}
                  >
                    {el}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Message */}
          {feedback && <div className="feedback-box">{feedback}</div>}
        </div>
      )}
    </div>
  );
}
