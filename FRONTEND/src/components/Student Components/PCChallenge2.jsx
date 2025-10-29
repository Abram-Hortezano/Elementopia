import React, { useState, useEffect } from "react";
import "../../assets/css/PercentCompositionChallenge.css";

const ELEMENTS = [
  { symbol: "H", weight: 1.008 },
  { symbol: "O", weight: 16.00 },
];

const TARGET_COMPOSITION = 11.19; // % Hydrogen in H2O

const PCChallenge2 = () => {
  const [molecule, setMolecule] = useState([]);
  const [percentH, setPercentH] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);

  // Add element to molecule
  const addElement = (el) => {
    setMolecule([...molecule, el]);
  };

  // Remove element from molecule
  const removeElement = (index) => {
    const newMolecule = molecule.filter((_, i) => i !== index);
    setMolecule(newMolecule);
  };

  // Calculate % H whenever molecule changes
  useEffect(() => {
    const totalMass = molecule.reduce((sum, el) => sum + el.weight, 0);
    const hMass = molecule
      .filter((el) => el.symbol === "H")
      .reduce((sum, el) => sum + el.weight, 0);
    const percent = totalMass ? ((hMass / totalMass) * 100).toFixed(2) : 0;
    setPercentH(percent);

    if (Math.abs(percent - TARGET_COMPOSITION) <= 0.5 && molecule.length > 0) {
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  }, [molecule]);

  return (
    <div className="pc-challenge-wrapper">
      <div className={`pc-challenge-container ${isCorrect ? "glow-scale" : ""}`}>
        <h2>Weigh the Molecule!</h2>
        <p className="pc-challenge-desc">
          Drag atoms into the molecule to achieve <strong>{TARGET_COMPOSITION}% Hydrogen</strong>.
        </p>

        {/* Elements Palette */}
        <div className="pc-elements-pool">
          {ELEMENTS.map((el, i) => (
            <div
              key={i}
              className="pc-element-tile"
              onClick={() => addElement(el)}
            >
              {el.symbol} ({el.weight})
            </div>
          ))}
        </div>

        {/* Molecule Drop Zone */}
        <div className="pc-drop-zone">
          {molecule.length === 0 && <div className="pc-drop-hint">Click atoms to add them!</div>}
          {molecule.map((el, i) => (
            <div
              key={i}
              className="pc-placed-tile"
              onClick={() => removeElement(i)}
              title="Click to remove"
            >
              {el.symbol}
            </div>
          ))}
        </div>

        {/* Live % Display */}
        <div className="pc-percent-display">
          Hydrogen: <strong>{percentH}%</strong>
        </div>

        {/* Success Popup */}
        {isCorrect && (
          <div className="pc-success-popup">
            💧 Perfect! Hydrogen makes up about {TARGET_COMPOSITION}% of H₂O!
          </div>
        )}
      </div>
    </div>
  );
};

export default PCChallenge2;
