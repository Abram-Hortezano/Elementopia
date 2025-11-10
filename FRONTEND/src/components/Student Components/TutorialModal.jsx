import React from 'react';
import '../../assets/css/TutorialModal.css'; // This CSS file is unchanged

export default function TutorialModal({ onClose }) {
  return (
    <div className="tutorial-overlay" onClick={onClose}>
      <div className="tutorial-modal" onClick={(e) => e.stopPropagation()}>
        <div className="tutorial-header">
          <h2>Welcome to Your Career!</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="tutorial-body">
          <p>This map is your journey. Here's how to succeed:</p>
          
          <div className="tutorial-steps">
            <div className="tutorial-step">
              <div className="step-number">1</div>
              <div className="step-text">
                <strong>Click an Unlocked Node</strong>
                <p>Your journey begins at the first node. Click any available (non-glowing) node to start a lesson.</p>
              </div>
            </div>
            
            <div className="tutorial-step">
              <div className="step-number">2</div>
              <div className="step-text">
                <strong>Master the Lesson (Complete the 3 Stars)</strong>
                <p>Each lesson has 3 stars to earn. You must master the concept and **earn all 3 stars** to prove your skill.</p>
              </div>
            </div>
            
            <div className="tutorial-step">
              <div className="step-number">3</div>
              <div className="step-text">
                <strong>Unlock the Next Lesson</strong>
                <p>Earning 3 stars on a lesson will automatically unlock the next node in your career path. Good luck!</p>
              </div>
            </div>
          </div>
          
          <button className="start-btn" onClick={onClose}>
            Let's Begin!
          </button>
        </div>
      </div>
    </div>
  );
}