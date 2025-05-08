import { useState } from "react";
import {
  Users,
  BookOpen,
  Plus,
  Search,
  Beaker,
  Edit,
  Trash,
  Globe,
  Lock,
  Copy,
  Check,
  UserPlus,
  Settings,
  ArrowLeft,
  FileText,
} from "lucide-react";
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import CreateExperiment from "../STUDENT/create-experiment";
import AddStudentModal from "../STUDENT/add-student-modal";
import StudentProgressModalComponent from "../STUDENT/student-progress-modal"; // Rename for clarity

import "../assets/css/laboratory.css";

export default function Laboratory({ laboratoryId }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [createExperimentModalOpen, setCreateExperimentModalOpen] = useState(false);
  const [addStudentModal, setAddStudentModalOpen] = useState(false);
  const [studentProgressModalOpen, setStudentProgressModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("experiments");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const laboratory = {
    id: laboratoryId,
    name: "Chemistry 101 Laboratory",
    code: "ABC123",
    isPublic: true,
    students: [
      { id: 1, name: "John Doe", email: "john.doe@example.com" },
      { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
      { id: 3, name: "Bob Johnson", email: "bob.johnson@example.com" },
    ],
    experiments: [
      {
        id: 1,
        title: "Acid-Base Titration",
        type: "virtual-lab",
        dueDate: "2023-12-20",
        submissions: 18,
        totalStudents: 24,
      },
      {
        id: 2,
        title: "Periodic Table Quiz",
        type: "quiz",
        dueDate: "2023-12-15",
        submissions: 22,
        totalStudents: 24,
      },
      {
        id: 3,
        title: "Molecular Structure Building",
        type: "molecular-builder",
        dueDate: "2023-12-22",
        submissions: 15,
        totalStudents: 24,
      },
    ],
  };

  const handleCreateExperiment = (data) => {
    console.log("Experiment created:", data);
  };

  const handleAddStudent = (data) => {
    console.log("Students added:", data);
  };

  const viewStudentProgress = (student) => {
    setSelectedStudent(student);
    setStudentProgressModalOpen(true);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(laboratory.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExperimentTypeIcon = (type) => {
    switch (type) {
      case "quiz":
        return <FileText className="icon icon-purple" />;
      case "molecular-builder":
        return <Beaker className="icon icon-pink" />;
      case "virtual-lab":
        return <BookOpen className="icon icon-yellow" />;
      default:
        return <Beaker className="icon icon-default" />;
    }
  };

  const filteredExperiments = searchQuery
    ? laboratory.experiments.filter((exp) =>
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : laboratory.experiments;

  return (
    <div className="lab-container">
      <Navbar />
      <Sidebar open={drawerOpen} handleDrawerOpen={() => setDrawerOpen(true)} handleDrawerClose={() => setDrawerOpen(false)} />

      <div className="lab-header">
        <div>
          <ArrowLeft className="back-icon" />
          <div className="lab-title-group">
            <h1 className="lab-title">{laboratory.name}</h1>
            <p className="lab-subtitle">
              Laboratory Code: <span className="lab-code">{laboratory.code}</span>
              <button onClick={copyCode} className="copy-button">
                {copied ? <Check className="icon-xs" /> : <Copy className="icon-xs" size={20} />}
              </button>
              <span className="lab-status">
                {laboratory.isPublic ? <Globe size={20} className="globe-icon" /> : <Lock className="lock-icon" />} Public
              </span>
            </p>
          </div>
        </div>

        <div className="lab-actions-group">
          <button className="btn-create" onClick={() => setCreateExperimentModalOpen(prev => !prev)}>
            <Plus size={16} /> Create Experiment
          </button>
          <button className="btn-add" onClick={() => setAddStudentModalOpen(prev => !prev)}>
            <UserPlus size={16} /> Add Students
          </button>
          <button className="btn-settings">
            <Settings size={16} /> Settings
          </button>
        </div>
      </div>

      {createExperimentModalOpen && (
        <CreateExperiment isOpen={true} onClose={() => setCreateExperimentModalOpen(false)} onSubmit={handleCreateExperiment} />
      )}
      {addStudentModal && (
        <AddStudentModal isOpen={true} onClose={() => setAddStudentModalOpen(false)} onSubmit={handleAddStudent} />
      )}
      {studentProgressModalOpen && selectedStudent && (
        <StudentProgressModalComponent
          isOpen={true}
          onClose={() => setStudentProgressModalOpen(false)}
          student={selectedStudent}
        />
      )}

      <div className="lab-stats">
        <div className="stat-box">
          <div className="stats">
            <p>Total Students</p>
            <h2>{laboratory.students.length}</h2>
          </div>
          <Users color="#9c83ff" size={40} />
        </div>
        <div className="stat-box">
          <div className="stats">
            <p>Total Experiments</p>
            <h2>{laboratory.experiments.length}</h2>
          </div>
          <Beaker color="#e151ff" size={40} />
        </div>
        <div className="stat-box">
          <div className="stats">
            <p>Avg. Completion Rate</p>
            <h2>
              {Math.round(
                (laboratory.experiments.reduce((acc, exp) => acc + exp.submissions, 0) /
                  (laboratory.experiments.length * laboratory.students.length)) *
                  100
              )}%
            </h2>
          </div>
          <BookOpen color="#fff759" size={40} />
        </div>
      </div>

      <div className="lab-management">
        <div className="lab-management-header">
          <div>
            <h2>Laboratory Management</h2>
            <p>Manage experiments and students</p>
          </div>
          <div className="search-bar">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="tabs">
          <button className={`tab ${activeTab === "experiments" ? "active" : ""}`} onClick={() => setActiveTab("experiments")}>
            Experiments
          </button>
          <button className={`tab ${activeTab === "students" ? "active" : ""}`} onClick={() => setActiveTab("students")}>
            Students
          </button>
        </div>

        {activeTab === "experiments" && (
          <div className="experiment-list">
            {filteredExperiments.map((exp) => (
              <div className="experiment-card" key={exp.id}>
                <div className="experiment-icon">{getExperimentTypeIcon(exp.type)}</div>
                <div className="experiment-content">
                  <h3 className="experiment-title">{exp.title}</h3>
                  <p className="experiment-type">{exp.type.replace(/-/g, " ")}</p>
                </div>
                <div className="experiment-meta">
                  <p><strong>Due:</strong> {exp.dueDate}</p>
                  <p><strong>Submissions:</strong> {exp.submissions}/{exp.totalStudents}</p>
                </div>
                <div className="experiment-actions">
                  <button className="edit-btn"><Edit size={16} /> Edit</button>
                  <button className="delete-btn"><Trash size={16} /> Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "students" && (
          <div className="student-list">
            {laboratory.students.map((student) => (
              <div className="student-card-wrapper" key={student.id}>
                <div className="student-card">
                  <p className="student-name">{student.name}</p>
                  <p className="student-email">{student.email}</p>
                </div>
                <div className="students-actions">
                  <button className="btn-view-progress" onClick={() => viewStudentProgress(student)}>
                    <FileText size={16} /> View Progress
                  </button>
                  <button className="btn-remove-student">
                    <Trash size={16} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
