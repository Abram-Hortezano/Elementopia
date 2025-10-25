// Molar_MoleScale.jsx
import React, { useState } from "react";
import "../../assets/css/ChallengeGames.css";

/*
Virtual balance: drag molecule tiles to left or right pan.
We show tilt based on difference.
Molecules are sample cards with known molar masses.
*/

const MOLECULES = [
  { name: "H₂O", mass: 18.015 },
  { name: "CO₂", mass: 44.01 },
  { name: "CH₄", mass: 16.04 },
  { name: "NaCl", mass: 58.44 },
  { name: "O₂", mass: 32.00 },
];

export default function MolarMassChallenge2({ onComplete }) {
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);
  const [target, setTarget] = useState(44); // example target

  function dragStart(e, mol) { e.dataTransfer.setData("molecule", JSON.stringify(mol)); }
  function onDropPan(e, which) {
    e.preventDefault(); const mol = JSON.parse(e.dataTransfer.getData("molecule") || "{}"); if (!mol.name) return;
    if (which==="left") setLeft(prev=>[...prev, mol]);
    else setRight(prev=>[...prev, mol]);
  }

  const leftMass = left.reduce((s,m)=>s+m.mass,0);
  const rightMass = right.reduce((s,m)=>s+m.mass,0);
  const diff = leftMass - rightMass;
  const tilt = Math.max(-20, Math.min(20, diff)); // degrees

  function checkBalance() {
    if (Math.abs((leftMass+rightMass)-target) <= 0.5) {
      alert("Balanced! Target matched. 🎉");
      if (onComplete) onComplete();
    } else alert(`Not balanced to target. Combined mass ${ (leftMass+rightMass).toFixed(2) }`);
  }

  return (
    <div className="game-container">
      <h2>⚖️ Mole Scale Simulator</h2>
      <div className="scale-top">
        <div className="molecule-pallet">
          <h4>Molecules</h4>
          {MOLECULES.map(m=>(
            <div key={m.name} className="molecule-draggable" draggable onDragStart={(e)=>dragStart(e,m)}>
              <div>{m.name}</div><small>{m.mass} g/mol</small>
            </div>
          ))}
        </div>

        <div className="scale-area">
          <div className="scale-target">Target mass (total): <strong>{target} g/mol</strong></div>
          <div className="scale-visual" style={{ transform: `rotate(${tilt}deg)` }}>
            <div className="pan left-pan" onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDropPan(e,"left")}>
              {left.map((m,i)=><div key={i} className="pan-item">{m.name} <small>{m.mass}</small></div>)}
            </div>
            <div className="pivot">⦿</div>
            <div className="pan right-pan" onDragOver={(e)=>e.preventDefault()} onDrop={(e)=>onDropPan(e,"right")}>
              {right.map((m,i)=><div key={i} className="pan-item">{m.name} <small>{m.mass}</small></div>)}
            </div>
          </div>

          <div className="scale-controls">
            <div>Left: {leftMass.toFixed(2)} g/mol — Right: {rightMass.toFixed(2)} g/mol</div>
            <button className="game-btn" onClick={checkBalance}>Check Target</button>
            <button className="game-btn" onClick={()=>{ setLeft([]); setRight([]); }}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
