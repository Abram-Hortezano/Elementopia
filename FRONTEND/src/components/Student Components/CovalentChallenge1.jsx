import React, { useState } from "react";
import "../../assets/css/ChallengeGames.css";

const CovalentChallenge1 = ({ onComplete }) => {
  const [selectedAtoms, setSelectedAtoms] = useState([]);
  const [message, setMessage] = useState("");
  const atoms = ["H", "H", "O", "O", "C", "C"];

  const handleClick = (a) => setSelectedAtoms([...selectedAtoms, a]);

  const check = () => {
    const mol = selectedAtoms.join("");
    if (mol.includes("HHO")) win("H₂O");
    else if (mol.includes("COO")) win("CO₂");
    else setMessage("❌ Invalid molecule, try again!");
  };

  const win = (mol) => {
    setMessage(`✅ You formed ${mol}!`);
    setTimeout(() => onComplete && onComplete(), 1500);
  };

  return (
    <div className="game-container">
      <h2>🧪 Covalent Challenge 1: Bond Builder</h2>
      <p className="subtitle">Form <b>H₂O</b> or <b>CO₂</b>.</p>
      <div className="game-layout">
        <div className="atom-panel">
          <h3>Atoms</h3>
          <div className="atom-grid">
            {atoms.map((a, i) => (
              <div key={i} className={`atom-item atom-${a.toLowerCase()}`} onClick={() => handleClick(a)}>
                {a}
              </div>
            ))}
          </div>
        </div>
        <div className="workspace">
          <h3>Molecule</h3>
          <div className="workspace-display">
            {selectedAtoms.map((a, i) => (
              <div key={i} className="workspace-atom">{a}</div>
            ))}
          </div>
          <div className="workspace-actions">
            <button className="game-btn" onClick={check}>Check</button>
            <button className="game-btn clear" onClick={() => {setSelectedAtoms([]); setMessage("");}}>Clear</button>
          </div>
          {message && <p className="game-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};
export default CovalentChallenge1;
