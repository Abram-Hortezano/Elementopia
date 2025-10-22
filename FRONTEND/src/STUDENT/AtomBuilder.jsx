import React, { useState } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import '../assets/css/AtomBuilder.css';

// --- Main Component ---
export default function AtomBuilder({ onComplete }) {
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [particles, setParticles] = useState({
        p1: { type: 'proton', location: 'bin' }, p2: { type: 'proton', location: 'bin' },
        n1: { type: 'neutron', location: 'bin' }, n2: { type: 'neutron', location: 'bin' },
        e1: { type: 'electron', location: 'bin' }, e2: { type: 'electron', location: 'bin' },
    });
    const [promptStep, setPromptStep] = useState(0);
    const [challengeStatus, setChallengeStatus] = useState('pending');
    const [activeId, setActiveId] = useState(null);
    const [tutorialComplete, setTutorialComplete] = useState(false);
    const [mistakeCount, setMistakeCount] = useState(0);
    const DEDUCTION_PER_MISTAKE = 5;

    const prompts = [
        { title: "Step 1: Add a Proton", description: "Protons live in the atom's core, the Nucleus. They have a positive (+) charge and determine what element an atom is. Drag a Proton into the center." },
        { title: "Step 2: Add a Neutron", description: "Excellent. Neutrons also live in the Nucleus. They have no charge and their main job is to add mass and keep the protons from repelling each other." },
        { title: "Step 3: Add an Electron", description: "Great! Electrons are tiny, negatively (-) charged particles that orbit the Nucleus in areas called shells. Drag an Electron to the outer shell." },
        { title: "Tutorial Complete!", description: "You've just built a model of Hydrogen-2. With one proton, it's Hydrogen. The neutron makes it a heavier version. Now, get ready for a challenge." },
        { title: "Challenge: Build Helium", description: "Your turn. Construct a stable Helium atom. It needs 2 Protons, 2 Neutrons, and 2 Electrons." }
    ];

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }

    function handleDragEnd(event) {
        const { over, active } = event;
        setActiveId(null);

        if (!over) return; // Return if dropped on nothing

        const particleId = active.id;
        const targetZone = over.id;

        // Prevent electrons from being dropped in the nucleus
        if (particles[particleId].type === 'electron' && targetZone === 'nucleus') {
            return;
        }

        if (promptStep === 0 && particles[particleId].type === 'proton' && targetZone === 'nucleus') {
            setPromptStep(1);
        } else if (promptStep === 1 && particles[particleId].type === 'neutron' && targetZone === 'nucleus') {
            setPromptStep(2);
        } else if (promptStep === 2 && particles[particleId].type === 'electron' && targetZone === 'shell') {
            setPromptStep(3);
            setTutorialComplete(true);
        }

        setParticles(prev => ({
            ...prev,
            [particleId]: { ...prev[particleId], location: targetZone },
        }));
    }

    const beginChallenge = () => setPromptStep(4);

    function checkHeliumChallenge() {
        const nucleusProtons = Object.values(particles).filter(p => p.location === 'nucleus' && p.type === 'proton').length;
        const nucleusNeutrons = Object.values(particles).filter(p => p.location === 'nucleus' && p.type === 'neutron').length;
        const shellElectrons = Object.values(particles).filter(p => p.location === 'shell' && p.type === 'electron').length;

        if (nucleusProtons === 2 && nucleusNeutrons === 2 && shellElectrons === 2) {
            setChallengeStatus('correct');
        } else {
            setChallengeStatus('incorrect');
            // --- SCORING 1: Increment mistake count on wrong answer ---
            setMistakeCount((prevCount) => prevCount + 1);
            setTimeout(() => setChallengeStatus('pending'), 1500);
        }
    }

    const renderParticlesIn = (location) => {
        const particlesInLocation = Object.entries(particles)
            .filter(([, p]) => p.location === location);

        return particlesInLocation.map(([id, p], index) => (
            <DraggableParticle
                key={id}
                id={id}
                type={p.type}
                isHidden={id === activeId}
                index={location === 'shell' ? index : undefined}
                total={location === 'shell' ? particlesInLocation.length : undefined}
            />
        ));
    };

    const activeParticleType = activeId ? particles[activeId].type : null;

    if (isIntroVisible) {
        return (
            <div className="lesson-modal atom-builder">
                <IntroScreen onStart={() => setIsIntroVisible(false)} />
            </div>
        );
    }    

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="lesson-modal atom-builder">
                <InfoBox
                    key={promptStep}
                   title={prompts[promptStep].title}
                    description={prompts[promptStep].description}
                />
                <div className="atom-diagram">
                   <DropZone id="shell" className="electron-shell">
                        {renderParticlesIn('shell')}
                    </DropZone>
                    <DropZone id="nucleus" className="nucleus">
                       {renderParticlesIn('nucleus')}
                    </DropZone>
                </div>
                <DropZone id="bin" className="parts-bin">
                   <h3>Parts Bin</h3>
                    <div className="particles-container">
                        {renderParticlesIn('bin')}
                    </div>
                </DropZone>
               <div className="controls-area">
                    {tutorialComplete && promptStep === 3 && (
                        <button onClick={beginChallenge} className="begin-challenge-btn">
                            Begin Challenge
                        </button>
                   )}
                    {promptStep === 4 && challengeStatus !== 'correct' && (
                        <button onClick={checkHeliumChallenge} className={`check-btn ${challengeStatus}`}>
                            {challengeStatus === 'incorrect' ? 'Try Again! - Deducted 5 points' : 'Check My Atom'}
                        </button>
                    )}
                    {challengeStatus === 'correct' && (
                        <div className="success-message">
                            <p>Correct! You built Helium! ⚛️</p>
                            {/* --- SCORING 2: Pass calculated deductions to onComplete --- */}
                            <button 
                                onClick={() => onComplete(mistakeCount * DEDUCTION_PER_MISTAKE)} 
                                className="complete-btn">
                                Complete Lesson
                            </button>
                        </div>
                    )}
                </div>
         </div>
            <DragOverlay>
                {activeId ? (
                    <div className={`particle ${activeParticleType} is-dragging`}></div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

// --- Reusable Components ---

function IntroScreen({ onStart }) {
    return (
        <div className="intro-screen">
            <h1 className="intro-ab-title">Lesson 1: The Atom</h1>
            <p className="intro-text">
                Everything in the universe is made of tiny building blocks called atoms. In this lesson, you'll learn about the fundamental particles that make up an atom and build one yourself.
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

function DraggableParticle({ id, type, isHidden, index, total }) {
    const { attributes, listeners, setNodeRef } = useDraggable({ id });

    const particleStyle = {
        visibility: isHidden ? 'hidden' : 'visible',
        position: index !== undefined ? 'absolute' : 'relative',
        top: 'auto',
        left: 'auto',
    };

    // Electron orbit
    if (index !== undefined && total !== undefined) {
        const angle = total > 0 ? (index / total) * 360 : 0;
        const radius = 135;
        const x = radius * Math.cos(angle * Math.PI / 180);
        const y = radius * Math.sin(angle * Math.PI / 180);
        particleStyle.top = `calc(50% + ${y}px - 15px)`;
        particleStyle.left = `calc(50% + ${x}px - 15px)`;
    }

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`particle ${type}`}
            style={particleStyle}
        />
    );
}

function DropZone({ id, children, className }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`${className} ${isOver ? 'hovering' : ''}`}>
            {children}
        </div>
    );
}