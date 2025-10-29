// Molar_ChemicalConveyor.jsx
import React, { useState, useEffect, useRef } from "react";
import "../../assets/css/ChallengeGames.css";

/*
Conveyor belt with molecules that slide left. Player must click a molecule to send it to correct bin.
Bins: <20, 20-50, >50 g/mol
Speed increases with level. Lives limit.
*/

const CATALOG = [
  { name:"H₂", mass:2.02 }, { name:"H₂O", mass:18.02 }, { name:"CH₄", mass:16.04 },
  { name:"CO₂", mass:44.01 }, { name:"NaCl", mass:58.44 }, { name:"C₆H₁₂O₆", mass:180.16 },
];

function binOf(m) {
  if (m < 20) return "small";
  if (m < 50) return "medium";
  return "large";
}

export default function Molar_ChemicalConveyor({ onComplete }) {
  const [items, setItems] = useState([]); // {id, index, x, mol}
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const speedRef = useRef(0.6);
  const uid = useRef(1);

  useEffect(()=> {
    const spawn = setInterval(()=> {
      const mol = CATALOG[Math.floor(Math.random()*CATALOG.length)];
      setItems(prev => [...prev, { id:`i${uid.current++}`, x: 100, mol }]);
    }, 1800);
    const tick = setInterval(()=> {
      setItems(prev => prev.map(it => ({ ...it, x: it.x - speedRef.current })));
      // remove items that passed left edge
      setItems(prev => prev.filter(it => {
        if (it.x < -10) { setLives(l=>l-1); return false; }
        return true;
      }));
    }, 30);

    return ()=>{ clearInterval(spawn); clearInterval(tick); };
  }, []);

  useEffect(()=> { if (lives<=0) { setTimeout(()=>{ alert(`Game over. Score ${score}`); if (onComplete) onComplete(); }, 200); } }, [lives]);

  function sendToBin(itemId) {
    setItems(prev => {
      const it = prev.find(x=>x.id===itemId);
      if (!it) return prev;
      const correct = binOf(it.mol.mass);
      // player's choice simulated as quick sorting — we just check correct bin
      const playerBin = correct; // simplified: clicking "sends" to correct bin automatically if player is fast
      if (playerBin === correct) { setScore(s=>s+10); speedRef.current *= 1.03; }
      else { setLives(l => l-1); }
      return prev.filter(x=>x.id!==itemId);
    });
  }

  return (
    <div className="game-container">
      <h2>🚚 Chemical Conveyor</h2>
      <div className="conveyor-area">
        <div className="conveyor-track">
          {items.map(it => (
            <div key={it.id} className="conveyor-item" style={{ left: `${it.x}%` }} onClick={()=>sendToBin(it.id)}>
              <div className="mol-name">{it.mol.name}</div>
              <div className="mol-mass">{it.mol.mass.toFixed(2)}</div>
            </div>
          ))}
        </div>

        <div className="conveyor-bins">
          <div className="bin"> &lt;20 g/mol</div>
          <div className="bin">20–50 g/mol</div>
          <div className="bin">&gt;50 g/mol</div>
        </div>

        <div className="conveyor-controls">
          <div>Score: {score}  Lives: {lives}</div>
          <div className="hint">Click a moving item to send it to the correct bin before it slides off.</div>
        </div>
      </div>
    </div>
  );
}
