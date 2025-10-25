import React, { useState } from "react";

const quiz = [
  {
    question: "Which compound has the highest molar mass?",
    options: ["H₂", "O₂", "CO₂", "N₂"],
    answer: "CO₂",
  },
  {
    question: "The molar mass of CH₄ is approximately:",
    options: ["12 g/mol", "16 g/mol", "18 g/mol", "20 g/mol"],
    answer: "16 g/mol",
  },
  {
    question: "Which of the following is true about molar mass?",
    options: [
      "It is measured in grams per mole",
      "It depends on the number of moles",
      "It changes with temperature",
      "It has no units",
    ],
    answer: "It is measured in grams per mole",
  },
];

export default function MolarMassChallenge2({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const answer = (opt) => {
    if (opt === quiz[index].answer) setScore((s) => s + 1);
    if (index < quiz.length - 1) setIndex(index + 1);
    else setDone(true);
  };

  return (
    <div className="lesson-inner">
      <h2>★ Molar Mass Challenge 2: Mole Quiz</h2>
      {!done ? (
        <>
          <p>{quiz[index].question}</p>
          {quiz[index].options.map((o) => (
            <button key={o} className="option-btn" onClick={() => answer(o)}>
              {o}
            </button>
          ))}
        </>
      ) : (
        <>
          <h3>🎉 Complete!</h3>
          <p>Your Score: {score}/{quiz.length}</p>
          <button className="complete-btn" onClick={onComplete}>Next</button>
        </>
      )}
    </div>
  );
}
