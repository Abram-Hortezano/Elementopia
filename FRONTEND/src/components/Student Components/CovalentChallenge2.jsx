// Covalent_ElectronDefense.jsx
import React, { useState, useEffect, useRef } from "react";
import "../../assets/css/ChallengeGames.css";

/*
Tower-defense-like simplified:
- Player places molecules (cards) in center quickly by clicking 'Spawn target'
- Electrons (enemies) spawn at random edges and move toward the molecule slots.
- Player clicks electrons to assign them to an open orbital (one click = captured electron).
- If enough electrons captured for the molecule's valence -> stabilized (points).
- If electron reaches molecule without being captured -> damage (loses life).
*/

const MOLE_TYPES = [
  { name: "H₂", needed: 2 },
  { name: "O₂", needed: 4 }, // two bonds total as pairs -> simplified as 4 electrons needed
  { name: "N₂", needed: 6 },
];

function rand(min,max){ return Math.random()*(max-min)+min; }

export default function CovalentChallenge2({ onComplete }) {
  const [molecules, setMolecules] = useState([]); // {id,type,progress}
  const [electrons, setElectrons] = useState([]); // {id,x,y,dx,dy,targetId,captured}
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const running = useRef(true);
  const uid = useRef(1);

  useEffect(()=> {
    running.current = true;
    const spawnInterval = setInterval(()=> {
      // spawn an electron at random edge
      const angle = rand(0, Math.PI*2);
      const radius = 220;
      const x = 160 + Math.cos(angle)*radius;
      const y = 140 + Math.sin(angle)*radius;
      // pick a target molecule if exists
      const target = molecules.length ? molecules[Math.floor(Math.random()*molecules.length)].id : null;
      setElectrons(prev => [...prev, { id:`e${uid.current++}`, x, y, dx:0, dy:0, targetId: target, captured:false }]);
    }, 1200);

    const tick = setInterval(()=> {
      setElectrons(prev => prev.map(e => {
        // move toward center (x:160,y:140) but if target specified move to that molecule's slot
        let tx = 160, ty = 140;
        if (e.targetId) {
          const m = molecules.find(m=>m.id===e.targetId);
          if (m) { tx = 160; ty = 100 + molecules.indexOf(m)*60; }
        }
        const vx = tx - e.x, vy = ty - e.y;
        const dist = Math.sqrt(vx*vx+vy*vy)||1;
        const speed = 1.6 + (score/100);
        return { ...e, x: e.x + (vx/dist)*speed, y: e.y + (vy/dist)*speed };
      }));
    }, 30);

    return ()=>{ clearInterval(spawnInterval); clearInterval(tick); running.current=false; };
  }, [molecules, score]);

  useEffect(()=> {
    // electron reaching target
    const t = setInterval(()=> {
      setElectrons(prev => {
        const updated = [];
        prev.forEach(e => {
          let reached = false;
          if (e.targetId) {
            const m = molecules.find(m=>m.id===e.targetId);
            if (m) {
              const tx = 160, ty = 100 + molecules.indexOf(m)*60;
              const d = Math.hypot(e.x-tx, e.y-ty);
              if (d < 18 && !e.captured) {
                // hit molecule -> damage
                setLives(l => l-1);
                reached = true;
                setMolecules(ms => ms.map(mm => mm.id===e.targetId ? {...mm, progress: Math.max(0, mm.progress-1)}:mm));
              }
            }
          } else {
            // reaching center damages base
            const d = Math.hypot(e.x-160, e.y-140);
            if (d < 24 && !e.captured) { setLives(l=>l-1); reached = true; }
          }
          if (!reached) updated.push(e);
        });
        return updated;
      });
    }, 200);
    return ()=>clearInterval(t);
  }, [molecules]);

  useEffect(()=> { if (lives<=0) setTimeout(()=>{ alert(`Game Over! Score: ${score}`); if (onComplete) onComplete(); }, 200); }, [lives]);

  function spawnMolecule() {
    const type = MOLE_TYPES[Math.floor(Math.random()*MOLE_TYPES.length)];
    setMolecules(prev => [...prev, { id:`m${uid.current++}`, type: type.name, needed: type.needed, progress:0 }]);
  }

  function captureElectron(eid) {
    setElectrons(prev => {
      const el = prev.find(x=>x.id===eid);
      if (!el) return prev;
      // assign to first open molecule needing electrons
      const idx = molecules.findIndex(m=>m.progress < m.needed);
      if (idx === -1) return prev.filter(x=>x.id!==eid); // nowhere to assign -> consume
      const mid = molecules[idx].id;
      setMolecules(ms => ms.map((m,i)=> i===idx ? {...m, progress: m.progress+1} : m));
      setScore(s=>s+5);
      // check if now completed
      setTimeout(()=> {
        const m = molecules.find(m=>m.id===mid);
        if (m && m.progress+1 >= m.needed) {
          setScore(s=>s+30);
          setMolecules(ms => ms.filter(x=>x.id!==mid));
        }
      }, 80);
      // remove electron
      return prev.filter(x=>x.id!==eid);
    });
  }

  return (
    <div className="game-container">
      <h2>🛡️ Electron Pair Defense</h2>
      <div className="defense-area">
        <div className="defense-hud">
          <div><button className="game-btn" onClick={spawnMolecule}>Spawn Molecule</button></div>
          <div className="score">Score: {score}</div>
          <div className="lives">Lives: {lives}</div>
          <div className="hint">Click an electron to capture it and assign to an unstable molecule.</div>
        </div>
        <div className="defense-board">
          {/* molecules stack */}
          <div className="molecule-stack">
            {molecules.map((m, i)=> (
              <div key={m.id} className="molecule-card">
                <div className="molecule-name">{m.type}</div>
                <div className="progress-bar"><div style={{width: `${(m.progress/m.needed)*100}%`}}/></div>
                <div className="progress-text">{m.progress}/{m.needed}</div>
              </div>
            ))}
          </div>

          {/* electrons */}
          <div className="electron-field">
            {electrons.map(e => (
              <div key={e.id} className="electron" style={{ left: e.x, top: e.y }} onClick={()=>captureElectron(e.id)} />
            ))}
            {/* base center */}
            <div className="base-center">Core</div>
          </div>
        </div>
      </div>
    </div>
  );
}
