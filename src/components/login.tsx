import React, { useState } from "react";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login data:", formData);
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Sign In</h2>
        <p style={styles.infoText}>
          NEW! RoadReach.com and RoadReachTravel.com sign in are merging.
        </p>
        <ul style={styles.list}>
          <li>
            You can now sign in to both websites using your RoadReach email and password.
          </li>
          <li>You must be a RoadReach Member residing in the United States.</li>
        </ul>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <label style={styles.label}>Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={styles.input}
          />

          {/* Password */}
          <label style={styles.label}>Password</label>
          <div style={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <button
              type="button"
              style={styles.showButton}
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* Links */}
          <div style={styles.links}>
            <a href="#">Forgot Password?</a>
            <a href="#">Need help logging in?</a>
          </div>

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
          <button type="button" style={styles.createBtn}>
            Create Account
          </button>
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
  infoText: {
    fontSize: "14px",
    color: "#555",
  },
  list: {
    fontSize: "14px",
    marginBottom: "20px",
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
  },
  links: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    marginTop: "5px",
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
  },
  createBtn: {
    background: "#ccc",
    color: "#000",
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    width: "100%",
    cursor: "pointer",
  },
};

export default Login;