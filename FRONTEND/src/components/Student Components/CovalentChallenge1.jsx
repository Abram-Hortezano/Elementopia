// Covalent_BondBuilder.jsx
import React, { useState, useRef, useEffect } from "react";
import "../../assets/css/ChallengeGames.css";

/*
Drag atoms from side panel into board.
Click two atoms to form a bond (visual line + bond count).
Targets: H2O, O2, N2, CH4 by simple type-count detection.
*/

const SIDE_ATOMS = [
  { id: "H", valence: 1 },
  { id: "O", valence: 2 },
  { id: "N", valence: 3 },
  { id: "C", valence: 4 },
  { id: "Cl", valence: 1 },
];

const TARGETS = [
  { name: "Water (H₂O)", check: (a) => a.filter(x => x.type==="O").length===1 && a.filter(x=>x.type==="H").length===2 },
  { name: "Oxygen (O₂)", check: (a) => a.filter(x => x.type==="O").length===2 },
  { name: "Nitrogen (N₂)", check: (a) => a.filter(x => x.type==="N").length===2 },
  { name: "Methane (CH₄)", check: (a) => a.filter(x => x.type==="C").length===1 && a.filter(x=>x.type==="H").length===4 },
];

export default function CovalentChallenge1({ onComplete }) {
  const [atoms, setAtoms] = useState([]); // {id, type, x,y,bonds:[]}
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const boardRef = useRef(null);
  const uid = useRef(1);
  const [message, setMessage] = useState("Drag atoms into the board. Click two atoms to bond.");

  useEffect(()=> { if (!message) return; const t=setTimeout(()=>setMessage(""),2500); return ()=>clearTimeout(t); }, [message]);

  const onDragStart = (e, type) => e.dataTransfer.setData("text/plain", type);

  function onDrop(e) {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain");
    if (!type) return;
    const rect = boardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = `a${uid.current++}`;
    setAtoms(prev => [...prev, { id, type, x, y, bonds: [] }]);
  }

  function onAtomClick(id) {
    if (!selected) { setSelected(id); setMessage("Select another atom to form a bond"); return; }
    if (selected === id) { setSelected(null); return; }
    // form bond both directions if not already
    setAtoms(prev => prev.map(a=>{
      if (a.id===selected && !a.bonds.includes(id)) return {...a, bonds:[...a.bonds, id]};
      if (a.id===id && !a.bonds.includes(selected)) return {...a, bonds:[...a.bonds, selected]};
      return a;
    }));
    setSelected(null);
    setScore(s=>s+5);
    setMessage("+5 Bond energy points!");
  }

  function analyze() {
    const snapshot = atoms.map(a=>({type:a.type, bonds:a.bonds.slice()}));
    const found = TARGETS.find(t=>t.check(snapshot));
    if (found) { setScore(s=>s+50); setMessage(`Detected ${found.name}! +50`); setTimeout(()=>{ setAtoms([]); if (onComplete) onComplete(); }, 900); }
    else setMessage("No target yet — try different atoms or count bonds.");
  }

  function clearBoard() { setAtoms([]); setScore(0); setMessage("Board cleared"); }

  return (
    <div className="game-container">
      <h2>⚛️ Bond Builder</h2>
      <div className="game-top-row">
        <div className="side-panel">
          <h4>Atoms</h4>
          <div className="atom-list">
            {SIDE_ATOMS.map(s => (
              <div key={s.id} className="atom-card" draggable onDragStart={(e)=>onDragStart(e, s.id)}>
                <div className={`atom-visual ${s.id.toLowerCase()}`}>{s.id}</div>
                <div className="atom-meta">valence {s.valence}</div>
              </div>
            ))}
          </div>
          <div className="controls">
            <button className="game-btn" onClick={analyze}>Analyze Molecule</button>
            <button className="game-btn" onClick={clearBoard}>Clear</button>
            <div className="score">Score: {score}</div>
          </div>
        </div>

        <div className="board-wrap">
          <div className="bond-board" ref={boardRef} onDragOver={(e)=>e.preventDefault()} onDrop={onDrop}>
            <svg className="bond-svg">
              {atoms.flatMap(a => a.bonds.map(bid => {
                const b = atoms.find(x=>x.id===bid);
                if (!b || a.id > b.id) return null; // draw once
                return <line key={`${a.id}-${b.id}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#8af" strokeWidth={4} strokeLinecap="round" />;
              }))}
            </svg>

            {atoms.map(a => (
              <div key={a.id} className={`workspace-atom ${selected===a.id ? 'selected':''}`} style={{ left: a.x-20, top: a.y-20 }} onClick={()=>onAtomClick(a.id)}>
                <div className={`atom-visual ${a.type.toLowerCase()}`}>{a.type}</div>
                <div className="bond-count">{a.bonds.length}</div>
              </div>
            ))}

            <div className="board-hint">Drop atoms here</div>
          </div>
        </div>
      </div>

      <div className="game-bottom-row">
        <p className="message">{message}</p>
        <div className="target-list">
          <h4>Targets</h4>
          <ul>{TARGETS.map(t=> <li key={t.name}>{t.name}</li>)}</ul>
        </div>
      </div>
    </div>
  );
}
