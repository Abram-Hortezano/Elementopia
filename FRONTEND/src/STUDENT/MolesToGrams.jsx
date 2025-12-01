import React, { useState, useEffect } from "react";
import "../assets/css/MolesToGrams.css";

export default function MolesToGrams({ onComplete = () => {} }) {
  const [step, setStep] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationDone, setAnimationDone] = useState(false);
  const [count, setCount] = useState(0);

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  useEffect(() => {
    if (showAnimation) {
      let c = 0;
      let timeoutId1, timeoutId2;
      
      const interval = setInterval(() => {
        c += 2;
        setCount(c);
        if (c >= 32) {
          clearInterval(interval);
          timeoutId1 = setTimeout(() => {
            setAnimationDone(true);
            // Auto-close after animation completes
            timeoutId2 = setTimeout(() => {
              onComplete();
            }, 2000);
          }, 800);
        }
      }, 200);
      
      return () => {
        clearInterval(interval);
        if (timeoutId1) clearTimeout(timeoutId1);
        if (timeoutId2) clearTimeout(timeoutId2);
      };
    }
  }, [showAnimation]);

  return (
    <div className="lesson-mtg-container">
      {/* ---------- INTRO ---------- */}
      {step === 0 && (
        <div className="lesson-intro">
          <h2>Lesson 5: Moles to Grams Conversion</h2>
          <p>
            Welcome! In this lesson, you will learn how to convert between moles
            and grams using the molar mass of compounds. This is a key skill in
            chemistry because it allows you to calculate the mass of a substance
            from the number of moles, and vice versa.
          </p>

          <div className="intro-actions">
            <button className="start-lesson-btn" onClick={nextStep}>
              Start Lesson
            </button>
          </div>
        </div>
      )}

      {/* ---------- Step 1: Intro to Methane ---------- */}
      {step === 1 && (
        <div className="lesson-mtg-step mtg-card">
          <h3>Example: Methane (CH₄)</h3>
          <p>
            In this guided example, we'll determine the molar mass of methane
            and then convert moles to grams. Methane has the formula{" "}
            <strong>CH₄</strong> — that's 1 Carbon atom and 4 Hydrogen atoms.
          </p>

          <div className="step-controls">
            <button className="nav-btn" onClick={prevStep}>
              Back
            </button>
            <button className="nav-btn" onClick={nextStep}>
              Next Step
            </button>
          </div>
        </div>
      )}

      {/* ---------- Step 2: Build the molecule ---------- */}
      {step === 2 && (
        <div className="lesson-mtg-step mtg-card">
          <h3>Step 1 — Build CH₄ (Visual Breakdown)</h3>
          <p>We'll list each atom and calculate its contribution to molar mass.</p>

          <div className="example-beaker">
            <div className="example-elements">
              <div className="example-tile">C — 12.01 g/mol</div>
              <div className="example-tile">H — 1.008 g/mol</div>
              <div className="example-tile">H — 1.008 g/mol</div>
              <div className="example-tile">H — 1.008 g/mol</div>
              <div className="example-tile">H — 1.008 g/mol</div>
            </div>

            <div className="beaker-example">
              <div className="beaker-title">Assembled: CH₄</div>
              <table className="molar-table">
                <thead>
                  <tr>
                    <th>Element</th>
                    <th>Atomic Mass (g/mol)</th>
                    <th>Quantity</th>
                    <th>Total (g/mol)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>C</td>
                    <td>12.01</td>
                    <td>1</td>
                    <td>12.01</td>
                  </tr>
                  <tr>
                    <td>H</td>
                    <td>1.008</td>
                    <td>4</td>
                    <td>4.032</td>
                  </tr>
                  <tr className="table-total">
                    <td colSpan="3">Molar Mass (CH₄)</td>
                    <td>16.042 g/mol</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="step-controls">
            <button className="nav-btn" onClick={prevStep}>
              Back
            </button>
            <button className="nav-btn" onClick={nextStep}>
              Calculate
            </button>
          </div>
        </div>
      )}

      {/* ---------- Step 3: Conversion + Animation ---------- */}
      {step === 3 && (
        <div className="lesson-mtg-step mtg-card">
          <h3>Step 2 — Convert Moles → Grams</h3>
          {!showAnimation && (
            <>
              <p>
                Use the formula: <code>mass = moles × molar mass</code>
              </p>
              <div className="calculation">
                <p>
                  Example: <strong>2.00 moles</strong> of CH₄ ×{" "}
                  <strong>16.042 g/mol</strong> ={" "}
                  <strong>{(2 * 16.042).toFixed(2)} g</strong>
                </p>
              </div>

              <div className="step-controls">
                <button className="nav-btn" onClick={prevStep}>
                  Back
                </button>
                <button
                  className="nav-btn"
                  onClick={() => setShowAnimation(true)}
                >
                  Show Animation
                </button>
              </div>
            </>
          )}

          {showAnimation && (
            <div className="animation-section fade-in">
              <div className="compound-display">
                <span className="compound-label">Compound: </span>
                <span className="compound-formula">CH₄</span>
                <span className="compound-mass"> (Molar Mass: 16.042 g/mol)</span>
              </div>
              
              <div className="beaker-row">
                <div className="beaker moles">
                  <div className="beaker-label">Moles</div>
                  <div className="moles-display">2.00 mol</div>
                  <div className="liquid-level"></div>
                </div>

                <div className="transfer-arrow">
                  <div className="arrow-head">→</div>
                  <div className="flowing-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                  </div>
                </div>

                <div className="beaker grams">
                  <div className="beaker-label">Grams</div>
                  <div className="grams-display">
                    {count.toFixed(1)} g
                  </div>
                  <div className="liquid-level filling"></div>
                </div>
              </div>

              <p className="formula-float">mass = moles × molar mass</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}