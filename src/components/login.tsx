import React, { useState } from "react";
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
  const [fieldErrors, setFieldErrors] = useState<{ email: boolean; password: boolean }>({ email: false, password: false });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Remove red border when user types
    if (name === "email" && value) {
      setFieldErrors((prev) => ({ ...prev, email: false }));
    }
      if (name === "password") {
        setPasswordError("");
        setPasswordError("");
        setFieldErrors((prev) => ({ ...prev, password: false }));
      }
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = {
      email: !formData.email,
      password: !formData.password,
    };
    setFieldErrors(errors);
    if (errors.email) {
      toast.error("Email is required.");
      setPasswordError("");
      return;
    }
    if (errors.password) {
      toast.error("Password is required.");
      setPasswordError("Password is required.");
      return;
    }
    // Password regex validation on submit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      toast.error("Invalid email or password.");
      setPasswordError("Invalid email or password.");
      setFieldErrors((prev) => ({ ...prev, password: true }));
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
      }
  } catch {
      toast.error("Server error. Please try again.");
      setPasswordError("Server error. Please try again.");
    }
  };

  return (
    <div className="auth-page login">
      <div className="card card--narrow login__card">
        <h2 className="login__title">Sign In</h2>
        <ToastContainer position="top-right" autoClose={3000} />
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="floating-group">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`floating-input ${fieldErrors.email ? 'error' : ''}`}
              autoComplete="email"
              id="login-email"
              aria-label="Email Address"
            />
            <label
              htmlFor="login-email"
              className={`floating-label ${formData.email ? 'active' : ''} ${fieldErrors.email ? 'error' : ''}`}
            >
              Email Address
            </label>
          </div>

          {/* Password */}
          <div className="floating-group login__relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`floating-input ${(fieldErrors.password || passwordError) ? 'error' : ''}`}
              id="login-password"
              autoComplete="current-password"
              aria-label="Password"
            />
            <label
              htmlFor="login-password"
              className={`floating-label ${formData.password ? 'active' : ''}`}
            >
              Password
            </label>
            <button
              type="button"
              className="show-toggle"
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              <span role="img" aria-label="Show password">👁️</span>
            </button>
          </div>
          {/* Password error feedback only */}
          {(fieldErrors.email || passwordError) && (
            <div className="error-text">
              {fieldErrors.email
                ? "Email is required."
                : passwordError}
            </div>
          )}

          {/* Checkbox */}
          <div className="login__checkbox">
            <input
              type="checkbox"
              name="keepSignedIn"
              checked={formData.keepSignedIn}
              onChange={handleChange}
              aria-label="Keep me signed in"
            />
            <span>Keep me signed in</span>
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn--primary login__full-btn mt-20">Sign In</button>

          <hr className="login__divider" />
          <Link to="/create-account" className="btn btn--secondary login__center-btn">
            Create Account
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;