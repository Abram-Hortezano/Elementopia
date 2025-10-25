import React, { useState } from "react";
import { DndContext, useDroppable, useDraggable, DragOverlay } from "@dnd-kit/core";

export default function ChallengeThree({ onNext }) {
  const [items, setItems] = useState({
    k: { type: "potassium" },
    br: { type: "bromine" },
    e1: { type: "electron", location: "k" },
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
    const eOnBr = Object.values(items).filter((i) => i.type === "electron" && i.location === "br").length;
    if (eOnBr === 1) setStatus("correct");
    else {
      setStatus("incorrect");
      setTimeout(() => setStatus("pending"), 1200);
    }
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="challenge-box">
        <h3>Challenge 3: Form Potassium Bromide (KBr)</h3>
        <p>Transfer one electron from Potassium (K) to Bromine (Br).</p>
        <div className="workspace">
          <DropZone id="k" className="atom potassium">
            {renderElectronsOn("k", items, activeId)}
          </DropZone>
          <DropZone id="br" className="atom bromine">
            {renderElectronsOn("br", items, activeId)}
          </DropZone>
        </div>

        {status === "correct" ? (
          <div className="success-message">
            <p>✅ Nice! K⁺ and Br⁻ form Potassium Bromide!</p>
            <button onClick={onNext}>Finish</button>
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
