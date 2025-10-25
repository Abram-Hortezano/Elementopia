import React, { useState } from "react";

const quiz = [
  {
    question: "What type of bond is formed when electrons are shared equally?",
    options: ["Ionic Bond", "Polar Covalent Bond", "Nonpolar Covalent Bond", "Metallic Bond"],
    answer: "Nonpolar Covalent Bond",
  },
  {
    question: "Which molecule has a polar covalent bond?",
    options: ["O₂", "H₂O", "N₂", "Cl₂"],
    answer: "H₂O",
  },
  {
    question: "Covalent bonds usually form between what types of elements?",
    options: ["Metal and Nonmetal", "Two Metals", "Two Nonmetals", "Metalloids only"],
    answer: "Two Nonmetals",
  },
];

export default function CovalentChallenge1({ onComplete }) {
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleAnswer = (option) => {
    if (option === quiz[index].answer) setScore((s) => s + 1);
    if (index < quiz.length - 1) setIndex(index + 1);
    else setFinished(true);
  };

  return (
    <div className="lesson-inner">
      <h2>★ Covalent Challenge 1: Bond Type Identifier</h2>
      {!finished ? (
        <>
          <p>{quiz[index].question}</p>
          <div className="options">
            {quiz[index].options.map((opt) => (
              <button key={opt} className="option-btn" onClick={() => handleAnswer(opt)}>
                {opt}
              </button>
            ))}
          </div>
          <p>Question {index + 1}/{quiz.length}</p>
        </>
      ) : (
        <>
          <h3>🎉 Complete!</h3>
          <p>Your score: {score}/{quiz.length}</p>
          <button className="complete-btn" onClick={onComplete}>Continue</button>
        </>
      )}
    </div>
  );
}
