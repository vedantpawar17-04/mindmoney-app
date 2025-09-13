import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ Password reset successful! You can now log in with your new password.");
        // Assume backend sends back reset token (or URL)
        if (data.token) {
          navigate(`/reset-password?token=${data.token}`);
        } else {
          navigate("/reset-password");
        }
      } else {
        alert(`❌ ${data.message || "Email not found in database."}`);
      }
    } catch (err) {
      console.error("Error:", err);
      alert("⚠️ Unable to connect to server. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <form className="forgot-card" onSubmit={handleSubmit}>
        {/* Icon */}
        <div className="icon-circle" aria-hidden="true">🔒</div>

        {/* Heading */}
        <h2>Forgot Your Password?</h2>
        <p className="subtitle">
          No worries! Enter your email address and we’ll send you a link to reset your password.
        </p>

        {/* Email input */}
        <div className="input-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Note */}
        <p className="note">
          🔔 If this email exists in our database, you’ll receive a reset link.
        </p>

        {/* Submit button */}
        <button
          type="submit"
          className={`btn reset-btn ${loading ? "disabled" : ""}`}
          disabled={loading}
        >
          {loading ? "Sending..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}

export default ForgotPassword;
