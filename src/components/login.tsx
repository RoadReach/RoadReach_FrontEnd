
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
  const navigate = useNavigate();

  // ...existing code...

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
            <label htmlFor="login-email" className={`floating-label${formData.email ? ' active' : ''}${fieldErrors.email || emailError ? ' error' : ''}`}>Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`floating-input${fieldErrors.email || emailError ? ' error' : ''}`}
              autoComplete="email"
              id="login-email"
              aria-label="Email Address"
            />
          </div>
          {(fieldErrors.email || emailError) && (
            <div className="error-text">{emailError || 'Email address is required.'}</div>
          )}
          <div className="floating-group login__relative">
            <label htmlFor="login-password" className={`floating-label${formData.password ? ' active' : ''}${(fieldErrors.password || passwordError) ? ' error' : ''}`}>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`floating-input${(fieldErrors.password || passwordError) ? ' error' : ''}`}
              id="login-password"
              autoComplete="current-password"
              aria-label="Password"
            />
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
            <a href="#" className="login__link">Forgot Password?</a>
            <a href="#" className="login__link">Need help logging in?</a>
          </div>
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
          <button type="submit" className="login__full-btn login__sign-btn">Sign In</button>
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