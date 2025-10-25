import React, { useState } from "react";
import "../assets/css/PercentComposition.css";

const PercentComposition = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState("");

  const handleCheck = () => {
    const value = parseFloat(inputValue);
    if (Math.abs(value - 11.1) < 0.2) {
      setFeedback("✅ Correct! Hydrogen makes up about 11.1% of H₂O.");
      setTimeout(() => setStep(2), 1000);
    } else {
      setFeedback("❌ Try again! Hint: (mass of H / molar mass of H₂O) × 100");
    }
  };

  return (
    <div className="lesson-pc-container">
      {step === 0 && (
        <div className="lesson-pc-step">
          <h2>Lesson 6: Percent Composition</h2>
          <p>
            In this lesson, you will learn how to calculate the percent composition of a compound. 
            This tells you what fraction of the total mass comes from each element. Understanding 
            percent composition is essential for chemical analysis, stoichiometry, and formula verification.
          </p>
          <button onClick={() => setStep(1)}>Start Lesson</button>
        </div>
      )}

      {step === 1 && (
        <div className="lesson-pc-step">
          <h3>Example Problem</h3>
          <p>
            What is the percent composition of <b>hydrogen</b> in H₂O? (H = 1, O = 16)
          </p>
          <input
            type="number"
            placeholder="Enter % hydrogen"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleCheck}>Check</button>
          {feedback && <p className="feedback">{feedback}</p>}
        </div>
      )}

      {step === 2 && (
        <div className="lesson-pc-step">
          <h3>Final Challenge</h3>
          <p>
            Determine the percent composition of <b>carbon</b> in CO₂ (C = 12, O = 16)
          </p>
          <input
            type="number"
            placeholder="Enter % carbon"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            onClick={() => {
              const value = parseFloat(inputValue);
              if (Math.abs(value - 27.3) < 0.3) {
                setFeedback("🎉 Correct! 12 ÷ 44 × 100 = 27.3% C.");
                setTimeout(() => onComplete(), 1200);
              } else {
                setFeedback("❌ Try again. Use 12 ÷ 44 × 100.");
              }
            }}
          >
            Check
          </button>
          {feedback && <p className="feedback">{feedback}</p>}
        </div>
      )}
    </div>
  );
};

export default PercentComposition;
