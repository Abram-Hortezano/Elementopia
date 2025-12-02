import React, { useState, useRef, useEffect } from "react";
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

export default function PercentComposition({ onComplete = () => {} }) {
  const [started, setStarted] = useState(false);
  const [mission, setMission] = useState(1);
  const [selectedCompound, setSelectedCompound] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [completed, setCompleted] = useState(false);

  // drag / build state (unchanged)
  const [droppedAtoms, setDroppedAtoms] = useState([]);

  const handleDropAtom = (atom) => {
    if (!selectedCompound) return;
    if (droppedAtoms.length < selectedCompound.elements.length) {
      setDroppedAtoms((prev) => [...prev, atom]);
    }
  };

  // match % state (unchanged)
  const [compositionAnswers, setCompositionAnswers] = useState({});
  const handleDropPercent = (element, percent) => {
    setCompositionAnswers((prev) => ({ ...prev, [element]: percent }));
  };

  const checkCompositionAnswers = () => {
    if (!selectedCompound) return;
    const correct = selectedCompound.composition;
    let allCorrect = true;

    for (const el in correct) {
      if (compositionAnswers[el] !== correct[el]) {
        allCorrect = false;
        break;
      }
    }

    setFeedback(allCorrect ? "✅ Excellent! Correct composition!" : "❌ Check your values again.");

    if (allCorrect) {
      // small delay to let the user see the "correct" feedback before moving on
      const t = setTimeout(() => {
        setMission(3);
        setFeedback("");
      }, 1200);
      timers.current.push(t);
    }
  };

  // timers ref for cleanup
  const timers = useRef([]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      timers.current.forEach((id) => clearTimeout(id));
      timers.current = [];
    };
  }, []);

  // --- Completion: show celebration then call parent onComplete (same style as MolesToGrams) ---
  const handleHighestSelect = (el) => {
    if (!selectedCompound) return;

    if (el === selectedCompound.highest) {
      setFeedback("🎉 Correct! You've completed the composition analysis!");

      // brief delay before showing celebration
      const t1 = setTimeout(() => {
        setCompleted(true);

        // after celebration delay, call parent onComplete exactly like MolesToGrams
        const t2 = setTimeout(() => {
          try {
            onComplete(); // <-- important: MapTree passes handleLessonComplete as onComplete
          } catch (err) {
            console.error("onComplete error:", err);
          }
        }, 3500); // 3.5s to allow celebration to show

        timers.current.push(t2);
      }, 900);

      timers.current.push(t1);
    } else {
      setFeedback("❌ Not quite! Try again.");
    }
  };

  const startLesson = () => {
    setStarted(true);
    setSelectedCompound(compounds[Math.floor(Math.random() * compounds.length)]);
    setMission(1);
    setDroppedAtoms([]);
    setCompositionAnswers({});
    setFeedback("");
    setCompleted(false);
  };

  // ------------------ COMPLETION SCREEN ------------------
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
                <div className="stat-value">{selectedCompound?.name}</div>
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
                    background: ["#bb8fce", "#a569bd", "#8e44ad", "#a8e6cf", "#84dbb7"][
                      Math.floor(Math.random() * 5)
                    ],
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ------------------ GAME UI (unchanged drag behavior) ------------------
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
          {/* PROGRESS BAR */}
          <div className="mission-progress">
            <div className={`mission-step ${mission >= 1 ? "active" : ""} ${mission > 1 ? "completed" : ""}`}>
              <div className="step-number">1</div>
              <div className="step-label">Build</div>
            </div>
            <div className="progress-line" />
            <div className={`mission-step ${mission >= 2 ? "active" : ""} ${mission > 2 ? "completed" : ""}`}>
              <div className="step-number">2</div>
              <div className="step-label">Match</div>
            </div>
            <div className="progress-line" />
            <div className={`mission-step ${mission >= 3 ? "active" : ""}`}>
              <div className="step-number">3</div>
              <div className="step-label">Identify</div>
            </div>
          </div>

          <h2>{selectedCompound?.name}</h2>

          {/* Mission 1 */}
          {mission === 1 && (
            <div className="challenge-panel">
              <h3>Mission 1: Build the Molecule</h3>

              <div className="explanation-box">
                <strong>📚 What you'll learn:</strong> Understanding a compound's structure is the first step 
                to analyzing composition. Use the atom tiles to build {selectedCompound?.name}.
              </div>

              <div className="compound-zone">
                {droppedAtoms.map((a, i) => (
                  <div key={i} className={`atom-tile ${a.toLowerCase()}`}>
                    {a}
                  </div>
                ))}
                {droppedAtoms.length === 0 && <div className="drop-hint">Drop atoms here</div>}
              </div>

              <div className="atom-bin">
                {["H", "C", "O", "N"].map((atom) => (
                  <div
                    key={atom}
                    className="atom-draggable"
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("text/plain", atom);
                    }}
                    onClick={() => handleDropAtom(atom)}
                  >
                    {atom}
                  </div>
                ))}
              </div>

              <button
                className="complete-btn"
                disabled={!selectedCompound || droppedAtoms.length < selectedCompound.elements.length}
                onClick={() => {
                  setMission(2);
                  setFeedback("");
                }}
              >
                Confirm Structure →
              </button>
            </div>
          )}

          {/* Mission 2 */}
          {mission === 2 && (
            <div className="challenge-panel">
              <h3>Mission 2: Match % Composition</h3>

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
                      {compositionAnswers[el] ? `${compositionAnswers[el]}%` : "Drop % here"}
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

          {/* Mission 3 */}
          {mission === 3 && (
            <div className="challenge-panel">
              <h3>Mission 3: Identify the Highest Contributor</h3>
              <p className="mission-question">
                Which element contributes the most to the total mass of {selectedCompound.name}?
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

          {feedback && <div className="feedback-box">{feedback}</div>}
        </div>
      )}
    </div>
  );
}
