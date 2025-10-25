import React, { useState } from "react";

const questions = [
  { q: "In H₂, how many electrons are shared?", a: "2" },
  { q: "In O₂, how many electrons are shared?", a: "4" },
  { q: "In N₂, how many electrons are shared?", a: "6" },
];

export default function CovalentChallenge3({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const check = () => {
    if (input === questions[index].a) setScore((s) => s + 1);
    if (index < questions.length - 1) {
      setIndex(index + 1);
      setInput("");
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="lesson-inner">
      <h2>★ Covalent Challenge 3: Electron Sharing Puzzle</h2>
      {!finished ? (
        <>
          <p>{questions[index].q}</p>
          <input
            type="text"
            placeholder="Enter number of shared electrons"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="check-btn" onClick={check}>Submit</button>
        </>
      ) : (
        <>
          <h3>🎉 Done!</h3>
          <p>Your score: {score}/{questions.length}</p>
          <button className="complete-btn" onClick={onComplete}>Next</button>
        </>
      )}
    </div>
  );
}
