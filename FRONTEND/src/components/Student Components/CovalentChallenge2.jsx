import React, { useState } from "react";
import "../../assets/css/ChallengeGames.css";

const CovalentChallenge2 = ({ onComplete }) => {
  const [atoms, setAtoms] = useState([]);
  const available = ["N", "H", "H", "H"];
  const [msg, setMsg] = useState("");

  const check = () => {
    const mol = atoms.join("");
    if (mol.includes("NHHH")) {
      setMsg("✅ You formed ammonia (NH₃)!");
      setTimeout(() => onComplete && onComplete(), 1500);
    } else setMsg("❌ Try again!");
  };

  return (
    <div className="game-container">
      <h2>🔹 Covalent Challenge 2: Ammonia Builder</h2>
      <p className="subtitle">Create <b>NH₃</b>.</p>
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
export default CovalentChallenge2;
