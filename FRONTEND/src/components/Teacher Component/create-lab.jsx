import { useState, useEffect } from "react";
import { Copy, Check, User } from "lucide-react";
import "../../assets/css/create-lab.css";
import UserService from "../../services/UserService";
import LaboratoryService from "../../services/LabService";

export default function CreateLaboratory({ onClose, onCreate }) {
  const [laboratoryName, setLaboratoryName] = useState("");
  const [code, setCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [labNameError, setLabNameError] = useState("");
  const [creatorId, setCreatorId] = useState(null);

  const [allUsers, setAllUsers] = useState([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    generateCode();
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const currentUser = await UserService.getCurrentUser();
      const users = await UserService.getAllUsers();
      // Assuming user objects have 'userId', 'firstName', and 'lastName' properties
      setCreatorId(currentUser?.userId || null); // Use userId from currentUser
      setAllUsers(
        users.filter((user) => user.userId !== currentUser?.userId) || []
      ); // Filter by userId
    } catch (error) {
      // Handle error fetching initial data, e.g., show a message to the user
      // console.error("Failed to fetch initial data:", error); // Removed for clean output
    }
  };

  const generateCode = () => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setCode(result);
  };

  const toggleStudentSelection = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async () => {
    if (!laboratoryName) {
      setLabNameError("Laboratory name is required.");
      return;
    }

    try {
      const labData = {
        laboratoryName: laboratoryName,
        labCode: code,
        creatorId: creatorId,
        studentIds: selectedStudentIds,
      };

      console.log(labData);

      await LaboratoryService.createLab(labData);
      alert("Laboratory created successfully!");
      
      // Call the onCreate callback if provided
      if (onCreate) {
        onCreate(labData);
      }
      
      onClose();
    } catch (error) {
      alert("Failed to create laboratory.");
      // console.error("Error creating laboratory:", error); // Removed for clean output
    }
  };

  const handleCancel = () => {
    onClose();
  };

  // Filter users based on search term, using firstName and lastName
  const filteredUsers = allUsers.filter(
    (user) =>
      (user.firstName &&
        user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName &&
        user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="laboratory-container" onClick={(e) => e.stopPropagation()}>
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
          <label>Laboratory Code</label>
          <div className="code-container">
            <div className="code">{code}</div>
            <button onClick={copyCode}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
            </button>
          </div>
          <p>Share this code with your students to join the laboratory</p>
        </div>

        <div className="input-group">
          <label>Select Students</label>
          <input
            type="text"
            placeholder="Search students by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
          <div className="student-list">
            {filteredUsers.length === 0 && (
              <p>
                No users found matching your search or no other users available.
              </p>
            )}
            {filteredUsers.map((user) => (
              <div
                key={user.userId} // Use userId from backend
                className={`student-item ${
                  selectedStudentIds.includes(user.userId) ? "selected" : ""
                }`} // Check against userId
                onClick={() => toggleStudentSelection(user.userId)} // Toggle using userId
              >
                <User size={16} />
                <span>
                  {user.firstName} {user.lastName}
                </span>{" "}
                {/* Display firstName and lastName */}
                {selectedStudentIds.includes(user.userId) && (
                  <Check size={16} />
                )}{" "}
                {/* Check against userId */}
              </div>
            ))}
          </div>
        </div>

        <div className="action-buttons">
          <button className="cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <button className="submit-btn" onClick={handleSubmit}>
            Create Laboratory
          </button>
        </div>
      </div>
    </div>
  );
}