import React, { useState } from "react";
import "../assets/css/MolesToGrams.css";

const MolesToGrams = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState("");

  const correctAnswer = 18; // Example: 1 mole of H2O = 18 grams

  const handleCheck = () => {
    const value = parseFloat(inputValue);
    if (Math.abs(value - correctAnswer) < 0.1) {
      setFeedback("✅ Correct! 1 mole of H₂O has a mass of 18 g.");
      setTimeout(() => setStep(step + 1), 1000);
    } else {
      setFeedback("❌ Try again! Hint: Use the molar mass of H₂O.");
    }
  };

  return (
    <div className="lesson-panel" style={{ "--accent": "#e67e22" }}>
      {step === 0 && (
        <>
          <h2>Moles to Grams Conversion</h2>
          <p>
            Welcome! Let’s convert between moles and grams using molar mass.
          </p>
          <button onClick={() => setStep(1)}>Start Lesson</button>
        </>
      )}

      {step === 1 && (
        <>
          <h3>Example Problem</h3>
          <p>
            How many grams are in <b>1 mole of H₂O</b>?
          </p>
          <input
            type="number"
            placeholder="Enter your answer"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button onClick={handleCheck}>Check</button>
          <div className="feedback">{feedback}</div>
        </>
      )}

      {step === 2 && (
        <>
          <h3>Final Challenge</h3>
          <p>
            If 2.5 moles of CO₂ are present, what is the total mass (in grams)?
            (CO₂ = 44 g/mol)
          </p>
          <input
            type="number"
            placeholder="Enter your answer"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button
            onClick={() => {
              const value = parseFloat(inputValue);
              if (Math.abs(value - 110) < 0.5) {
                setFeedback("🎉 Perfect! 2.5 × 44 = 110 g.");
                setTimeout(() => onComplete(), 1200);
              } else {
                setFeedback("❌ Not quite! Try multiplying 2.5 × 44.");
              }
            }}
          >
            Check
          </button>
          <div className="feedback">{feedback}</div>
        </>
      )}
    </div>
  );
};

export default MolesToGrams;
