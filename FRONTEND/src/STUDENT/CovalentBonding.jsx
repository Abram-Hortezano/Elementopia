import React, { useState, useEffect } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import '../assets/css/CovalentBonding.css';

// --- Main Component ---
export default function CovalentBonding({ onComplete }) {
    const [isIntroVisible, setIsIntroVisible] = useState(true);
    const [atoms, setAtoms] = useState({
        o1: { type: 'oxygen', location: 'bin' },
        h1: { type: 'hydrogen', location: 'bin' },
        h2: { type: 'hydrogen', location: 'bin' },
        c1: { type: 'carbon', location: 'challenge-bin' },
        h3: { type: 'hydrogen', location: 'challenge-bin' },
        h4: { type: 'hydrogen', location: 'challenge-bin' },
        h5: { type: 'hydrogen', location: 'challenge-bin' },
        h6: { type: 'hydrogen', location: 'challenge-bin' },
    });
    const [promptStep, setPromptStep] = useState(0);
    const [challengeStatus, setChallengeStatus] = useState('pending');
    const [activeId, setActiveId] = useState(null);
<<<<<<< HEAD
    const [tutorialComplete, setTutorialComplete] = useState(false);

    const prompts = [
        { title: "Step 1: The Goal", description: "Unlike ionic bonds where electrons are stolen, covalent bonds are about sharing. Our goal is to build a stable water molecule (H₂O) by sharing electrons." },
        { title: "Step 2: Place the Oxygen", description: "Oxygen is our central atom. It needs two more electrons to have a full outer shell. Drag the large Oxygen atom to the workspace." },
        { title: "Step 3: Add a Hydrogen", description: "Perfect. Now, drag a Hydrogen atom and overlap its shell with the Oxygen's shell. By sharing, both atoms get closer to having a full shell." },
        { title: "Step 4: Complete the Molecule", description: "Excellent! That's one covalent bond. Now, add the second Hydrogen atom to the other side to complete the water molecule." },
        { title: "Tutorial Complete!", description: "You've formed two covalent bonds to create H₂O, one of the most important molecules for life! Get ready for the challenge." },
        { title: "Challenge: Build Methane", description: "Methane (CH₄) is the main component of natural gas. Construct it by forming four covalent bonds between one Carbon atom and four Hydrogen atoms." }
    ];

    // --- THIS IS THE FIX ---
    // We use useEffect to check the game state AFTER atoms have been updated.
    useEffect(() => {
        const placedOxygen = Object.values(atoms).some(a => a.type === 'oxygen' && a.location === 'workspace');
        const placedHydrogens = Object.values(atoms).filter(a => a.type === 'hydrogen' && a.location === 'workspace').length;

        if (promptStep === 1 && placedOxygen) {
            setPromptStep(2);
        } else if (promptStep === 2 && placedHydrogens === 1) {
            setPromptStep(3);
        } else if (promptStep === 3 && placedHydrogens === 2) {
            setPromptStep(4);
            setTutorialComplete(true);
        }
    }, [atoms]); // This effect runs whenever the 'atoms' state changes.

    function handleDragStart(event) {
        setActiveId(event.active.id);
    }
=======

    const prompts = [
        { title: "Step 1: The Goal", description: "Unlike ionic bonds where electrons are stolen, covalent bonds are about sharing. Our goal is to build a stable water molecule (H₂O)." },
        { title: "Step 2: Place the Oxygen", description: "Oxygen is our central atom. Drag the Oxygen atom to the workspace to begin building." },
        { title: "Step 3: Add a Hydrogen", description: "Perfect. Now, drag a Hydrogen atom to the workspace to form a bond." },
        { title: "Step 4: Complete the Molecule", description: "Excellent! That's one covalent bond. Now, add the second Hydrogen to complete the water molecule." },
        { title: "Tutorial Complete!", description: "You've formed two covalent bonds to create H₂O! Get ready for the challenge." },
        { title: "Challenge: Build Methane", description: "Methane (CH₄) is the main component of natural gas. Drag the Carbon and four Hydrogens to the workspace to build it." }
    ];

    function handleDragStart(event) { setActiveId(event.active.id); }
>>>>>>> 452962dd8f3e113f23cebcf2fc5e4b9ac0f81e15

    function handleDragEnd(event) {
        const { over, active } = event;
        setActiveId(null);
        if (!over) return;
        
        const atomId = active.id;
        const targetZone = over.id;
<<<<<<< HEAD

        // The only job here is to update the state. The useEffect will handle the logic.
        setAtoms(prev => ({
            ...prev,
            [atomId]: { ...prev[atomId], location: targetZone },
        }));
    }
    
    const beginChallenge = () => {
        setPromptStep(5);
    };

    function checkMethaneChallenge() {
        const placedCarbon = Object.values(atoms).filter(a => a.type === 'carbon' && a.location === 'workspace').length;
        const placedHydrogens = Object.values(atoms).filter(a => a.type === 'hydrogen' && a.location === 'workspace').length;

        if (placedCarbon === 1 && placedHydrogens === 4) {
=======
    
        // Use callbacks for both state setters to avoid stale state issues
        setAtoms(prevAtoms => {
            const updatedAtoms = { ...prevAtoms, [atomId]: { ...prevAtoms[atomId], location: targetZone } };
    
            // Check for progress based on the freshly updated atoms state
            setPromptStep(currentStep => {
                const placedOxygen = Object.values(updatedAtoms).some(a => a.type === 'oxygen' && a.location === 'workspace');
                // Switched to Object.entries to get the atom's ID for the check
                const placedHydrogens = Object.entries(updatedAtoms).filter(([id, atom]) => 
                    atom.type === 'hydrogen' && 
                    atom.location === 'workspace' && 
                    (id === 'h1' || id === 'h2')
                ).length;
    
                if (currentStep === 1 && placedOxygen) return 2;
                if (currentStep === 2 && placedHydrogens === 1) return 3;
                if (currentStep === 3 && placedHydrogens === 2) return 4;
                
                return currentStep; // No change
            });
    
            return updatedAtoms;
        });
    }

    const advanceStep = () => setPromptStep(prev => prev + 1);
    
    const beginChallenge = () => {
        setPromptStep(5);
        setAtoms(prev => {
            const newAtoms = { ...prev };
            if (newAtoms.o1.location === 'workspace') newAtoms.o1.location = 'bin';
            if (newAtoms.h1.location === 'workspace') newAtoms.h1.location = 'bin';
            if (newAtoms.h2.location === 'workspace') newAtoms.h2.location = 'bin';
            return newAtoms;
        });
    };

    function checkMethaneChallenge() {
        const workspaceHydrogens = Object.entries(atoms).filter(([id, atom]) => atom.location === 'workspace' && id.startsWith('h')).length;
        const workspaceCarbon = Object.entries(atoms).some(([id, atom]) => atom.location === 'workspace' && id.startsWith('c'));

        if (workspaceCarbon && workspaceHydrogens === 4) {
>>>>>>> 452962dd8f3e113f23cebcf2fc5e4b9ac0f81e15
            setChallengeStatus('correct');
        } else {
            setChallengeStatus('incorrect');
            setTimeout(() => setChallengeStatus('pending'), 1500);
        }
    }

    const renderAtomsIn = (location) => {
        return Object.entries(atoms)
            .filter(([, a]) => a.location === location)
<<<<<<< HEAD
            .map(([id, a]) => (
                <DraggableAtom key={id} id={id} type={a.type} isHidden={id === activeId} />
            ));
    };
    
    const activeAtomType = activeId ? atoms[activeId].type : null;
    const isChallenge = promptStep === 5;

    if (isIntroVisible) {
        return (
            <div className="lesson-modal covalent-bonding">
                <IntroScreen onStart={() => setIsIntroVisible(false)} />
            </div>
        );
=======
            .map(([id, a]) => <DraggableAtom key={id} id={id} type={a.type} isHidden={id === activeId} />);
    };
    
    const activeAtomType = activeId ? atoms[activeId].type : null;
    const isChallenge = promptStep >= 5;
    const tutorialComplete = promptStep === 4;

    // Filter atoms in the workspace to control their render order
    const workspaceAtoms = Object.entries(atoms).filter(([, a]) => a.location === 'workspace');
    const workspaceOxygen = workspaceAtoms.find(([id, a]) => a.type === 'oxygen' && (id === 'o1'));
    const workspaceHydrogens = workspaceAtoms.filter(([id, a]) => a.type === 'hydrogen' && (id === 'h1' || id === 'h2'));

    if (isIntroVisible) {
        return <div className="lesson-modal covalent-bonding"><IntroScreen onStart={() => setIsIntroVisible(false)} /></div>;
>>>>>>> 452962dd8f3e113f23cebcf2fc5e4b9ac0f81e15
    }

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="lesson-modal covalent-bonding">
<<<<<<< HEAD
                <InfoBox
                    key={promptStep}
                    title={prompts[promptStep].title}
                    description={prompts[promptStep].description}
                />
                
                <DropZone id="workspace" className="workspace">
                    {renderAtomsIn('workspace')}
=======
                <InfoBox key={promptStep} title={prompts[promptStep].title} description={prompts[promptStep].description}/>
                
                <DropZone id="workspace" className={`workspace ${isChallenge ? 'challenge-grid' : ''}`}>
                    {/* Explicitly render Hydrogens first, then Oxygen, then the other Hydrogen to force H-O-H structure */}
                    {!isChallenge && workspaceHydrogens[0] && <DraggableAtom key={workspaceHydrogens[0][0]} id={workspaceHydrogens[0][0]} type='hydrogen' isHidden={workspaceHydrogens[0][0] === activeId} />}
                    {!isChallenge && workspaceOxygen && <DraggableAtom key={workspaceOxygen[0]} id={workspaceOxygen[0]} type='oxygen' isHidden={workspaceOxygen[0] === activeId} />}
                    {!isChallenge && workspaceHydrogens[1] && <DraggableAtom key={workspaceHydrogens[1][0]} id={workspaceHydrogens[1][0]} type='hydrogen' isHidden={workspaceHydrogens[1][0] === activeId} />}
                    
                    {/* Render challenge atoms normally into the grid */}
                    {isChallenge && renderAtomsIn('workspace')}
>>>>>>> 452962dd8f3e113f23cebcf2fc5e4b9ac0f81e15
                </DropZone>
                
                <DropZone id={isChallenge ? 'challenge-bin' : 'bin'} className="parts-bin">
                    <h3>{isChallenge ? 'Challenge Parts' : 'Tutorial Parts'}</h3>
<<<<<<< HEAD
                    <div className="atoms-container">
                        {renderAtomsIn(isChallenge ? 'challenge-bin' : 'bin')}
                    </div>
                </DropZone>

                <div className="controls-area">
                    {tutorialComplete && promptStep === 4 && (
                        <button onClick={beginChallenge} className="begin-challenge-btn">
                            Begin Challenge
                        </button>
                    )}
                    {promptStep === 5 && challengeStatus !== 'correct' && (
                        <button onClick={checkMethaneChallenge} className={`check-btn ${challengeStatus}`}>
                            {challengeStatus === 'incorrect' ? 'Try Again!' : 'Check My Molecule'}
                        </button>
                    )}
=======
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
>>>>>>> 452962dd8f3e113f23cebcf2fc5e4b9ac0f81e15
                    {challengeStatus === 'correct' && (
                        <div className="success-message">
                            <p>Excellent! You built Methane! 🧪</p>
                            <button onClick={onComplete} className="complete-btn">Complete Lesson</button>
                        </div>
                    )}
                </div>
            </div>
<<<<<<< HEAD
            <DragOverlay>
                {activeId ? (
                    <div className={`atom ${activeAtomType} is-dragging`}></div>
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

// --- Reusable Components (No Changes Below) ---
=======
            <DragOverlay>{activeId ? (<div className={`atom ${activeAtomType} is-dragging`}></div>) : null}</DragOverlay>
        </DndContext>
    );
}
// --- Reusable Components ---
>>>>>>> 452962dd8f3e113f23cebcf2fc5e4b9ac0f81e15

function IntroScreen({ onStart }) {
    return (
        <div className="intro-screen">
<<<<<<< HEAD
            <h1 className="intro-title">Lesson 2: Covalent Bonding</h1>
=======
            <h1 className="intro-cb-title">Lesson 3: Covalent Bonding</h1>
>>>>>>> 452962dd8f3e113f23cebcf2fc5e4b9ac0f81e15
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

function DraggableAtom({ id, type, isHidden }) {
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