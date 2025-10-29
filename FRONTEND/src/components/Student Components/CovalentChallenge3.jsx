import React, { useState } from "react";
import "../../assets/css/ChallengeGames.css";

const CovalentChallenge3 = ({ onComplete }) => {
  const [atoms, setAtoms] = useState([]);
  const available = ["C", "H", "H", "H", "H"];
  const [msg, setMsg] = useState("");

  const check = () => {
    if (atoms.join("") === "CHHHH") {
      setMsg("✅ You formed methane (CH₄)!");
      setTimeout(() => onComplete && onComplete(), 1500);
    } else setMsg("❌ Try again!");
  };

  return (
    <div className="game-container">
      <h2>💠 Covalent Challenge 3: Methane Maker</h2>
      <p className="subtitle">Form <b>CH₄</b>.</p>
      <div className="game-layout">
        <div className="atom-panel">
          <h3>Atoms</h3>
          <div className="atom-grid">
            {available.map((a, i) => (
              <div key={i} className={`atom-item atom-${a.toLowerCase()}`} onClick={() => setAtoms([...atoms, a])}>{a}</div>
            ))}
          </div>
        </div>
        <div className="workspace">
          <h3>Molecule</h3>
          <div className="workspace-display">
            {atoms.map((a, i) => <div key={i} className="workspace-atom">{a}</div>)}
          </div>
          <div className="workspace-actions">
            <button className="game-btn" onClick={check}>Check</button>
            <button className="game-btn clear" onClick={() => {setAtoms([]); setMsg("");}}>Clear</button>
          </div>
          {msg && <p className="game-message">{msg}</p>}
        </div>
      </div>
    </div>
  );
};
export default CovalentChallenge3;
