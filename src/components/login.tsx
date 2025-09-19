import React, { useState } from "react";
import { validateEmail } from "./validateEmail";
import './Login.css';
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface LoginFormData {
  email: string;
  password: string;
  keepSignedIn: boolean;
}




const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
    keepSignedIn: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });
  const [showTooltip, setShowTooltip] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Forgot Password states
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordStep, setForgotPasswordStep] = useState<'email' | 'verification' | 'reset'>('email');
  const [forgotEmail, setForgotEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forgotPasswordError, setForgotPasswordError] = useState("");
  const [forgotPasswordSubmitting, setForgotPasswordSubmitting] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (name === "email") {
      setFieldErrors((prev) => ({ ...prev, email: false }));
      setEmailError("");
    }
    if (name === "password") {
      setPasswordError("");
      setFieldErrors((prev) => ({ ...prev, password: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const errors = {
      email: false,
      password: false,
    };
    let customEmailError = "";
    if (!formData.email) {
      errors.email = true;
      customEmailError = "Email address is required.";
    } else {
      const validationResult = validateEmail(formData.email);
      if (validationResult) {
        errors.email = true;
        customEmailError = validationResult;
      }
    }
    if (!formData.password) {
      errors.password = true;
      setPasswordError("Password is required.");
    } else {
      setPasswordError("");
    }
    setFieldErrors(errors);
    setEmailError(customEmailError);
    if (errors.email || errors.password) {
      return;
    }

    // Check credentials with backend
    try {
      const response = await fetch("http://localhost:8080/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // Store sign-in flag in localStorage or sessionStorage
        if (formData.keepSignedIn) {
          localStorage.setItem("keepSignedIn", "true");
        } else {
          sessionStorage.setItem("keepSignedIn", "true");
        }
        localStorage.setItem("firstname", data.firstname);
        localStorage.setItem("lastname", data.lastname);
        localStorage.setItem("email", data.email);
        localStorage.setItem("userid", data.userid);
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error("Invalid email or password.");
        setPasswordError("Invalid email or password.");
        setFieldErrors((prev) => ({ ...prev, password: true }));
      }
    } catch {
      toast.error("Server error. Please try again.");
      setPasswordError("Server error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login">
      <div className="login__card">
        <h2 className="login__title">Sign In</h2>
        <div className="login__desc">
          NEW! RoadReach.com and RoadReachTravel.com sign in are merging.
        </div>
        <ul className="login__list">
          <li>You can now sign in to both websites using your <b>roadreach.com email and password</b>. <a href="#" className="login__learn-link">Learn more</a></li>
          <li>You must be a RoadReach Member residing in the United States.</li>
        </ul>
        <ToastContainer position="top-right" autoClose={3000} />
        <form onSubmit={handleSubmit}>
          <div className="floating-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`floating-input${fieldErrors.email || emailError ? ' error' : ''}`}
              autoComplete="email"
              id="login-email"
              aria-label="Email Address"
              placeholder=" "
            />
            <label htmlFor="login-email" className="floating-label">Email Address</label>
          </div>
          {(fieldErrors.email || emailError) && (
            <div className="error-text">{emailError || 'Email address is required.'}</div>
          )}
          <div className="floating-group login__relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`floating-input${(fieldErrors.password || passwordError) ? ' error' : ''}`}
              id="login-password"
              autoComplete="current-password"
              aria-label="Password"
              placeholder=" "
            />
            <label htmlFor="login-password" className="floating-label">Password</label>
            <button
              type="button"
              className="show-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
              aria-label="Show password"
            >
              <span role="img" aria-label="Show password">👁️</span>
            </button>
          </div>
          {(fieldErrors.password || passwordError) && (
            <div className="error-text">{passwordError || 'Password is required.'}</div>
          )}
          <div className="login__links-col">
            <Link to="/forgot-password" className="login__link">Forgot Password?</Link>
            <a href="#" className="login__link">Need help logging in?</a>
          </div>

          {/* Forgot Password Modal */}
          {showForgotPassword && (
            <div className="modal-overlay modal-overlay--centered">
              <div className="modal-card modal-card--centered">
                <img src="/public/vite.svg" alt="Logo" className="modal-logo" />
                <h2 className="modal-title">Password Reset</h2>
                {forgotPasswordStep === 'email' && (
                  <>
                    <div className="modal-instructions">Enter your account email address to receive a verification code to reset your password.</div>
                    <label htmlFor="forgot-email" className="modal-label">Email Address</label>
                    <input
                      id="forgot-email"
                      type="email"
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="Email Address"
                      className="modal-input"
                      autoFocus
                    />
                    {forgotPasswordError && <div className="error-text">{forgotPasswordError}</div>}
                    <button
                      className="modal-btn modal-btn--primary"
                      disabled={forgotPasswordSubmitting}
                      onClick={async () => {
                        setForgotPasswordError("");
                        if (!forgotEmail) {
                          setForgotPasswordError("Email is required.");
                          return;
                        }
                        setForgotPasswordSubmitting(true);
                        try {
                          const res = await fetch("http://localhost:8080/api/users/send-reset-code", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: forgotEmail })
                          });
                          const data = await res.json();
                          if (res.ok && data.success) {
                            setForgotPasswordStep('verification');
                          } else {
                            setForgotPasswordError(data.message || "Failed to send code. Try again.");
                          }
                        } catch {
                          setForgotPasswordError("Server error. Try again.");
                        } finally {
                          setForgotPasswordSubmitting(false);
                        }
                      }}
                    >Send Verification Code</button>
                    <button className="modal-btn modal-btn--link" onClick={() => setShowForgotPassword(false)}>Cancel</button>
                  </>
                )}
                {forgotPasswordStep === 'verification' && (
                  <>
                    <h3>Verify Code</h3>
                    <p>Enter the code sent to your email.</p>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={e => setVerificationCode(e.target.value)}
                      placeholder="Verification code"
                      className="floating-input"
                      autoFocus
                      disabled={forgotPasswordSubmitting}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="New password"
                      className="floating-input floating-input--mt12"
                      disabled={forgotPasswordSubmitting}
                    />
                    <div className="confirm-password-row">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="floating-input floating-input--fullwidth"
                        disabled={forgotPasswordSubmitting}
                      />
                      <button
                        type="button"
                        className="show-toggle show-toggle--confirm"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        tabIndex={-1}
                        aria-label="Show confirm password"
                      >
                        <span role="img" aria-label="Show confirm password">👁️</span>
                      </button>
                    </div>
                    {forgotPasswordError && <div className="error-text">{forgotPasswordError}</div>}
                    <div className="login__links-col">
                      <Link to="/forgot-password" className="login__link">Forgot Password?</Link>
                      <a href="#" className="login__link">Need help logging in?</a>
                    </div>
                    <button
                      className="login__full-btn"
                      disabled={forgotPasswordSubmitting}
                      onClick={async () => {
                        setForgotPasswordError("");
                        if (!newPassword || !confirmPassword) {
                          setForgotPasswordError("Please enter and confirm your new password.");
                          return;
                        }
                        if (newPassword !== confirmPassword) {
                          setForgotPasswordError("Passwords do not match.");
                          return;
                        }
                        // TODO: Call backend to reset password
                        setForgotPasswordSubmitting(true);
                        try {
                          const res = await fetch("http://localhost:8080/api/users/reset-password", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ email: forgotEmail, code: verificationCode, password: newPassword })
                          });
                          const data = await res.json();
                          if (res.ok && data.success) {
                            toast.success("Password reset successful! You can now log in.");
                            setShowForgotPassword(false);
                          } else {
                            setForgotPasswordError(data.message || "Failed to reset password. Try again.");
                          }
                        } catch {
                          setForgotPasswordError("Server error. Try again.");
                        } finally {
                          setForgotPasswordSubmitting(false);
                        }
                      }}
                    >Reset Password</button>
                  </>
                )}
              </div>
            </div>
          )}
          <div className="login__checkbox-row">
            <input
              type="checkbox"
              name="keepSignedIn"
              checked={formData.keepSignedIn}
              onChange={handleChange}
              aria-label="Keep me signed in"
              id="keepSignedIn"
            />
            <label htmlFor="keepSignedIn" className="login__checkbox-label">Keep me signed in</label>
            <div className="login__info-wrapper">
              <button
                type="button"
                className={`login__info-btn${showTooltip ? ' active' : ''}`}
                aria-label="Info: We'll keep you signed in on this device. You may need to sign in again when editing sensitive account information."
                tabIndex={0}
                onClick={() => setShowTooltip((prev) => !prev)}
                onBlur={() => setShowTooltip(false)}
              >
                <span className="login__info-icon">i</span>
              </button>
              {showTooltip && (
                <div className="login__tooltip">
                  We'll keep you signed in on this device. You may need to sign in again when editing sensitive account information.
                </div>
              )}
            </div>
          </div>
          <div className="login__checkbox-info">
            Check this box only when on a private device.
          </div>
          <button type="submit" className="login__full-btn login__sign-btn" disabled={submitting}>
            {submitting ? "Signing In..." : "Sign In"}
          </button>
          <div className="login__new-row">
            <span>New to RoadReach? <a href="#" className="login__learn-link">Learn more</a> about becoming a member.</span>
          </div>
          <button type="button" className="login__center-btn login__create-btn">
            <Link to="/create-account">Create Account</Link>
          </button>
        </form>
      </div>
  {/* Footer removed as requested */}
    </div>
  );
};

export default Login;