import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ResetPassword.css";

function ResetPassword() {
  const [email, setEmail] = useState(""); // user will type email
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const rules = [
    { test: /.{8,}/, text: "At least 8 characters long" },
    { test: /[A-Z]/, text: "At least one uppercase letter" },
    { test: /[a-z]/, text: "At least one lowercase letter" },
    { test: /[0-9]/, text: "At least one number" },
    { test: /[@$!%*?&]/, text: "At least one special character (@$!%*?&)" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("❌ Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Password updated successfully!");
        navigate("/login");
      } else {
        setError(data.message || "⚠️ Something went wrong.");
      }
    } catch (err) {
      console.error(err);
      setError("⚠️ Server error, try again later.");
    }
  };

//   const canGoBack = confirmPassword && password === confirmPassword;

  return (
    <div className="reset-container">
      <form className="reset-card" onSubmit={handleSubmit}>
        <div className="icon-circle">🔒</div>

        <h2>Reset Your Password</h2>
        <p>Enter your email and create a new secure password</p>

        {error && <div className="error-box">{error}</div>}

        {/* ✅ User can type email now */}
        <div className="input-group">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label>New Password</label>
          <div className="password-field">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-eye"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <ul className="rules-list">
          {rules.map((rule, i) => (
            <li key={i} className={rule.test.test(password) ? "valid" : ""}>
              {rule.text}
            </li>
          ))}
        </ul>

        <div className="input-group">
          <label>Confirm New Password</label>
          <div className="password-field">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="toggle-eye"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
          </div>
        </div>

        <button type="submit" className="btn reset-btn">
          Update Password
        </button>
      </form>
    </div>
  );
}

export default ResetPassword;
