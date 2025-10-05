import React, { useState } from "react";
import "../assets/css/MoleMass.css";

const atomicWeights = {
  H: 1.008, He: 4.003,
  C: 12.011, N: 14.007, O: 15.999,
  Na: 22.990, Mg: 24.305, Al: 26.982,
  Si: 28.085, P: 30.974, S: 32.06, Cl: 35.45,
  K: 39.098, Ca: 40.078, Fe: 55.845, Cu: 63.546,
  Zn: 65.38, Ag: 107.868, I: 126.904
};

// --- Formula parser (simple regex-based) ---
const parseFormula = (formula) => {
  const regex = /([A-Z][a-z]*)(\d*)/g;
  let match, totalMass = 0;
  while ((match = regex.exec(formula)) !== null) {
    const element = match[1];
    const count = parseInt(match[2] || "1");
    const mass = atomicWeights[element];
    if (!mass) return null; // invalid element
    totalMass += mass * count;
  }
  return totalMass;
};

export default function MolarMassLesson({ onComplete }) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");

  const nextStep = () => setStep((prev) => prev + 1);

  const handleCalculate = () => {
    const value = input.trim();
    const total = parseFormula(value);
    if (total === null) {
      setMessage("⚠️ Invalid formula! Check your capitalization (e.g., H2O, CO2).");
      setResult(null);
    } else {
      setResult(total.toFixed(2));
      setMessage(`✅ Molar Mass of ${value} = ${total.toFixed(2)} g/mol`);
    }
  };

  const handleFinalChallenge = () => {
    const total = parseFormula(input.trim());
    if (total && Math.abs(total - 44.10) < 0.3) {
      setMessage("🎉 Excellent! Propane (C3H8) = 44.10 g/mol");
      setTimeout(() => onComplete(), 1500);
    } else {
      setMessage("❌ Not quite. Try again! (Hint: C₃H₈)");
    }
  };

  return (
    <div className="lesson-container">
      {step === 0 && (
        <div className="lesson-step">
          <h2>Lesson 4: Molar Mass</h2>
          <p>
            The <strong>molar mass</strong> of a compound is the mass (in grams)
            of one mole of its particles. It is found by adding up the atomic
            masses of all atoms in the formula.
          </p>
          <button onClick={nextStep}>Start Example ➡️</button>
        </div>
      )}

      {step === 1 && (
        <div className="lesson-step">
          <h3>Example: H₂O</h3>
          <p>
            H₂O = (2 × 1.008) + (1 × 15.999) = <strong>18.015 g/mol</strong>
          </p>
          <button onClick={nextStep}>Try Your Own ➡️</button>
        </div>
      )}

      {step === 2 && (
        <div className="lesson-step">
          <h3>Try Calculating!</h3>
          <p>Enter a formula (like CO₂, NaCl, C6H12O6):</p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. CO2"
          />
          <button onClick={handleCalculate}>Calculate</button>
          {message && <p className="feedback">{message}</p>}
          {result && <p><strong>Result:</strong> {result} g/mol</p>}
          <button onClick={nextStep}>Next ➡️</button>
        </div>
      )}

      {step === 3 && (
        <div className="lesson-step">
          <h3>Final Challenge 🔥</h3>
          <p>
            Calculate the molar mass of <strong>Propane (C₃H₈)</strong>.
            Type it below and click "Check".
          </p>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="C3H8"
          />
          <button onClick={handleFinalChallenge}>Check</button>
          {message && <p className="feedback">{message}</p>}
        </div>
      )}
    </div>
  );
}
