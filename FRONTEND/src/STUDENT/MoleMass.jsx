import React, { useState, useEffect } from 'react';
import '../assets/css/MoleMass.css';

// A simple lookup for the atomic masses they'll need.
const periodicTable = {
  H: { name: 'Hydrogen', mass: 1.008 },
  O: { name: 'Oxygen', mass: 15.999 },
  C: { name: 'Carbon', mass: 12.011 },
};

// --- Main Component ---
export default function MoleMass({ onComplete }) {
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  
  // --- PROMPT STEP 0 IS NOW THE HACK SCREEN ---
  // The actual lesson begins at promptStep = 1
  const [promptStep, setPromptStep] = useState(0); 
  
  const [challengeStatus, setChallengeStatus] = useState('pending');
  const [userInputs, setUserInputs] = useState({
    hCount: '', hMass: '',
    oCount: '', oMass: '',
    total: '',
  });

  // --- Guided Lesson Steps (Shifted by 1) ---
  const prompts = [
    { title: "Atom Counting Hack", description: "Review these rules, then click continue to begin the guided calculation." }, 
    
    // [1] Part 1: Deconstruct H₂O (was Step 0)
    { 
      title: "Part 1: Deconstruct H₂O (Water)", 
      description: "Molar Mass is the total mass of one 'mole' of a compound. First, let's break down H₂O. How many Hydrogen (H) atoms and Oxygen (O) atoms do you see?",
      target: { 'hCount': '2', 'oCount': '1' }
    },
    // [2] Part 2: Find Atomic Mass (was Step 1)
    { 
      title: "Part 2: Find Atomic Mass", 
      description: "Great. Now, find the atomic mass for H and O from the periodic table reference. (Round to one decimal place for this lesson).",
      target: { 'hMass': '1.0', 'oMass': '16.0' }
    },
    // [3] Part 3: Calculate Total (was Step 2)
    { 
      title: "Part 3: Calculate Total", 
      description: "Perfect! The formula is: (Atoms of H * Mass of H) + (Atoms of O * Mass of O). What is the total molar mass of H₂O?",
      target: { 'total': '18.0' } // (2 * 1.0) + (1 * 16.0)
    },
    // [4] Challenge Time (was Step 3)
    { 
      title: "Ready for a Challenge?", 
      description: "Excellent! You've calculated the molar mass for water. Now, let's try a new one on your own. Click 'Begin' to reset the calculator.",
      target: null // Just a button
    },
    // [5] Challenge CO₂ (was Step 4)
    { 
      title: "Challenge: Find Molar Mass of CO₂ (Carbon Dioxide)", 
      description: "Use the same steps: 1. Deconstruct, 2. Find Masses, 3. Calculate. What is the molar mass of CO₂? (C = 12.0, O = 16.0)",
      target: null // User will use the 'check' button
    }
  ];

  // Reset inputs for the next step or challenge
  const resetInputs = () => {
    setUserInputs({
      hCount: '', hMass: '',
      oCount: '', oMass: '',
      total: '',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInputs(prev => ({ ...prev, [name]: value }));
  };

  // Check answers for the guided steps
  useEffect(() => {
    if (promptStep < 1 || promptStep > 3) return; // Only check during guided calculation steps (1, 2, 3)

    const currentTarget = prompts[promptStep].target;
    if (!currentTarget) return;

    // Check if all target fields for the current step are filled correctly
    const allTargetsMet = Object.keys(currentTarget).every(key => {
      return userInputs[key].trim() === currentTarget[key];
    });

    if (allTargetsMet) {
      setPromptStep(promptStep + 1); // Advance to next step
      // Don't reset for step 3, as it builds on step 2
      if (promptStep === 2) {
        setUserInputs(prev => ({ ...prev, total: '' })); // Just clear total
      }
    }
  }, [userInputs, promptStep]);

  // Handle the final challenge check
  function checkChallenge() {
    // For CO₂ (Step 5): (1 * 12.0) + (2 * 16.0) = 44.0
    const cCount = userInputs.hCount; // Re-using hCount input for C
    const cMass = userInputs.hMass;   // Re-using hMass input for C
    const oCount = userInputs.oCount;
    const oMass = userInputs.oMass;
    const total = userInputs.total;
    
    if (cCount === '1' && cMass === '12.0' && oCount === '2' && oMass === '16.0' && total === '44.0') {
      setChallengeStatus('correct');
    } else {
      setChallengeStatus('incorrect');
      setTimeout(() => setChallengeStatus('pending'), 1500);
    }
  }

  // Handle the button press between tutorial and challenge
  const startChallenge = () => {
    resetInputs();
    setPromptStep(5); // Go to challenge step 5
  };

  // --- Initial Intro Screen ---
  if (isIntroVisible) {
    return (
      <div className="lesson-modal mole-mass">
        <IntroScreen onStart={() => setIsIntroVisible(false)} />
      </div>
    );
  }
  
  if (promptStep === 0) {
    return (
      <div className="lesson-modal mole-mass">
        <AtomCountingHackScreen onContinue={() => setPromptStep(1)} />
      </div>
    );
  }

  // Determine labels for the challenge step
  const isChallenge = promptStep === 5;
  const formula = isChallenge ? 'CO₂' : 'H₂O';
  const el1 = isChallenge ? 'C' : 'H';
  const el2 = 'O';


  return (
    <div className="lesson-modal mole-mass">
      <InfoBox
        key={promptStep}
        title={prompts[promptStep].title}
        description={prompts[promptStep].description}
      />

      <div className="mole-mass-workspace">
        {/* --- Left Side: Interactive Calculator --- */}
        <div className="calculator-area">
          <h2 className="formula-display">{formula}</h2>
          
          {/* --- Equation Row 1 --- */}
          <div className="equation-row">
            <span>(Atoms of {el1}:</span>
            <input 
              type="text" 
              name="hCount"
              value={userInputs.hCount}
              onChange={handleInputChange}
              disabled={promptStep > 3 && promptStep < 5}
              placeholder="#"
            />
            <span>× Mass of {el1}:</span>
            <input 
              type="text" 
              name="hMass"
              value={userInputs.hMass}
              onChange={handleInputChange}
              disabled={promptStep > 3 && promptStep < 5}
              placeholder="g/mol"
            />
            <span>)</span>
          </div>

          <span className="plus-sign">+</span>
          
          {/* --- Equation Row 2 --- */}
          <div className="equation-row">
            <span>(Atoms of {el2}:</span>
            <input 
              type="text" 
              name="oCount"
              value={userInputs.oCount}
              onChange={handleInputChange}
              disabled={promptStep > 3 && promptStep < 5}
              placeholder="#"
            />
            <span>× Mass of {el2}:</span>
            <input 
              type="text" 
              name="oMass"
              value={userInputs.oMass}
              onChange={handleInputChange}
              disabled={promptStep > 3 && promptStep < 5}
              placeholder="g/mol"
            />
            <span>)</span>
          </div>
          
          <hr className="equals-line" />
          
          {/* --- Total Row --- */}
          <div className="equation-row total-row">
            <span>Total Molar Mass:</span>
            <input 
              type="text" 
              name="total"
              value={userInputs.total}
              onChange={handleInputChange}
              disabled={promptStep > 3 && promptStep < 5}
              placeholder="g/mol"
            />
          </div>
        </div>

        {/* --- Right Side: Periodic Table Reference --- */}
        <PeriodicTableReference periodicTable={periodicTable} />
      </div>

      {/* --- Bottom Controls Area --- */}
      <div className="controls-area">
        {promptStep === 4 && (
            <button onClick={startChallenge} className="begin-challenge-btn">
                Begin Challenge
            </button>
        )}
        {promptStep === 5 && challengeStatus !== 'correct' && (
            <button onClick={checkChallenge} className={`check-btn ${challengeStatus}`}>
                {challengeStatus === 'incorrect' ? 'Try Again!' : 'Check My Calculation'}
            </button>
        )}
        {challengeStatus === 'correct' && (
            <div className="success-message">
                <p>Correct! The molar mass of CO₂ is 44.0 g/mol! 🧪</p>
                <button onClick={onComplete} className="complete-btn">Complete Lesson</button>
            </div>
        )}
      </div>
    </div>
  );
}

function AtomCountingHackScreen({ onContinue }) {
    return (
        <div className="intro-screen hack-screen">
            <h1 className="intro-mm-title">The "Subscript Counter" Hack</h1>
            <p className="intro-text">
                Before you can calculate molar mass, you *must* count the atoms correctly. Review these rules for complex formulas.
            </p>

            <div className="hack-box">
                <h3>1. The Invisible One Rule</h3>
                <p>The subscript is that atom's count. If there is <b><i>no number</i></b> there, the count is simply <b>1</b> (the Invisible One).</p>
                <h4>Example: NaCl</h4> 
                <ul className="hack-list">
                    <b><i>Na</i></b>: No subscript = <b>1</b> atom.<br/>
                    <b><i>Cl</i></b>: No subscript = <b>1</b> atom.
                </ul>
            </div>

            <div className="hack-box">
                <h3>2. The Parenthesis Multiplier Rule</h3>
                <p>If you see parentheses (), the subscript outside acts like a multiplier for <b></b>EVERYTHING inside.</p>
                
                <h4>Example: Al(OH)<sub>3</sub></h4>
                <ul className="hack-list">
                    <b><i>Al</i></b>: <b>1</b> atom (not inside the ()).<br/>
                    <b><i>O</i></b>: Inside (), multiplied by 3 = <b>3</b> atoms.<br/>
                    <b><i>H</i></b>: Inside (), multiplied by 3 = <b>3</b> atoms.
                </ul>
            </div>

            <button onClick={onContinue} className="intro-start-btn">Continue to Lesson</button>
        </div>
    );
}


// --- Reusable Components ---

function IntroScreen({ onStart }) {
  return (
    <div className="intro-screen">
      <h1 className="intro-mm-title">Lesson: Molar Mass</h1>
      <p className="intro-text">
        Atoms are too small to count, so chemists "weigh" them in groups called 'moles'. 
        The Molar Mass is the mass (in grams) of one mole of a substance. Let's learn how to calculate it!
      </p>
      <button onClick={onStart} className="intro-start-btn">Start Lesson</button>
    </div>
  );
}

function InfoBox({ title, description }) {
  return (
    <div className="info-box">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function PeriodicTableReference({ periodicTable }) {
    return (
        <div className="periodic-table-ref">
            <h3>Periodic Table (Atomic Mass)</h3>
            <div className="pt-grid">
                {Object.entries(periodicTable).map(([symbol, data]) => (
                    <div key={symbol} className="pt-cell">
                        <div className="pt-symbol">{symbol}</div>
                        <div className="pt-name">{data.name}</div>
                        <div className="pt-mass">{data.mass}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}