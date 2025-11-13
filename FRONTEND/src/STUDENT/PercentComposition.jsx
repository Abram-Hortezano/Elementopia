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
  const [completed, setCompleted] = useState(false);
  const [onComplete, setOnComplete] = useState(() => () => {});

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
      setTimeout(() => {
        setCompleted(true);
        // Auto-exit after 4 seconds of showing celebration
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 4000);
      }, 1000);
    } else {
      setFeedback("❌ Not quite! Try again.");
    }
  };

  const startLesson = () => {
    setStarted(true);
    setSelectedCompound(compounds[Math.floor(Math.random() * compounds.length)]);
  };

  if (completed) {
    return (
      <div className="percentcomp-wrapper">
        <div className="completion-celebration">
          <div className="celebration-content">
            <div className="trophy-icon">🏆</div>
            <h1 className="celebration-title">Mission Complete!</h1>
            <p className="celebration-message">
              Outstanding work, chemist! You've mastered percent composition analysis.
            </p>
            <div className="celebration-stats">
              <div className="stat-item">
                <div className="stat-value">3/3</div>
                <div className="stat-label">Missions Completed</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{selectedCompound.name}</div>
                <div className="stat-label">Compound Analyzed</div>
              </div>
            </div>
            <div className="confetti">
              {[...Array(50)].map((_, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 3}s`,
                    background: ['#bb8fce', '#a569bd', '#8e44ad', '#a8e6cf', '#84dbb7'][Math.floor(Math.random() * 5)]
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="percentcomp-wrapper">
      {!started ? (
        <div className="intro-panel">
          <h1>Lesson 6: Percent Composition</h1>
          <p>
            Welcome, chemist! Your mission: determine how much each element
            contributes to a compound's total mass. Analyze, calculate, and
            identify the element with the highest mass composition.
          </p>
          <button className="start-btn" onClick={startLesson}>
            Start Mission
          </button>
        </div>
      ) : (
        <div className="challenge-container">
          <div className="mission-progress">
            <div className={`mission-step ${mission >= 1 ? 'active' : ''} ${mission > 1 ? 'completed' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-label">Build</div>
            </div>
            <div className="progress-line"></div>
            <div className={`mission-step ${mission >= 2 ? 'active' : ''} ${mission > 2 ? 'completed' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-label">Match</div>
            </div>
            <div className="progress-line"></div>
            <div className={`mission-step ${mission >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-label">Identify</div>
            </div>
          </div>

          <h2>{selectedCompound.name}</h2>

          {/* Mission 1: Build the Molecule */}
          {mission === 1 && (
            <div className="challenge-panel">
              <h3>Mission 1: Build the Molecule</h3>
              <div className="explanation-box">
                <strong>📚 What you'll learn:</strong> Understanding a compound's structure is the first step 
                to analyzing its composition. Each molecule is made of specific atoms bonded together. 
                For <strong>{selectedCompound.name}</strong>, you need <strong>{selectedCompound.elements.join(", ")}</strong>.
              </div>
              
              <div className="compound-zone">
                {droppedAtoms.map((a, i) => (
                  <div key={i} className={`atom-tile ${a.toLowerCase()}`}>
                    {a}
                  </div>
                ))}
                {droppedAtoms.length === 0 && (
                  <div className="drop-hint">Drop atoms here to build the molecule</div>
                )}
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
                onClick={() => {
                  setMission(2);
                  setFeedback("");
                }}
                disabled={droppedAtoms.length < selectedCompound.elements.length}
              >
                Confirm Structure →
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
                Check Answers ✓
              </button>
            </div>
          )}

          {/* Mission 3: Identify the Highest Contributor */}
          {mission === 3 && (
            <div className="challenge-panel">
              <h3>Mission 3: Identify the Highest Contributor</h3>
              <p className="mission-question">
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
                    <span className="element-symbol-large">{el}</span>
                    <span className="element-percent">{selectedCompound.composition[el]}%</span>
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