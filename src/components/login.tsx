import React, { useState } from "react";
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
        localStorage.setItem("password", data.password);
        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        toast.error("Invalid email or password.");
        setPasswordError("Invalid email or password.");
      }
    } catch (error) {
      toast.error("Server error. Please try again.");
      setPasswordError("Server error. Please try again.");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Sign In</h2>
        <ToastContainer position="top-right" autoClose={3000} />
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
                border:
                  fieldErrors.password || passwordError
                    ? "2px solid #D84343"
                    : "1px solid #222",
                color:
                  fieldErrors.password || passwordError
                    ? "#D84343"
                    : "#222",
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
                    }
                  : {
                      ...styles.floatingLabel,
                      color:
                        formData.password.length === 0
                          ? "#444"
                          : formData.password.length < 8
                          ? "#D84343"
                          : formData.password.length < 10
                          ? "#43D843"
                          : "#444",
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
          {/* Password error feedback only */}
          {(fieldErrors.email || passwordError) && (
            <div
              style={{
                color: "#D84343",
                fontWeight: 600,
                margin: "6px 0 0 2px",
                fontSize: "18px"
              }}
            >
              {fieldErrors.email
                ? "Email is required."
                : passwordError}
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