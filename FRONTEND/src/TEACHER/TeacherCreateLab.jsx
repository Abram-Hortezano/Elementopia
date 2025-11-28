import { useState, useEffect } from "react";
import { X, Plus, User, Copy, Check } from "lucide-react";
import "../assets/css/create-lab.css"; // Keep only one CSS import

export default function TeacherCreateLaboratory({ onClose }) {
  const [laboratoryName, setLaboratoryName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [students, setStudents] = useState([]);
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [labNameError, setLabNameError] = useState("");

  useEffect(() => {
    generateCode();
  }, []);

  const generateCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setCode(result);
  };

  const addStudent = () => {
    if (studentEmail && !students.includes(studentEmail) && validateEmail(studentEmail)) {
      setStudents([...students, studentEmail]);
      setStudentEmail("");
      setEmailError("");
    } else if (!validateEmail(studentEmail)) {
      setEmailError("Please enter a valid email address.");
    }
  };

  const removeStudent = (email) => {
    setStudents(students.filter((student) => student !== email));
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = () => {
    if (!laboratoryName) {
      setLabNameError("Laboratory name is required.");
      return;
    }

    console.log({
      name: laboratoryName,
      students,
      code,
    });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const validateEmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  };

  return (
    <div className="laboratory-container">
      <div className="header">
        <h2>Create New Laboratory</h2>
        <p>Set up a new laboratory for your students to explore chemistry.</p>
      </div>

      <div className="input-group">
        <label htmlFor="name">Laboratory Name</label>
        <input
          id="name"
          type="text"
          placeholder="e.g., Chemistry 101 Lab"
          value={laboratoryName}
          onChange={(e) => {
            setLaboratoryName(e.target.value);
            setLabNameError("");
          }}
        />
        {labNameError && <p className="error-message">{labNameError}</p>}
      </div>

      <div className="input-group">
        <label htmlFor="laboratory">Laboratory Code</label>
        <div className="code-container">
          <div className="code">{code}</div>
          <button onClick={copyCode}>
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </button>
        </div>
        <p>Share this code with your students to join the laboratory</p>
      </div>

      <div className="input-group">
        <label htmlFor="student">Add Students (Optional)</label>
        <div className="student-input">
          <input
            id="student"
            type="email"
            placeholder="student@example.com"
            value={studentEmail}
            onChange={(e) => setStudentEmail(e.target.value)}
          />
          <button onClick={addStudent}>
            <Plus size={15} /> Add
          </button>
        </div>
        {emailError && <p className="error-message">{emailError}</p>}
      </div>

      {students.length > 0 && (
        <div className="student-list">
          <div>
            {students.map((student) => (
              <div key={student} className="student-item">
                <User size={12} />
                {student}
                <button onClick={() => removeStudent(student)}>
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="button-group">
        <button onClick={handleCancel} className="cancel-button">
          Cancel
        </button>
        <button onClick={handleSubmit} className="submit-button">
          Create Laboratory
        </button>
      </div>
    </div>
  );
}
