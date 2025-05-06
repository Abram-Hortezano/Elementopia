import React, { useEffect, useState } from "react";
import FeatureCard from "../components/featurecard";
import "../components/buttons.css";
import "../assets/css/register-card.css";
import UserService from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react"

const RegisterCard = ({ onRegisterSuccess }) => {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async () => {
    setMessage("");

    if (
      !firstname.trim() ||
      !lastname.trim() ||
      !email.trim() ||
      !username.trim() ||
      !password.trim() ||
      !confirmPassword.trim() ||
      !role
    ) {
      setMessage("All fields are required!");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }

    // Password validation: At least 8 chars, 1 uppercase, 1 number, 1 special char beri nays
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      setMessage(
        "Password must have at least 8 characters, one uppercase letter, one number, and one special character."
      );
      return;
    }

    const userData = {
      firstName: firstname.trim().toLowerCase(),
      lastName: lastname.trim().toLowerCase(),
      email: email.trim(),
      username: username.trim().toLowerCase(),
      password,
      role,
    };

    try {
      await UserService.registerUser(userData);
      setMessage("Registration successful! Redirecting...");
      setIsRegistered(true);
    } catch (error) {
      setMessage(
        "Registration failed: " + (error.response?.data || error.message)
      );
    }
  };

  useEffect(() => {
    if (isRegistered) {
      setTimeout(() => {
        onRegisterSuccess && onRegisterSuccess();
        navigate("/login");
      }, 1500);
    }
  }, [isRegistered, navigate, onRegisterSuccess]);

  return (
    <div className="register-card">
      <FeatureCard className="register" description="Sign Up" gradient="mixed">
        <div className="full-name">
          <input
            type="text"
            className="input-field first-name"
            placeholder="First Name"
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            required
          />
          <input
            type="text"
            className="input-field last-name"
            placeholder="Last Name"
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            required
          />
          
        </div>
        {/* <div className="form-group"> */}
          <input
            type="email"
            className="input-field email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            className="input-field username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="input-field password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password-btn"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </span>
          </div>
          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="input-field confirm-password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password-btn"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </span>
          </div>

          <select
            className="input-field role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="" disabled>
              Select Role
            </option>
            <option value="STUDENT">Student</option>
            <option value="TEACHER">Teacher</option>
          </select>
        {/* </div> */}
        <button className="input-field submit-btn" onClick={handleRegister}>
          Register
        </button>
        {message && <p className="status-message">{message}</p>}
        <p className="login-msg">
          Already have an account?{" "}
          <a
            href="/login"
            onClick={(e) => {
              e.preventDefault();
              navigate("/login");
            }}
            className="login-link popup"
          >
            Login
          </a>
        </p>
      </FeatureCard>
    </div>
  );
};

export default RegisterCard;
