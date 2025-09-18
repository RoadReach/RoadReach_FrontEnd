import React, { useState } from "react";
import "./Login.css";
import "./ForgotPassword.css";
import "./ForgotPasswordFloating.css";
import { useNavigate } from "react-router-dom";
import Header from "./Header";


const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'code' | 'reset' | 'done'>('email');
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [info, setInfo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Handler for sending code
  const handleSendCode = async () => {
    if (submitting) return;
    setError("");
    setInfo("");
    if (!email) {
      setError("Email is required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/api/users/send-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep('code');
        setInfo("Verification code sent to your email.");
      } else {
        setError(data.message || "Failed to send code. Try again.");
      }
    } catch {
      setError("Server error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for verifying code
  const handleVerifyCode = async () => {
    if (submitting) return;
    setError("");
    setInfo("");
    if (!code) {
      setError("Verification code is required.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/api/users/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code })
      });
      const data = await res.json();
      if (res.ok && data.valid === 1) {
        setStep('reset');
        setInfo("");
      } else {
        setError("Invalid code. Try again.");
      }
    } catch {
      setError("Server error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handler for resetting password
  const handleResetPassword = async () => {
    if (submitting) return;
    setError("");
    setInfo("");
    if (!password || !confirmPassword) {
      setError("Please enter and confirm your new password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("http://localhost:8080/api/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStep('done');
      } else {
        setError(data.message || "Failed to reset password. Try again.");
      }
    } catch {
      setError("Server error. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Header />
      <div className="forgot-container">
        <div className="forgot-card">
          <h1 className="forgot-title">Password Reset</h1>
          {step === 'email' && (
          <>
            <div className="forgot-info">
              Enter your account email address to receive a verification code to reset your password.
            </div>
            <div className="floating-group" style={{ width: "100%", marginBottom: 16 }}>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={"forgot-input floating-input" + (email ? " has-value" : "")}
                autoFocus
                required
                placeholder=" "
              />
              <label htmlFor="forgot-email" className="floating-label">Email Address</label>
            </div>
            {error && <div className="forgot-error">{error}</div>}
            {info && <div className="forgot-success">{info}</div>}
            <button
              className="forgot-button-primary"
              disabled={submitting}
              onClick={handleSendCode}
            >Send Verification Code</button>
            <button
              className="forgot-button-secondary"
              onClick={() => { if (!submitting) navigate("/login"); }}
              disabled={submitting}
            >Cancel</button>
          </>
        )}
        {step === 'code' && (
          <>
            <div style={{ fontSize: 18, marginBottom: 18 }}>If this email matches an entry in our database, you will receive a verification code email shortly.</div>
            <div style={{ background: "#fffbe6", border: "1.5px solid #ffe082", color: "#8a6d1a", borderRadius: 4, padding: "14px 18px", marginBottom: 22, fontSize: 16 }}>
              Keep this page open and enter the verification code you receive in your email below.
            </div>
            <div className="floating-group" style={{ width: "100%", marginBottom: 24 }}>
              <input
                id="verification-code"
                type="text"
                value={code}
                onChange={e => setCode(e.target.value)}
                className={"forgot-input floating-input" + (code ? " has-value" : "")}
                autoFocus
                required
                placeholder=" "
              />
              <label htmlFor="verification-code" className="floating-label">Verification Code</label>
            </div>
            {error && <div className="forgot-error">{error}</div>}
            {info && <div className="forgot-success">{info}</div>}
            <button
              className="forgot-button-primary"
              disabled={submitting}
              onClick={handleVerifyCode}
            >Verify Code</button>
            <button
              style={{ width: "100%", background: "#f5f5f5", color: "#005ea6", fontWeight: 600, fontSize: 18, border: 0, borderRadius: 6, padding: "13px 0", marginBottom: 12, cursor: "pointer" }}
              disabled={submitting}
              onClick={handleSendCode}
            >Send New Code</button>
            <button className="forgot-button-secondary" onClick={() => { if (!submitting) navigate("/login"); }} disabled={submitting}>Cancel</button>
          </>
        )}
        {step === 'reset' && (
          <>
            <div style={{ fontSize: 16, marginBottom: 18, textAlign: "left", width: "100%" }}>Please enter a new password.</div>
            <div className="floating-group" style={{ width: "100%", marginBottom: 16, position: 'relative' }}>
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={"forgot-input floating-input" + (password ? " has-value" : "")}
                autoFocus
                required
                placeholder=" "
              />
              <label htmlFor="new-password" className="floating-label">New Password</label>
              <button
                type="button"
                aria-label="Show password"
                onClick={() => setShowPassword((prev) => !prev)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: 0, cursor: "pointer", padding: 0 }}
              >
                <span role="img" aria-label="Show password" style={{ fontSize: 20, color: "#888" }}>👁️</span>
              </button>
            </div>
            <div className="floating-group" style={{ width: "100%", marginBottom: 18, position: 'relative' }}>
              <input
                id="confirm-password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                className={"forgot-input floating-input" + (confirmPassword ? " has-value" : "")}
                required
                placeholder=" "
              />
              <label htmlFor="confirm-password" className="floating-label">Confirm Password</label>
              <button
                type="button"
                aria-label="Show confirm password"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: 0, cursor: "pointer", padding: 0 }}
              >
                <span role="img" aria-label="Show confirm password" style={{ fontSize: 20, color: "#888" }}>👁️</span>
              </button>
            </div>
            {error && <div className="forgot-error">{error}</div>}
            {info && <div className="forgot-success">{info}</div>}
            <button
              className="forgot-button-primary"
              disabled={submitting}
              onClick={handleResetPassword}
            >Update</button>
            <button
              className="forgot-button-secondary"
              onClick={() => { if (!submitting) setStep('code'); }}
              disabled={submitting}
            >Cancel</button>
          </>
        )}
        {step === 'done' && (
          <div className="forgot-confirm-box">
            <div className="forgot-confirm-title">Password Updated</div>
            <div className="forgot-confirm-desc">Your password has been successfully reset. You can now log in with your new password.</div>
            <button
              className="forgot-confirm-btn"
              onClick={() => navigate('/login')}
            >Return to Login</button>
          </div>
        )}
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
