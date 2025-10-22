import React, { useState } from "react";
import { DndContext, useDroppable, useDraggable, DragOverlay } from "@dnd-kit/core";

export default function ChallengeOne({ onNext }) {
  const [items, setItems] = useState({
    na: { type: "sodium" },
    cl: { type: "chlorine" },
    e1: { type: "electron", location: "na" },
  });
  const [activeId, setActiveId] = useState(null);
  const [status, setStatus] = useState("pending");

  const handleDragStart = (event) => {
    if (items[event.active.id].type === "electron") setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || !items[active.id]) return;
    setItems((prev) => ({ ...prev, [active.id]: { ...prev[active.id], location: over.id } }));
  };

  const checkBond = () => {
    const electronOnCl = Object.values(items).filter(
      (item) => item.type === "electron" && item.location === "cl"
    ).length;
    if (electronOnCl === 1) setStatus("correct");
    else {
      setStatus("incorrect");
      setTimeout(() => setStatus("pending"), 1200);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="challenge-box">
        <h3>Challenge 1: Form Sodium Chloride (NaCl)</h3>
        <p>Drag the electron from Sodium (Na) to Chlorine (Cl).</p>
        <div className="workspace">
          <DropZone id="na" className="atom sodium">
            {renderElectronsOn("na", items, activeId)}
          </DropZone>
          <DropZone id="cl" className="atom chlorine">
            {renderElectronsOn("cl", items, activeId)}
          </DropZone>
        </div>

        {status === "correct" ? (
          <div className="success-message">
            <p>✅ Great job! Na⁺ and Cl⁻ form NaCl!</p>
            <button onClick={onNext}>Next Challenge</button>
          </div>
        ) : (
          <button onClick={checkBond} className={`check-btn ${status}`}>
            Check
          </button>
        )}
      </div>
      <DragOverlay>
        {activeId ? <div className="electron is-dragging"></div> : null}
      </DragOverlay>
    </DndContext>
  );
}

function DropZone({ id, children, className }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return <div ref={setNodeRef} className={`${className} ${isOver ? "hovering" : ""}`}>{children}</div>;
}

function renderElectronsOn(atomId, items, activeId) {
  return Object.entries(items)
    .filter(([_, i]) => i.type === "electron" && i.location === atomId)
    .map(([id]) => {
      const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
      const style = {
        transform: transform
          ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
          : `rotate(${Math.random() * 360}deg) translate(55px)`,
        visibility: id === activeId ? "hidden" : "visible",
      };
      return <div key={id} ref={setNodeRef} {...listeners} {...attributes} style={style} className="electron" />;
    });
}
