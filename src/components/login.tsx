import React, { useState } from "react";
import { Link } from "react-router-dom";

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
    if (name === "password" && value) {
      setPasswordError("");
      setFieldErrors((prev) => ({ ...prev, password: false }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = {
      email: !formData.email,
      password: !formData.password,
    };
    setFieldErrors(errors);
    // Show only one error message at a time, prioritizing email
    if (errors.email) {
      setPasswordError("");
      return;
    }
    if (errors.password) {
      setPasswordError("Password is required.");
      return;
    }
    // Proceed with login logic
    console.log("Login data:", formData);
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Sign In</h2>
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div style={styles.floatingGroup}>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.floatingInput,
                border: fieldErrors.email ? "2px solid #D84343" : "1px solid #222",
                color: fieldErrors.email ? "#D84343" : "#222",
              }}
              autoComplete="email"
              id="login-email"
            />
            <label
              htmlFor="login-email"
              style={
                formData.email
                  ? { ...styles.floatingLabel, ...styles.floatingLabelActive, color: fieldErrors.email ? "#D84343" : "#222" }
                  : { ...styles.floatingLabel, color: fieldErrors.email ? "#D84343" : "#444" }
              }
            >
              Email Address
            </label>
          </div>

          {/* Password */}
          <div style={styles.floatingGroup}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.floatingInput,
                border: fieldErrors.password ? "2px solid #D84343" : "1px solid #222",
                color: fieldErrors.password ? "#D84343" : "#222",
              }}
              id="login-password"
              autoComplete="current-password"
            />
            <label
              htmlFor="login-password"
              style={
                formData.password
                  ? {
                      ...styles.floatingLabel,
                      ...styles.floatingLabelActive,
                      color: fieldErrors.password ? "#D84343" : "#222",
                    }
                  : {
                      ...styles.floatingLabel,
                      color: fieldErrors.password ? "#D84343" : "#444",
                    }
              }
            >
              Password
            </label>
            <button
              type="button"
              style={{
                ...styles.showButton,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#666",
              }}
              onClick={() => setShowPassword((prev) => !prev)}
              tabIndex={-1}
            >
              <span role="img" aria-label="Show password">👁️</span>
            </button>
          </div>
          {passwordError && (
            <div style={{ color: "#D84343", fontWeight: 600, margin: "6px 0 0 2px", fontSize: "22px" }}>
              {fieldErrors.email ? "Email is required." : passwordError}
            </div>
          )}

          {/* Checkbox */}
          <div style={styles.checkbox}>
            <input
              type="checkbox"
              name="keepSignedIn"
              checked={formData.keepSignedIn}
              onChange={handleChange}
            />
            <span style={{ marginLeft: "5px" }}>Keep me signed in</span>
          </div>

          {/* Submit */}
          <button type="submit" style={styles.signInBtn}>
            Sign In
          </button>

          <hr style={{ margin: "20px 0" }} />
          <Link to="/create-account" style={styles.createBtn}>
            Create Account
          </Link>
        </form>
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
    overflow: "visible",
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
    fontSize: "18px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  passwordWrapper: {
    position: "relative",
  },
  showButton: {
    position: "absolute",
    right: "8px",
    top: "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "20px",
  },
  checkbox: {
    display: "flex",
    alignItems: "center",
    marginTop: "15px",
  },
  signInBtn: {
    background: "#005DA6",
    color: "#fff",
    padding: "10px",
    marginTop: "20px",
    border: "none",
    borderRadius: "4px",
    width: "100%",
    cursor: "pointer",
    fontSize: "18px",
  },
  createBtn: {
    background: "#ccc",
    color: "#000",
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    width: "100%",
    cursor: "pointer",
    fontSize: "18px",
  },
  floatingGroup: {
    position: "relative",
    marginBottom: "18px",
  },
  floatingInput: {
    width: "100%",
    padding: "12px 8px 8px 8px",
    fontSize: "18px",
    border: "1px solid #222",
    borderRadius: "6px",
    outline: "none",
    boxSizing: "border-box",
  },
  floatingLabel: {
    position: "absolute",
    left: "12px",
    top: "8px",
    fontSize: "14px",
    color: "#444",
    background: "#fff",
    padding: "0 2px",
    pointerEvents: "none",
    transition: "0.2s",
  },
  floatingLabelActive: {
    top: "-10px",
    left: "8px",
    fontSize: "12px",
    color: "#222",
    background: "#fff",
    padding: "0 2px",
  },
};

export default Login;