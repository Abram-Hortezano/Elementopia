import React, { useState, useEffect } from "react";
import "../../assets/css/PercentCompositionChallenge.css";

const compounds = [
  { id: 1, name: "CO₂", correctPercent: "27.3% C, 72.7% O" },
  { id: 2, name: "H₂O", correctPercent: "11.2% H, 88.8% O" },
  { id: 3, name: "CH₄", correctPercent: "75% C, 25% H" },
];

// Extra percent options (distractors)
const percentOptions = [
  "27.3% C, 72.7% O",
  "30% C, 70% O",
  "11.2% H, 88.8% O",
  "10% H, 90% O",
  "75% C, 25% H",
  "70% C, 30% H",
];

function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

const PCChallenge3 = () => {
  const [matches, setMatches] = useState({});
  const [shuffledPercents, setShuffledPercents] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setShuffledPercents(shuffleArray(percentOptions));
  }, []);

  const handleDrop = (compoundName, percent) => {
    const newMatches = { ...matches, [compoundName]: percent };
    setMatches(newMatches);

    // Check if all compounds are correctly matched
    const allCorrect = compounds.every(
      (c) => newMatches[c.name] === c.correctPercent
    );
    setIsCompleted(allCorrect);
  };

  return (
    <div className="pc-challenge-wrapper">
      <div className="pc-challenge-container">
        <h2>Match the Mole!</h2>
        <p className="pc-challenge-desc">
          Match each compound to its correct percent composition.
        </p>

        <div className="pc-match-grid">
          {/* Compounds Column */}
          <div className="pc-compounds-column">
            {compounds.map((c) => (
              <div
                key={c.id}
                className="pc-compound-card"
                draggable
                onDragStart={(e) => e.dataTransfer.setData("compound", c.name)}
              >
                {c.name}
              </div>
            ))}
          </div>

          {/* Percent Options Column */}
          <div className="pc-percents-column">
            {shuffledPercents.map((percent, idx) => (
              <div
                key={idx}
                className="pc-percent-card"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) =>
                  handleDrop(e.dataTransfer.getData("compound"), percent)
                }
              >
                <span
                  className={
                    Object.values(matches).includes(percent) ? "matched" : ""
                  }
                >
                  {percent}
                </span>
              </div>
            ))}
          </div>
        </div>

        {isCompleted && (
          <div className="pc-success-popup">🎊 All matches correct! Well done!</div>
        )}
      </div>
    </div>
  );
};

export default PCChallenge3;
