import React, { useState } from "react";
import { X, Plus, User, Mail, Search } from "lucide-react";
import "../assets/css/add-student-modal.css";

export default function AddStudentModal({ isOpen, onClose, onSubmit, laboratoryId }) {
  const [studentEmail, setStudentEmail] = useState("");
  const [emails, setEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const suggestedStudents = [
    { id: 1, name: "Alice Johnson", email: "alice.johnson@example.com" },
    { id: 2, name: "Bob Smith", email: "bob.smith@example.com" },
    { id: 3, name: "Carol Williams", email: "carol.williams@example.com" },
    { id: 4, name: "David Brown", email: "david.brown@example.com" },
  ];
console.log("test");
  const filteredStudents = searchQuery
    ? suggestedStudents.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : suggestedStudents;

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const addEmail = () => {
    if (studentEmail && !emails.includes(studentEmail) && validateEmail(studentEmail)) {
      setEmails([...emails, studentEmail]);
      setStudentEmail("");
    }
  };

  const addSuggestedStudent = (email) => {
    if (!emails.includes(email)) setEmails([...emails, email]);
  };

  const removeEmail = (email) => {
    setEmails(emails.filter((e) => e !== email));
  };

  const handleSubmit = () => {
    if (emails.length > 0) {
      onSubmit?.({ emails });
      onClose();
    }
  };

//   if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Add Students to Laboratory</h2>
        <p className="modal-description">Invite students to join your laboratory</p>

        <div className="field-group">
          <label htmlFor="student-email">Student Email</label>
          <div className="email-input-row">
            <input
              id="student-email"
              type="email"
              placeholder="student@example.com"
              value={studentEmail}
              onChange={(e) => setStudentEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addEmail()}
            />
            <button onClick={addEmail} className="icon-button">
              <Plus size={16} /> Add
            </button>
          </div>
        </div>

        {emails.length > 0 && (
          <div className="field-group">
            <label>Student List</label>
            <div className="email-list">
              {emails.map((email) => (
                <span className="email-badge" key={email}>
                  <Mail size={12} /> {email}
                  <button className="remove-btn" onClick={() => removeEmail(email)}>
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="field-group">
          <label>Suggested Students</label>
          <div className="search-bar">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="suggested-list">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <div className="suggested-item" key={student.id}>
                  <div className="student-info">
                    <div className="student-avatar">
                      <User size={14} />
                    </div>
                    <div>
                      <p className="student-name">{student.name}</p>
                      <p className="student-email">{student.email}</p>
                    </div>
                  </div>
                  <button
                    className="icon-button small"
                    onClick={() => addSuggestedStudent(student.email)}
                    disabled={emails.includes(student.email)}
                  >
                    {emails.includes(student.email) ? "Added" : "Add"}
                  </button>
                </div>
              ))
            ) : (
              <p className="empty-state">No students found</p>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="outline-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="primary-btn"
            onClick={handleSubmit}
            disabled={emails.length === 0}
          >
            Invite Students
          </button>
        </div>
      </div>
    </div>
  );
}
