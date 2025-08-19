import React, { useState } from "react";
import { Link } from "react-router-dom";

const CreateAccount: React.FC = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    receiveEmails: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle account creation logic here
    console.log("Create Account Data:", form);
  };

  const FloatingInput = ({
    label,
    type = "text",
    name,
    value,
    onChange,
    required = false,
  }: {
    label: string;
    type?: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
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
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            width: "100%",
            padding: "12px 8px 8px 8px",
            fontSize: "18px",
            border: "1px solid #222",
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
            top: isActive ? "-10px" : "8px",
            fontSize: isActive ? "12px" : "14px",
            color: isActive ? "#222" : "#444",
            background: "#fff",
            padding: "0 2px",
            pointerEvents: "none",
            transition: "0.2s",
          }}
        >
          {label}
        </label>
      </div>
    );
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.card}>
        <h2 style={styles.heading}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          {/* First Name */}
          <FloatingInput
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          {/* Last Name */}
          <FloatingInput
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />

          {/* Email Address */}
          <FloatingInput
            label="Email Address"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            required
          />

          {/* Password */}
          <FloatingInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            required
          />

          {/* Confirm Password */}
          <FloatingInput
            label="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            type="password"
            required
          />

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