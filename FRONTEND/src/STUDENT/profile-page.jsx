import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import {
  User,
  Mail,
  Book,
  Award,
  Settings,
  Edit,
  LogOut,
  Lock,
  Bell,
  Shield,
  Save,
  X,
  Beaker,
  Atom,
} from "lucide-react";
import "../pages/profile-page.css";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    bio: "",
    school: "",
    grade: "",
    role: "",
  });

  const [achievements] = useState([
    {
      id: 1,
      name: "Element Master",
      description: "Learned about 10 elements",
      progress: 100,
      icon: Atom,
    },
    {
      id: 2,
      name: "Molecule Builder",
      description: "Created 5 molecules",
      progress: 60,
      
      icon: Beaker,
    },
    {
      id: 3,
      name: "Quiz Champion",
      description: "Completed 3 quizzes with perfect score",
      progress: 30,
      icon: Book,
    },
  ]);

  const [stats] = useState([
    { label: "Experiments Completed", value: 24 },
    { label: "Elements Discovered", value: 18 },
    { label: "Achievements", value: 12 },
    { label: "Labs Joined", value: 5 },
  ]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await UserService.getCurrentUser();
        setUserData({
          id: user.userId,
          name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          email: user.email || "",
          bio: user.bio || "",
          school: user.school || "",
          grade: user.gradeLevel || "",
          role: user.role || "Student",
        });
        console.log("id: ", user.userId);
      } catch (error) {
        console.error("Error loading user data:", error);
        navigate("/login");
      }
    };
    fetchUserData();
  }, [navigate]);

  const handleSaveProfile = async () => {
    try {
      if (!userData.id) throw new Error("No user ID available");

      const updateData = {
        firstName: userData.name.split(" ")[0],
        lastName: userData.name.split(" ").slice(1).join(" "),
        email: userData.email,
        bio: userData.bio,
        school: userData.school,
        gradeLevel: userData.grade,
      };

      const response = await UserService.updateProfile(userData.id, updateData);
      console.log("Update response:", response);

      // Refresh user data after update
      const updatedUser = await UserService.getCurrentUser();
      setUserData({
        ...userData,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        grade: updatedUser.gradeLevel,
      });

      alert("Profile updated successfully!");
      setEditMode(false);
    } catch (error) {
      console.error("Full error:", error);
      alert(`Update failed: ${error.message}`);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );

    if (isConfirmed) {
      try {
        await UserService.deleteUser(userData.id);
        UserService.logout();
        navigate("/login");
      } catch (error) {
        console.error("Account deletion failed:", error);
        alert("Failed to delete account. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    UserService.logout();
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <Navbar />
      <Sidebar />

      <div className="profile-header">
        <h1 className="profile-title">My Profile</h1>
        <div className="profile-actions">
          {!editMode ? (
            <button onClick={() => setEditMode(true)} className="edit-button">
              <Edit className="button-icon" /> Edit Profile
            </button>
          ) : (
            <div className="edit-actions">
              <button
                onClick={() => setEditMode(false)}
                className="cancel-button"
              >
                <X className="button-icon" /> Cancel
              </button>
              <button onClick={handleSaveProfile} className="save-button">
                <Save className="button-icon" /> Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="profile-card">
            <div className="profile-info">
              <h2 className="profile-name">{userData.name}</h2>
              <p className="profile-role">{userData.role}</p>
            </div>
            <div className="profile-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <p className="stat-value">{stat.value}</p>
                  <p className="stat-label">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="profile-navigation">
            <button
              className={`nav-button ${
                activeTab === "profile" ? "active" : ""
              }`}
              onClick={() => setActiveTab("profile")}
            >
              <User className="nav-icon" />
              <span>Profile Information</span>
            </button>
            <button
              className={`nav-button ${
                activeTab === "achievements" ? "active" : ""
              }`}
              onClick={() => setActiveTab("achievements")}
            >
              <Award className="nav-icon" />
              <span>Achievements</span>
            </button>
            <button
              className={`nav-button ${
                activeTab === "settings" ? "active" : ""
              }`}
              onClick={() => setActiveTab("settings")}
            >
              <Settings className="nav-icon" />
              <span>Account Settings</span>
            </button>
            <button className="logout-button" onClick={handleLogout}>
              <LogOut className="nav-icon" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="profile-main">
          {activeTab === "profile" && (
            <div className="profile-section">
              <h2 className="section-title">Profile Information</h2>
              <div className="profile-form">
                <div className="form-group">
                  <label className="form-label">
                    <User className="form-icon" />
                    Full Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="name"
                      value={userData.name}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="form-value">{userData.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Mail className="form-icon" />
                    Email Address
                  </label>
                  {editMode ? (
                    <input
                      type="email"
                      name="email"
                      value={userData.email}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="form-value">{userData.email}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Book className="form-icon" />
                    School
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="school"
                      value={userData.school}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="form-value">{userData.school}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <Award className="form-icon" />
                    Grade/Year
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      name="grade"
                      value={userData.grade}
                      onChange={handleInputChange}
                      className="form-input"
                    />
                  ) : (
                    <p className="form-value">{userData.grade}</p>
                  )}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">Bio</label>
                  {editMode ? (
                    <textarea
                      name="bio"
                      value={userData.bio}
                      onChange={handleInputChange}
                      className="form-textarea"
                      rows="4"
                    />
                  ) : (
                    <p className="form-value">{userData.bio}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === "achievements" && (
            <div className="profile-section">
              <h2 className="section-title">My Achievements</h2>
              <div className="achievements-list">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="achievement-card">
                    <div className="achievement-icon-container">
                      <achievement.icon className="achievement-icon" />
                    </div>
                    <div className="achievement-info">
                      <h3 className="achievement-name">{achievement.name}</h3>
                      <p className="achievement-description">
                        {achievement.description}
                      </p>
                      <div className="achievement-progress-container">
                        <div className="achievement-progress">
                          <div
                            className="achievement-progress-bar"
                            style={{ width: `${achievement.progress}%` }}
                          ></div>
                        </div>
                        <span className="achievement-progress-text">
                          {achievement.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="profile-section">
              <h2 className="section-title">Account Settings</h2>

              <div className="settings-group">
                <h3 className="settings-title">
                  <Lock className="settings-icon" />
                  Password
                </h3>
                <div className="settings-content">
                  <p className="settings-description">
                    Change your password to keep your account secure
                  </p>
                  <button className="settings-button">Change Password</button>
                </div>
              </div>

              <div className="settings-group">
                <h3 className="settings-title">
                  <Bell className="settings-icon" />
                  Notifications
                </h3>
                <div className="settings-content">
                  <div className="settings-option">
                    <div>
                      <h4 className="option-title">Email Notifications</h4>
                      <p className="option-description">
                        Receive emails about your account activity
                      </p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-option">
                    <div>
                      <h4 className="option-title">Achievement Alerts</h4>
                      <p className="option-description">
                        Get notified when you earn a new achievement
                      </p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="settings-group">
                <h3 className="settings-title">
                  <Shield className="settings-icon" />
                  Privacy
                </h3>
                <div className="settings-content">
                  <div className="settings-option">
                    <div>
                      <h4 className="option-title">Profile Visibility</h4>
                      <p className="option-description">
                        Allow other students to see your profile
                      </p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>

                  <div className="settings-option">
                    <div>
                      <h4 className="option-title">Share Achievements</h4>
                      <p className="option-description">
                        Display your achievements on your public profile
                      </p>
                    </div>
                    <label className="toggle">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="danger-zone">
                <h3 className="danger-title">Danger Zone</h3>
                <p className="danger-description">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>
                <button className="danger-button" onClick={handleDeleteAccount}>
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
