import React, { useState } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import '../assets/css/CovalentBonding.css';

// --- Main Component ---
export default function CovalentBonding({ onComplete }) {
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [atoms, setAtoms] = useState({
        // Tutorial Atoms
        o1: { type: 'oxygen', location: 'bin' },
        h1: { type: 'hydrogen', location: 'bin' },
        h2: { type: 'hydrogen', location: 'bin' },
        // Challenge Atoms
        c1: { type: 'carbon', location: 'challenge-bin' },
        h3: { type: 'hydrogen', location: 'challenge-bin' },
        h4: { type: 'hydrogen', location: 'challenge-bin' },
        h5: { type: 'hydrogen', location: 'challenge-bin' },
        h6: { type: 'hydrogen', location: 'challenge-bin' },
    });
    
    // --- NEW STATE for Challenge Structure ---
    const [challengeSlots, setChallengeSlots] = useState({
        central: null,
        bond1: null,
        bond2: null,
        bond3: null,
        bond4: null,
    });

    const [promptStep, setPromptStep] = useState(0);
    const [challengeStatus, setChallengeStatus] = useState('pending');
    const [activeId, setActiveId] = useState(null);

    const prompts = [
        { title: "Step 1: The Goal", description: "Unlike ionic bonds where electrons are stolen, covalent bonds are about sharing. Our goal is to build a stable water molecule (H₂O)." },
        { title: "Step 2: Place the Central Atom", description: "Oxygen is our central atom because it can make more bonds (2) than Hydrogen (1). Drag the Oxygen atom to the workspace." },
        { title: "Step 3: Add a Hydrogen", description: "Perfect. Now, drag a Hydrogen atom to the workspace to form a bond." },
        { title: "Step 4: Complete the Molecule", description: "Excellent! That's one covalent bond. Now, add the second Hydrogen to complete the water molecule." },
        { title: "Tutorial Complete!", description: "You've formed two covalent bonds (H-O-H). Notice the central atom! Get ready for the challenge." },
        { title: "Challenge: Build Methane (CH₄)", description: "Carbon wants 4 bonds, Hydrogen wants 1. Build Methane (CH₄) by placing the central atom and bonding atoms in their correct slots." }
    ];

    function handleDragStart(event) { setActiveId(event.active.id); }

    function handleDragEnd(event) {
        const { over, active } = event;
        setActiveId(null);
        if (!over) return;
        
        const atomId = active.id;
        const targetZone = over.id; // e.g., "workspace", "bin", "central", "bond1"
        const isChallenge = promptStep >= 5;

        if (isChallenge) {
            // --- NEW CHALLENGE LOGIC ---
            setAtoms(prevAtoms => {
                const newAtoms = { ...prevAtoms };
                // Update atom's location
                newAtoms[atomId] = { ...newAtoms[atomId], location: targetZone };

                setChallengeSlots(prevSlots => {
                    const newSlots = { ...prevSlots };
                    
                    // 1. Clear the slot this atom *used* to be in (if any)
                    Object.keys(newSlots).forEach(key => {
                        if (newSlots[key] === atomId) {
                            newSlots[key] = null;
                        }
                    });

                    // 2. Place atom in new slot (if it's a slot)
                    if (newSlots.hasOwnProperty(targetZone)) {
                        // If slot is full, boot the old atom back to bin
                        if (newSlots[targetZone]) {
                            const oldAtomId = newSlots[targetZone];
                            newAtoms[oldAtomId] = { ...newAtoms[oldAtomId], location: 'challenge-bin' };
                        }
                        // Place the new atom
                        newSlots[targetZone] = atomId;
                    }
                    return newSlots;
                });
                return newAtoms;
            });
        } else {
            // --- ORIGINAL TUTORIAL LOGIC ---
            setAtoms(prevAtoms => {
                const updatedAtoms = { ...prevAtoms, [atomId]: { ...prevAtoms[atomId], location: targetZone } };
                setPromptStep(currentStep => {
                    const placedOxygen = Object.values(updatedAtoms).some(a => a.type === 'oxygen' && a.location === 'workspace');
                    const placedHydrogens = Object.entries(updatedAtoms).filter(([id, atom]) => 
                        atom.type === 'hydrogen' && 
                        atom.location === 'workspace' && 
                        (id === 'h1' || id === 'h2')
                    ).length;
                    if (currentStep === 1 && placedOxygen) return 2;
                    if (currentStep === 2 && placedHydrogens === 1) return 3;
                    if (currentStep === 3 && placedHydrogens === 2) return 4;
                    return currentStep;
                });
                return updatedAtoms;
            });
        }
    }

    const advanceStep = () => setPromptStep(prev => prev + 1);
    
    const beginChallenge = () => {
        setPromptStep(5);
        // Reset tutorial atoms
        setAtoms(prev => ({
            ...prev,
            o1: { ...prev.o1, location: 'bin' },
            h1: { ...prev.h1, location: 'bin' },
            h2: { ...prev.h2, location: 'bin' },
        }));
    };

    function checkMethaneChallenge() {
        // --- NEW CHECK LOGIC ---
        const centralAtomId = challengeSlots.central;
        const isCarbonCentral = centralAtomId && atoms[centralAtomId]?.type === 'carbon';

        const bondedAtomIds = [challengeSlots.bond1, challengeSlots.bond2, challengeSlots.bond3, challengeSlots.bond4];
        const hydrogensBonded = bondedAtomIds.filter(id => id && atoms[id]?.type === 'hydrogen').length;

        if (isCarbonCentral && hydrogensBonded === 4) {
            setChallengeStatus('correct');
        } else {
            setChallengeStatus('incorrect');
            setTimeout(() => setChallengeStatus('pending'), 1500);
        }
    }

    // --- MODIFIED Render Function ---
    const renderAtomsIn = (location) => {
        return Object.entries(atoms)
            .filter(([, a]) => a.location === location)
            .map(([id, a]) => <DraggableAtom key={id} id={id} type={a.type} isHidden={id === activeId} />);
    };
    
    const activeAtomType = activeId ? atoms[activeId].type : null;
    const isChallenge = promptStep >= 5;
    const tutorialComplete = promptStep === 4;

    // Tutorial render logic (unchanged)
    const workspaceAtoms = Object.entries(atoms).filter(([, a]) => a.location === 'workspace');
    const workspaceOxygen = workspaceAtoms.find(([id, a]) => a.type === 'oxygen' && (id === 'o1'));
    const workspaceHydrogens = workspaceAtoms.filter(([id, a]) => a.type === 'hydrogen' && (id === 'h1' || id === 'h2'));

    if (isIntroVisible) {
        return <div className="lesson-modal covalent-bonding"><IntroScreen onStart={() => setIsIntroVisible(false)} /></div>;
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="lesson-modal covalent-bonding">
                <InfoBox key={promptStep} title={prompts[promptStep].title} description={prompts[promptStep].description}/>
                
                {/* --- NEW: Conditional Workspace Rendering --- */}
                {!isChallenge ? (
                    // --- TUTORIAL WORKSPACE (H₂O) ---
                    <DropZone id="workspace" className="workspace">
                        {workspaceHydrogens[0] && <DraggableAtom key={workspaceHydrogens[0][0]} id={workspaceHydrogens[0][0]} type='hydrogen' isHidden={workspaceHydrogens[0][0] === activeId} />}
                        {workspaceOxygen && <DraggableAtom key={workspaceOxygen[0]} id={workspaceOxygen[0]} type='oxygen' isHidden={workspaceOxygen[0] === activeId} />}
                        {workspaceHydrogens[1] && <DraggableAtom key={workspaceHydrogens[1][0]} id={workspaceHydrogens[1][0]} type='hydrogen' isHidden={workspaceHydrogens[1][0] === activeId} />}
                    </DropZone>
                ) : (
                    // --- CHALLENGE WORKSPACE (CH₄) ---
                    <div className="challenge-structure">
                        <DropZone id="central" className="central-slot">
                            {challengeSlots.central && <DraggableAtom id={challengeSlots.central} type={atoms[challengeSlots.central].type} />}
                        </DropZone>
                        <div className="bond-slot-container">
                            <DropZone id="bond1" className="bond-slot top">{challengeSlots.bond1 && <DraggableAtom id={challengeSlots.bond1} type={atoms[challengeSlots.bond1].type} />}</DropZone>
                            <DropZone id="bond2" className="bond-slot left">{challengeSlots.bond2 && <DraggableAtom id={challengeSlots.bond2} type={atoms[challengeSlots.bond2].type} />}</DropZone>
                            <DropZone id="bond3" className="bond-slot right">{challengeSlots.bond3 && <DraggableAtom id={challengeSlots.bond3} type={atoms[challengeSlots.bond3].type} />}</DropZone>
                            <DropZone id="bond4" className="bond-slot bottom">{challengeSlots.bond4 && <DraggableAtom id={challengeSlots.bond4} type={atoms[challengeSlots.bond4].type} />}</DropZone>
                        </div>
                    </div>
                )}
                
                <DropZone id={isChallenge ? 'challenge-bin' : 'bin'} className="parts-bin">
                    <h3>{isChallenge ? 'Challenge Parts' : 'Tutorial Parts'}</h3>
                    {promptStep > 0 && (
                        <div className="atoms-container">
                            {renderAtomsIn(isChallenge ? 'challenge-bin' : 'bin')}
                        </div>
                    )}
                </DropZone>

                <div className="controls-area">
                    {promptStep === 0 && <button onClick={advanceStep} className="next-btn">Let's Start</button>}
                    {tutorialComplete && !isChallenge && <button onClick={beginChallenge} className="begin-challenge-btn">Begin Challenge</button>}
                    {isChallenge && challengeStatus !== 'correct' && <button onClick={checkMethaneChallenge} className={`check-btn ${challengeStatus}`}>{challengeStatus === 'incorrect' ? 'Try Again!' : 'Check My Molecule'}</button>}
                    {challengeStatus === 'correct' && (
                        <div className="success-message">
                            <p>Correct! You built Methane! 🧪</p>
                            <button onClick={onComplete} className="complete-btn">Complete Lesson</button>
                        </div>
                    )}
                </div>
            </div>
            <DragOverlay>{activeId ? (<div className={`atom ${activeAtomType} is-dragging`}></div>) : null}</DragOverlay>
        </DndContext>
    );
}
// --- Reusable Components ---

function IntroScreen({ onStart }) {
    return (
        <div className="intro-screen">
            <h1 className="intro-cb-title">Lesson 3: Covalent Bonding</h1>
            <p className="intro-text">
                Welcome to the world of sharing! Unlike the give-and-take of ionic bonds, covalent bonds are formed when atoms cooperate by sharing their electrons to become stable. Let's build some molecules.
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

// DraggableAtom now accepts 'isHidden' prop to prevent cloning bug
function DraggableAtom({ id, type, isHidden = false }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        visibility: isHidden ? 'hidden' : 'visible',
    };
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`atom ${type}`}></div>
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