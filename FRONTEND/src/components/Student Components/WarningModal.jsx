import {React, useState } from 'react';
import '../../assets/css/WarningModal.css'; // We will create this

export default function WarningModal({ onConfirm, onCancel, onDontShowAgain }) {
  const [isChecked, setIsChecked] = useState(false);

  const handleConfirm = () => {
    if (isChecked) {
      onDontShowAgain();
    }
    onConfirm();
  };

  return (
    <div className="warning-overlay">
      <div className="warning-modal">
        <div className="warning-header">
          <h3>Are you sure?</h3>
        </div>
        <div className="warning-body">
          <p>You're about to close the lesson. Your progress on this attempt won't be saved.</p>
          
          <div className="warning-actions">
            <button className="btn-cancel" onClick={onCancel}>
              No, stay here
            </button>
            <button className="btn-confirm" onClick={handleConfirm}>
              Yes, close
            </button>
          </div>
          
          <div className="warning-pref">
            <input 
              type="checkbox" 
              id="dont-show-again"
              checked={isChecked}
              onChange={(e) => setIsChecked(e.target.checked)}
            />
            <label htmlFor="dont-show-again">
              Don't show this warning again
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}