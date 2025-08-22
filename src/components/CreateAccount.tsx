import React, { useState } from "react";
import { Link } from "react-router-dom";

const FloatingInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  hasError = false, // Add this prop
}: {
  label: string;
  type?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  hasError?: boolean;
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const isActive = isFocused || value.length > 0;
  return (
    <div
      style={{
        position: "relative",
        marginBottom: "18px",
        width: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          width: "100%",
          padding: "12px 8px 8px 8px",
          fontSize: "18px",
          border: hasError ? "1.5px solid red" : "1px solid #222", // Highlight in red if error
          borderRadius: "6px",
          outline: "none",
          boxSizing: "border-box",
          backgroundColor: "#fff",
        }}
      />
      <label
        style={{
          position: "absolute",
          left: "12px",
          top: isActive ? "-10px" : "16px",
          fontSize: isActive ? "12px" : "14px",
          color: isActive ? "#222" : "#444",
          background: "#fff",
          padding: "0 2px",
          pointerEvents: "none",
          transition: "0.2s",
          zIndex: 1,
        }}
      >
        {label}
      </label>
    </div>
  );
};

const CreateAccount: React.FC = () => {
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    receiveEmails: false,
  });

  const [emailError, setEmailError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ firstName: boolean; lastName: boolean; email: boolean; password: boolean }>({ firstName: false, lastName: false, email: false, password: false });
  const [mainError, setMainError] = useState("");

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
    if (name === "password" && value) {
      setFieldErrors((prev) => ({ ...prev, password: false }));
      setMainError("");
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

  // const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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

      // Expecting backend to return JSON: { userId: "...", message: "..." }
      const result = await response.json();
      if (result.userId && result.message) {
        setSuccessMsg(`Successfully registered to RoadReach app! Your User ID is: ${result.userId}. Please check your email.`);
      } else if (result.message) {
        setSuccessMsg(result.message);
      } else {
        setSuccessMsg("Registration completed. Please check your email.");
      }
      setMainError("");
      // Optionally navigate to login after a delay
      // setTimeout(() => navigate("/login"), 5000);
    } catch {
      setSuccessMsg("Error connecting to server");
    }
  };


  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account</h2>
        {successMsg ? (
          <div style={{ color: "#005DA6", fontWeight: 600, margin: "20px 0", fontSize: "16px", textAlign: "center" }}>
            {successMsg}
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* First Name */}
            <FloatingInput
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              required
              hasError={fieldErrors.firstName}
            />
            {/* Last Name */}
            <FloatingInput
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              required
              hasError={fieldErrors.lastName}
            />
            {/* Email Address */}
            <FloatingInput
              label="Email Address"
              name="email"
              value={form.email}
              onChange={handleChange}
              type="email"
              required
              hasError={emailError || fieldErrors.email}
            />
            {/* Password */}
            <FloatingInput
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              type="password"
              required
              hasError={fieldErrors.password}
            />
            {/* Confirm Password */}
            <FloatingInput
              label="Confirm Password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              type="password"
              required
              hasError={confirmPasswordError}
            />
            {/* Error Message */}
            {mainError && (
              <div style={{ color: "#D84343", fontWeight: 600, margin: "6px 0 0 2px", fontSize: "22px" }}>
                {mainError}
              </div>
            )}
            {/* Receive Emails */}
            <div style={{ margin: "15px 0" }}>
              <input
                type="checkbox"
                name="receiveEmails"
                checked={form.receiveEmails}
                onChange={handleChange}
              />
              <span style={{ marginLeft: "8px", fontSize: "14px" }}>
                Yes, I would like to receive emails about special promotions and new
                product information.
              </span>
            </div>
            <div style={{ fontSize: "14px", marginBottom: "10px" }}>
              By creating an account you agree to RoadReach.com{" "}
              <a href="#" style={{ color: "#005DA6" }}>
                terms and conditions
              </a>{" "}
              of use.
            </div>
            <button type="submit" style={styles.createBtn}>
              Create Account
            </button>
          </form>
        )}
        <div
          style={{
            marginTop: "20px",
            textAlign: "center",
            fontSize: "14px",
          }}
        >
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#005DA6" }}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  pageWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "90vh",
    backgroundColor: "#f5f5f5",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
    width: "400px",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    marginBottom: "10px",
  },
  label: {
    fontSize: "14px",
    margin: "10px 0 5px",
    display: "block",
  },
  input: {
    width: "100%",
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    marginBottom: "10px",
  },
  createBtn: {
    background: "#005DA6",
    color: "#fff",
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    width: "100%",
    fontSize: "16px",
    cursor: "pointer",
    marginTop: "10px",
  },
};

export default CreateAccount;