import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import "../../assets/css/MolesToGramsChallenge.css";

const TILE_DATA = [
  { id: "H", label: "H", mass: 1.01 },
  { id: "O", label: "O", mass: 16.0 },
  { id: "C", label: "C", mass: 12.01 },
  { id: "Na", label: "Na", mass: 22.99 },
  { id: "Cl", label: "Cl", mass: 35.45 },
];

export default function MolesToGrams2({ onComplete }) {
  const [droppedTiles, setDroppedTiles] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [showConversion, setShowConversion] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState("");

  const handleDragStart = (e) => setActiveId(e.active.id);

  const handleDragEnd = (e) => {
    const { over, active } = e;
    setActiveId(null);
    if (over && over.id === "beaker") {
      const tile = TILE_DATA.find((t) => t.id === active.id);
      setDroppedTiles((prev) => [...prev, tile]);
    }
  };

  const handleCheck = () => {
    const cCount = droppedTiles.filter((t) => t.id === "C").length;
    const oCount = droppedTiles.filter((t) => t.id === "O").length;
    const totalMass = droppedTiles.reduce((sum, t) => sum + t.mass, 0);
    const target = 44.01; // CO₂ molar mass

    if (cCount === 1 && oCount === 2 && Math.abs(totalMass - target) < 0.05) {
      setFeedback("correct");
      setTimeout(() => {
        setFeedback("");
        setShowConversion(true);
      }, 1000);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(""), 1000);
    }
  };

  const handleClear = () => {
    setDroppedTiles([]);
    setFeedback("");
  };

  const handleSubmitAnswer = () => {
    const correctAnswer = 88.02; // 2 mol × 44.01 g/mol
    const userValue = parseFloat(userAnswer);
    if (Math.abs(userValue - correctAnswer) < 0.1) {
      setAnswerFeedback("correct");
      setTimeout(onComplete, 1500);
    } else {
      setAnswerFeedback("wrong");
      setTimeout(() => setAnswerFeedback(""), 1000);
    }
  };

  const totalMass = droppedTiles
    .reduce((sum, t) => sum + t.mass, 0)
    .toFixed(2);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="lesson-mtg-step mtg-challenge-wrapper">
        <div className="mtg-builder">
          <h2>Challenge 2: Carbon Dioxide (CO₂)</h2>
          <p>
            Drag <b>1 C</b> tile and <b>2 O</b> tiles into the beaker to form
            carbon dioxide.
          </p>

          <div className="element-bin">
            <h4>Available Elements</h4>
            <div className="elements-container">
              {TILE_DATA.map((tile) => (
                <DraggableTile key={tile.id} tile={tile} />
              ))}
            </div>
          </div>

          <div className="mtg-beaker-section">
            <Beaker id="beaker" feedback={feedback}>
              {droppedTiles.map((tile, i) => (
                <div key={i} className="element-tile in-beaker">
                  {tile.label}
                </div>
              ))}
            </Beaker>

            <div className="mass-display">
              <h4>Total Mass</h4>
              <div className="mass-value">{totalMass} g/mol</div>
            </div>
          </div>

          <div className="button-group">
            <button onClick={handleCheck} className="check-btn">
              Check Molar Mass
            </button>
            <button onClick={handleClear} className="clear-btn">
              Clear Beaker
            </button>
          </div>

          {showConversion && (
            <div className="conversion-section slide-in">
              <h3>Now convert moles → grams!</h3>
              <p>
                CO₂ has a molar mass of <b>44.01 g/mol</b>.
              </p>
              <p>
                If you have <b>2 moles</b> of CO₂, how many grams is that?
              </p>

              <div className="conversion-input">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter grams"
                  className={`answer-input ${answerFeedback}`}
                />
                <button onClick={handleSubmitAnswer} className="check-btn">
                  Submit
                </button>
              </div>

              {answerFeedback === "correct" && (
                <p className="feedback-text correct">
                  ✅ Correct! 2 mol × 44.01 g/mol = 88.02 g
                </p>
              )}
              {answerFeedback === "wrong" && (
                <p className="feedback-text wrong">
                  ❌ Not quite — try again!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeId && (
          <div className="tile dragging">
            {TILE_DATA.find((t) => t.id === activeId)?.label}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function DraggableTile({ tile }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: tile.id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="element-tile">
      {tile.label}
    </div>
  );
}

function Beaker({ id, children, feedback }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [reacting, setReacting] = useState(false);

  React.useEffect(() => {
    if (children && children.length > 0 && feedback === "") {
      setReacting(true);
      const timer = setTimeout(() => setReacting(false), 800);
      return () => clearTimeout(timer);
    }
  }, [children, feedback]);

  return (
    <div
      ref={setNodeRef}
      className={`beaker-zone ${isOver ? "hovering" : ""} ${
        feedback === "correct"
          ? "beaker-correct"
          : feedback === "wrong"
          ? "beaker-wrong"
          : reacting
          ? "reacting"
          : ""
      }`}
    >
      {children}
    </div>
  );
}
