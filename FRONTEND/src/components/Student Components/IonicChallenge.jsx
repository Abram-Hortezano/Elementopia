import React, { useState } from "react";
import ChallengeOne from "./IonicChallenge1";
import ChallengeTwo from "./IonicChallenge2";
import ChallengeThree from "./IonicChallenge3";
import "../../assets/css/IonicBonding.css";

export default function IonicChallenge({ onExit }) {
  const [currentChallenge, setCurrentChallenge] = useState(0);

  const challenges = [
    { id: 1, component: <ChallengeOne onNext={() => setCurrentChallenge(1)} /> },
    { id: 2, component: <ChallengeTwo onNext={() => setCurrentChallenge(2)} /> },
    { id: 3, component: <ChallengeThree onNext={() => onExit?.()} /> },
  ];

  return (
    <div className="lesson-modal ionic-bonding">
      <h1 className="intro-ib-title">⚡ Ionic Bonding Practice</h1>
      <p className="intro-text">
        Apply what you’ve learned! Form correct ionic bonds in each challenge.
      </p>
      {challenges[currentChallenge].component}
    </div>
  );
}

