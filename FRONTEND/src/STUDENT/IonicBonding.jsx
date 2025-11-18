import React, { useState } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import "../assets/css/IonicBonding.css";

// --- Helper to generate the initial state ---
const generateInitialState = () => {
  const atomsConfig = [
    { id: 'na', type: 'sodium', valenceElectrons: 1, location: 'workspace' },
    { id: 'cl', type: 'chlorine', valenceElectrons: 7, location: 'workspace' },
    { id: 'mg', type: 'magnesium', valenceElectrons: 2, location: 'challenge-space' },
    { id: 'o', type: 'oxygen', valenceElectrons: 6, location: 'challenge-space' },
  ];

  const initialState = {};
  let electronCount = 0;

  atomsConfig.forEach(atom => {
    initialState[atom.id] = { type: atom.type, location: atom.location, initialElectrons: atom.valenceElectrons };
    for (let i = 0; i < atom.valenceElectrons; i++) {
      const electronId = `e${electronCount++}`;
      initialState[electronId] = { type: 'electron', location: atom.id, draggable: true };
    }
  });

  return initialState;
};

export default function IonicBonding({ onComplete }) {
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [items, setItems] = useState(generateInitialState);
  const [promptStep, setPromptStep] = useState(0);
  const [challengeStatus, setChallengeStatus] = useState('pending');
  const [activeId, setActiveId] = useState(null);

  const prompts = [
    { title: "Step 1: The Setup", description: "Here are Sodium (Na) and Chlorine (Cl). Experiment by dragging electrons between them. Click 'Next Step' when you're ready." },
    { title: "Step 2: The Transfer", description: "An ionic bond forms when Sodium gives its one outer electron to Chlorine. Place the electron on Chlorine and click 'Next Step'." },
    { title: "Step 3: Ions Form", description: "Perfect! By losing an electron, Sodium becomes a positive ion (Na⁺), and Chlorine becomes a negative ion (Cl⁻). Opposites attract!" },
    { title: "Tutorial Complete!", description: "They snap together to form Sodium Chloride (NaCl)! Get ready for the challenge." },
    { title: "Challenge: Build MgO", description: "Form an ionic bond between Magnesium (Mg) and Oxygen (O). Drag electrons from Magnesium to Oxygen until Oxygen has 8 outer electrons." }
  ];

  function handleDragStart(event) {
    if (items[event.active.id]?.type === 'electron') {
      setActiveId(event.active.id);
    }
  }

  function handleDragEnd(event) {
    const { over, active } = event;
    setActiveId(null);
    if (!over || items[active.id]?.type !== 'electron') return;

    const electronId = active.id;
    const targetId = over.id;

    if (items[targetId]?.type === 'electron') return;

    setItems(prev => ({
      ...prev,
      [electronId]: { ...prev[electronId], location: targetId },
    }));
  }

  const advanceStep = () => {
    const sodiumElectrons = Object.values(items).filter(item => item.type === 'electron' && item.location === 'na').length;

    if (promptStep === 1 && sodiumElectrons > 0) {
      setChallengeStatus('incorrect');
      setTimeout(() => setChallengeStatus('pending'), 1500);
      return;
    }
    setChallengeStatus('pending');
    setPromptStep(prev => prev + 1);
  };

  function checkChallenge() {
    const electronsOnOxygen = Object.values(items).filter(item => item.type === 'electron' && item.location === 'o').length;
    const electronsOnMagnesium = Object.values(items).filter(item => item.type === 'electron' && item.location === 'mg').length;
    
    if (electronsOnOxygen === (items.o.initialElectrons + items.mg.initialElectrons) && electronsOnMagnesium === 0) {
      setChallengeStatus('correct');
    } else {
      setChallengeStatus('incorrect');
      setTimeout(() => setChallengeStatus('pending'), 1500);
    }
  }

  const renderAtomsIn = (location) => {
    return Object.entries(items)
      .filter(([, item]) => item.location === location && item.type !== 'electron')
      .map(([id, item]) => {
        const isFinal =
          (promptStep >= 2 && (item.type === 'sodium' || item.type === 'chlorine')) ||
          (challengeStatus === 'correct' && (item.type === 'magnesium' || item.type === 'oxygen'));

        return (
          <DropZone
            key={id}
            id={id}
            className={`ionic-bonding-atom ${item.type} ${isFinal ? 'final-state' : ''}`}
          >
            <span className="ionic-bonding-symbol">{getSymbol(item.type)}</span>
            {renderElectronsOn(id)}
          </DropZone>
        );
      });
  };

  const renderElectronsOn = (atomId) => {
    const electronsOnThisAtom = Object.entries(items).filter(([, item]) => item.type === 'electron' && item.location === atomId);
    const totalElectrons = electronsOnThisAtom.length;

    return electronsOnThisAtom.map(([id, e], i) => {
      const angle = totalElectrons > 0 ? (i / totalElectrons) * 360 : 0;
      const isHidden = id === activeId;
      return <DraggableElectron key={id} id={id} angle={angle} isHidden={isHidden} isDraggable={e.draggable} />;
    });
  };

  const isChallenge = promptStep >= 4;

  if (isIntroVisible) {
    return (
      <div className="ionic-bonding">
        <IntroScreen onStart={() => setIsIntroVisible(false)} />
      </div>
    );
  }

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="ionic-bonding">
        <InfoBox key={promptStep} title={prompts[promptStep].title} description={prompts[promptStep].description} />

        <div className={`ionicworkspace ${(promptStep >= 2 || challengeStatus === 'correct') ? 'bonded' : ''}`}>
          {!isChallenge && renderAtomsIn('workspace')}
          {isChallenge && renderAtomsIn('challenge-space')}
        </div>

        <div className="controls-area">
          {promptStep < 3 && <button className={`next-btn ${challengeStatus}`} onClick={advanceStep}>Next Step</button>}
          {promptStep === 3 && <button onClick={advanceStep} className="begin-challenge-btn">Begin Challenge</button>}
          {isChallenge && challengeStatus !== 'correct' && <button onClick={checkChallenge} className={`check-btn ${challengeStatus}`}>Check My Bond</button>}
          {challengeStatus === 'correct' && (
            <div className="success-message">
              <p>Correct! You formed Magnesium Oxide! ⚡</p>
              <button onClick={onComplete} className="complete-btn">Complete Lesson</button>
            </div>
          )}
        </div>
      </div>
      <DragOverlay>{activeId ? <div className="electron is-dragging"></div> : null}</DragOverlay>
    </DndContext>
  );
}

// --- Helper Components ---
function IntroScreen({ onStart }) {
  return (
    <div className="intro-screen">
      <h1 className="intro-ib-title">Lesson 2: Ionic Bonding</h1>
      <p className="intro-text">
        Some atoms are givers, and some are takers. You'll see how electron transfer creates ionic bonds.
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
function DraggableElectron({ id, isHidden, angle, isDraggable }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id, disabled: !isDraggable });
  const style = {
    visibility: isHidden ? 'hidden' : 'visible',
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : `rotate(${angle}deg) translate(55px) rotate(-${angle}deg)`,
    cursor: isDraggable ? 'grab' : 'default',
  };
  return <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="electron"></div>;
}
function DropZone({ id, children, className }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return <div ref={setNodeRef} className={`${className} ${isOver ? 'hovering' : ''}`}>{children}</div>;
}

// --- Symbol mapping ---
const getSymbol = (type) => {
  const symbols = { sodium: "Na", chlorine: "Cl", magnesium: "Mg", oxygen: "O" };
  return symbols[type] || "";
};