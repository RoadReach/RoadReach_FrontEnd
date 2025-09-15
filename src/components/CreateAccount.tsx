import React, { useState } from "react";
import './CreateAccount.css';
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const FloatingInput = ({ label, type = 'text', name, value, onChange, hasError = false }: {
  label: string; type?: string; name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; hasError?: boolean;
}) => {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;
  return (
    <div className="floating-group">
      <input
        aria-label={label}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`floating-input ${hasError ? 'error' : ''}`}
      />
      <label className={`floating-label ${active ? 'active' : ''} ${hasError ? 'error' : ''}`}>{label}</label>
    </div>
  );
};

const CreateAccount: React.FC = () => {
  const [passwordStrength, setPasswordStrength] = useState("");
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    receiveEmails: false,
    keepSignedIn: false, // Add keepSignedIn to form state
  });

  const [emailError, setEmailError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ firstName: boolean; lastName: boolean; email: boolean; password: boolean }>({ firstName: false, lastName: false, email: false, password: false });
  const [mainError, setMainError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Remove red border when user types
    if (name === "firstName" && value) {
      setFieldErrors((prev) => ({ ...prev, firstName: false }));
      setMainError("");
    }
    if (name === "lastName" && value) {
      setFieldErrors((prev) => ({ ...prev, lastName: false }));
      setMainError("");
    }
    if (name === "email" && value) {
      setFieldErrors((prev) => ({ ...prev, email: false }));
      setMainError("");
    }
    if (name === "password") {
      setFieldErrors((prev) => ({ ...prev, password: false }));
      setMainError("");
      // Password strength feedback
      if (value.length < 8) {
        setPasswordStrength("Weak password");
      } else if (value.length < 10) {
        setPasswordStrength("Strong password");
      } else {
        setPasswordStrength("Very strong password");
      }
    }

    // Email validation
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setEmailError(!emailRegex.test(value) && value.length > 0);
    }

    // Confirm password validation
    if (
      name === "confirmPassword" ||
      (name === "password" && form.confirmPassword.length > 0)
    ) {
      setConfirmPasswordError(
        name === "confirmPassword"
          ? value !== form.password
          : form.confirmPassword !== value
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    const errors = {
      firstName: !form.firstName,
      lastName: !form.lastName,
      email: !form.email,
      password: !form.password,
    };
    setFieldErrors(errors);
    // Show only one error message at a time, prioritizing firstName, lastName, email, password
    if (errors.firstName) {
      setMainError("First Name is required.");
      return;
    }
    if (errors.lastName) {
      setMainError("Last Name is required.");
      return;
    }
    if (errors.email) {
      setMainError("Email is required.");
      return;
    }
    if (errors.password) {
      setMainError("Password is required.");
      return;
    }
    // Password regex validation on submit
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;
    if (!passwordRegex.test(form.password)) {
      setMainError("Password must be at least 8 characters, include uppercase, lowercase, number, and special character.");
      setFieldErrors((prev) => ({ ...prev, password: true }));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setMainError("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          firstName: form.firstName,
          lastName: form.lastName,
        }),
      });
      const result = await response.text();
      if (result.includes("successfully")) {
        // Store sign-in flag in localStorage or sessionStorage
        if (form.keepSignedIn) {
          localStorage.setItem("keepSignedIn", "true");
        } else {
          sessionStorage.setItem("keepSignedIn", "true");
        }
        toast.success(result);
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      } else {
        toast.error(result);
      }
    } catch {
      toast.error("Error connecting to server");
    } finally {
      setSubmitting(false);
    }
  };


  return (
  <div className="auth-page create-account">
      <div className="card card--narrow create-account__card">
        <h2 className="create-account__title">Create Account</h2>
        {/* Toastify container */}
        <ToastContainer position="top-right" autoClose={3000} />
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <FloatingInput
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            hasError={fieldErrors.firstName}
          />
          {/* Last Name */}
          <FloatingInput
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            hasError={fieldErrors.lastName}
          />
          {/* Email Address */}
          <FloatingInput
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            hasError={emailError || fieldErrors.email}
          />
          {/* Password */}
          <FloatingInput
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              hasError={fieldErrors.password}
          />
          {/* Confirm Password */}
          <FloatingInput
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            type="password"
            hasError={confirmPasswordError}
          />
          {/* Error Message */}
            {mainError && (<div className="error-text error-text--main">{mainError}</div>)}
            {form.password && (
              <div className={`strength-text ${form.password.length < 8 ? 'strength--weak' : form.password.length < 10 ? 'strength--strong' : 'strength--very-strong'}`}>{passwordStrength}</div>
            )}
          {/* Receive Emails */}
          <div className="check-row">
            <input
              type="checkbox"
              name="receiveEmails"
              checked={form.receiveEmails}
              onChange={handleChange}
              aria-label="Receive promotional emails"
            />
            <span>
              Yes, I would like to receive emails about special promotions and new
              product information.
            </span>
          </div>
          {/* Keep me signed in */}
          <div className="check-row">
            <input
              type="checkbox"
              name="keepSignedIn"
              checked={form.keepSignedIn}
              onChange={handleChange}
              aria-label="Keep me signed in"
            />
            <span>
              Keep me signed in
            </span>
          </div>
          <div className="create-account__terms">
            By creating an account you agree to RoadReach.com{" "}
            <a href="#">
              terms and conditions
            </a>{" "}
            of use.
          </div>
          <button type="submit" className="btn btn--primary create-account__submit mt-10" disabled={submitting}>
            {submitting ? "Creating..." : "Create Account"}
          </button>
        </form>
        <div className="create-account__footer">
          Already have an account?{" "}
          <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;