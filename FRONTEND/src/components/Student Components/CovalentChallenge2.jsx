import React, { useState } from "react";

const pairs = [
  { molecule: "H₂O", bond: "Polar Covalent" },
  { molecule: "O₂", bond: "Nonpolar Covalent" },
  { molecule: "NH₃", bond: "Polar Covalent" },
  { molecule: "CH₄", bond: "Nonpolar Covalent" },
];

export default function CovalentChallenge2({ onComplete }) {
  const [selectedMolecule, setSelectedMolecule] = useState(null);
  const [matches, setMatches] = useState({});
  const [score, setScore] = useState(0);

  const handleMatch = (bond) => {
    if (selectedMolecule) {
      const correct = pairs.find(
        (p) => p.molecule === selectedMolecule && p.bond === bond
      );
      if (correct && !matches[selectedMolecule]) {
        setMatches((prev) => ({ ...prev, [selectedMolecule]: bond }));
        setScore((prev) => prev + 1);
      }
      setSelectedMolecule(null);
    }
  };

  return (
    <div className="lesson-inner">
      <h2>★ Covalent Challenge 2: Match the Bond!</h2>
      <p>Select a molecule, then choose its bond type.</p>

      <div className="matching-container">
        <div className="molecule-column">
          {pairs.map((p) => (
            <button
              key={p.molecule}
              className={`molecule-btn ${selectedMolecule === p.molecule ? "selected" : ""}`}
              onClick={() => setSelectedMolecule(p.molecule)}
            >
              {p.molecule}
            </button>
          ))}
        </div>
        <div className="bond-column">
          {["Polar Covalent", "Nonpolar Covalent"].map((bond) => (
            <button key={bond} className="bond-btn" onClick={() => handleMatch(bond)}>
              {bond}
            </button>
          ))}
        </div>
      </div>

      <p>✅ Matches: {score}/{pairs.length}</p>
      {score === pairs.length && (
        <button className="complete-btn" onClick={onComplete}>
          Finish
        </button>
      )}
    </div>
  );
}
