import React, { useState } from "react";

const formulas = [
  { question: "Which element contributes most to CO₂'s molar mass?", answer: "Oxygen" },
  { question: "Which compound has a molar mass closest to 180 g/mol?", answer: "Glucose (C₆H₁₂O₆)" },
  { question: "How many grams are in 2 moles of H₂O?", answer: "36.04" },
];

export default function MolarMassChallenge3({ onComplete }) {
  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const check = () => {
    if (input.toLowerCase().includes(formulas[i].answer.toLowerCase()))
      setScore((s) => s + 1);
    if (i < formulas.length - 1) {
      setI(i + 1);
      setInput("");
    } else setDone(true);
  };

  return (
    <div className="lesson-inner">
      <h2>★ Molar Mass Challenge 3: Formula Puzzle</h2>
      {!done ? (
        <>
          <p>{formulas[i].question}</p>
          <input
            type="text"
            placeholder="Your answer..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="check-btn" onClick={check}>Submit</button>
        </>
      ) : (
        <>
          <h3>🎉 Finished!</h3>
          <p>Score: {score}/{formulas.length}</p>
          <button className="complete-btn" onClick={onComplete}>Continue</button>
        </>
      )}
    </div>
  );
}
