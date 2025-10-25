import React, { useState } from "react";

const questions = [
  { compound: "H₂O", answer: 18.02 },
  { compound: "CO₂", answer: 44.01 },
  { compound: "NaCl", answer: 58.44 },
];

export default function MolarMassChallenge1({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const check = () => {
    if (Math.abs(parseFloat(input) - questions[index].answer) < 0.2)
      setScore((s) => s + 1);
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setInput("");
    } else setDone(true);
  };

  return (
    <div className="lesson-inner">
      <h2>★ Molar Mass Challenge 1: Quick Calculate</h2>
      {!done ? (
        <>
          <p>Find molar mass of <b>{questions[index].compound}</b></p>
          <input
            type="number"
            placeholder="Enter molar mass (g/mol)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="check-btn" onClick={check}>Check</button>
          <p>Score: {score}</p>
        </>
      ) : (
        <>
          <h3>🎉 Done!</h3>
          <p>Final Score: {score}/{questions.length}</p>
          <button className="complete-btn" onClick={onComplete}>Continue</button>
        </>
      )}
    </div>
  );
}
