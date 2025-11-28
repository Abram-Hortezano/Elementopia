import { useState, useEffect } from "react";
import { Copy, Check, X, Loader2 } from "lucide-react";
import "../../assets/css/create-lab.css";
import UserService from "../../services/UserService";
import SectionService from "../../services/SectionService"; // Using the new service

export default function CreateLaboratory({ onClose, onCreate }) {
  const [sectionName, setSectionName] = useState("");
  const [sectionCode, setSectionCode] = useState("");
  const [teacherId, setTeacherId] = useState(null);

  // UI States
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateCode();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const teacher = await SectionService.getTeacherId();
      setTeacherId(teacher.teacherId);
    } catch (err) {
      console.error("Auth Error:", err);

      if (err.response?.status === 404) {
        setError("Teacher profile not found.");
      } else {
        setError("Please log in to create a section.");
      }
    }
  };

  const generateCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSectionCode(result);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(sectionCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!sectionName.trim()) {
      setError("Section name is required.");
      return;
    }
    if (!teacherId) {
      setError("Teacher ID missing. Please refresh or log in.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Prepare data for the Service
      const sectionData = {
        sectionName: sectionName,
        sectionCode: sectionCode,
        teacherId: teacherId,
      };

      const result = await SectionService.createSection(sectionData);

      if (onCreate) {
        onCreate(result);
      }
      onClose();
    } catch (err) {
      console.error(err);
      if (err.response?.status === 403) {
        setError("Session expired. Please log out and log in again.");
      } else {
        setError("Failed to create section. Check console.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="laboratory-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="header" style={{ position: "relative" }}>
          <h2>Create New Section</h2>
          <p>Set up a new class section for your students.</p>
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* INPUT: NAME */}
        <div className="input-group">
          <label htmlFor="name">Section Name</label>
          <input
            id="name"
            type="text"
            placeholder="e.g., Chemistry 101 - Period 1"
            value={sectionName}
            onChange={(e) => {
              setSectionName(e.target.value);
              setError("");
            }}
            disabled={isLoading}
          />
        </div>

        {/* INPUT: CODE */}
        <div className="input-group">
          <label>Section Code</label>
          <div className="code-container">
            <div className="code">{sectionCode}</div>
            <button onClick={copyCode} title="Copy Code">
              {copied ? <Check size={18} color="green" /> : <Copy size={18} />}
            </button>
          </div>
          <p style={{ fontSize: "0.8rem", color: "#666", marginTop: "5px" }}>
            Share this code with your students to join the section.
          </p>
        </div>

        {error && (
          <p className="error-message" style={{ color: "red" }}>
            {error}
          </p>
        )}

        {/* ACTIONS */}
        <div className="action-buttons">
          <button className="cancel-btn" onClick={onClose} disabled={isLoading}>
            Cancel
          </button>
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span
                style={{ display: "flex", alignItems: "center", gap: "5px" }}
              >
                <Loader2 className="animate-spin" size={16} /> Creating...
              </span>
            ) : (
              "Create Section"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
