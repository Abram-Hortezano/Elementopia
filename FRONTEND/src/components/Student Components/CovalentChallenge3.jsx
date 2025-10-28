// Covalent_BondEnergyBreaker.jsx
import React, { useState, useRef, useEffect } from "react";
import "../../assets/css/ChallengeGames.css";

/*
Player holds mouse on a bond to apply energy. When energy reaches threshold, bond breaks.
We show molecule visuals with bonds; each bond has a threshold. After breaking, show energy released.
*/

const MOLECULES = [
  { name: "H₂", atoms: ["H","H"], bonds: [{a:0,b:1, threshold: 40}] },
  { name: "O₂", atoms: ["O","O"], bonds: [{a:0,b:1, threshold: 80}] },
  { name: "N₂", atoms: ["N","N"], bonds: [{a:0,b:1, threshold: 100}] },
  { name: "CH₄", atoms: ["C","H","H","H","H"], bonds: [{a:0,b:1,threshold:30},{a:0,b:2,threshold:30},{a:0,b:3,threshold:30},{a:0,b:4,threshold:30}] },
];

export default function CovalentChallenge3({ onComplete }) {
  const [moleIndex, setMoleIndex] = useState(0);
  const mol = MOLECULES[moleIndex];
  const [bondEnergy, setBondEnergy] = useState({}); // id->value
  const holdRef = useRef(null);
  const [msg, setMsg] = useState("Hold the bond to apply energy and break it!");

  useEffect(()=> { setBondEnergy({}); setMsg(""); const t=setTimeout(()=>setMsg("Hold and apply energy"), 400); return ()=>clearTimeout(t); }, [moleIndex]);

  function startHold(bidx) {
    if (holdRef.current) clearInterval(holdRef.current);
    holdRef.current = setInterval(()=> {
      setBondEnergy(prev => {
        const key = `${moleIndex}-${bidx}`;
        const next = Math.min((prev[key]||0)+4, 140);
        if (next >= mol.bonds[bidx].threshold) {
          // break
          clearInterval(holdRef.current);
          setMsg(`Bond broken! Energy released: ${next} kJ/mol`);
          // remove that bond by marking threshold high so it won't re-break; we simulate break by setting threshold=999
          mol.bonds[bidx].threshold = 999;
          // small reward
          setTimeout(()=> setMoleIndex(i => i < MOLECULES.length-1 ? i+1 : 0), 800);
        }
        return { ...prev, [key]: next };
      });
    }, 120);
  }

  function stopHold() { if (holdRef.current) clearInterval(holdRef.current); }

  return (
    <div className="game-container">
      <h2>💥 Bond Energy Breaker</h2>
      <div className="breaker-area">
        <div className="breaker-left">
          <div className="molecule-preview">
            <div className="molecule-name">{mol.name}</div>
            <div className="atoms-row">
              {mol.atoms.map((a,i)=>
                <div key={i} className="atom-circle">{a}</div>
              )}
            </div>
            <div className="bonds-row">
              {mol.bonds.map((bidx, i) => {
                const key = `${moleIndex}-${i}`;
                const energy = bondEnergy[key] || 0;
                const threshold = mol.bonds[i].threshold;
                return (
                  <div key={i} className="bond-card">
                    <div>Bond {i+1}</div>
                    <div className="energy-bar"><div style={{width: `${Math.min(energy,100)}%`}}/></div>
                    <div className="energy-meta">Applied {Math.round(energy)} / {threshold} </div>
                    <div
                      className="hold-btn"
                      onMouseDown={()=>startHold(i)}
                      onMouseUp={stopHold}
                      onMouseLeave={stopHold}
                      onTouchStart={()=>startHold(i)}
                      onTouchEnd={stopHold}
                    >
                      Hold to Apply Energy
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="breaker-right">
          <div className="msg-box">{msg}</div>
          <div className="controls">
            <button className="game-btn" onClick={()=>setMoleIndex((m)=> (m+1)%MOLECULES.length)}>Next Molecule</button>
            <button className="game-btn" onClick={()=>{ setBondEnergy({}); setMsg("Reset energy"); }}>Reset</button>
          </div>
        </div>
      </div>
    </div>
  );
}
