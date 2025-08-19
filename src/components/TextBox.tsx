import React, { useState } from "react";

interface TextBoxProps {
  label: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
}

const TextBox: React.FC<TextBoxProps> = ({
  label,
  placeholder,
  value = "",
  onChange,
  type = "text",
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (onChange) {
      onChange(e.target.value);
    }
  };

  // Label floats if focused or has value
  const isActive = isFocused || inputValue.length > 0;

  return (
    <div style={{ position: "relative", marginBottom: "18px", width: "100%" }}>
      <input
        type={type}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
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

// Example usage inside your login form (not inside TextBox.tsx)
const LoginForm = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form>
      <TextBox
        label="Email Address"
        value={formData.email}
        onChange={(val) => setFormData({ ...formData, email: val })}
        type="text"
      />
      <div style={{ position: "relative", marginBottom: "18px", width: "100%" }}>
        <input
          type={showPassword ? "text" : "password"}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          style={{
            width: "100%",
            padding: "12px 36px 8px 8px", // extra right padding for icon
            fontSize: "18px",
            border: "1px solid #222",
            borderRadius: "6px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <label
          style={{
            position: "absolute",
            left: "12px",
            top: formData.password || showPassword ? "-10px" : "8px",
            fontSize: formData.password || showPassword ? "12px" : "14px",
            color: formData.password || showPassword ? "#222" : "#444",
            background: "#fff",
            padding: "0 2px",
            pointerEvents: "none",
            transition: "0.2s",
          }}
        >
          Password
          <TextBox
        label="Password"
        value={formData.password}
        onChange={(val) => setFormData({ ...formData, password: val })}
        type="text"
      />
        </label>
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          style={{
            position: "absolute",
            right: "10px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "22px",
            padding: 0,
          }}
          tabIndex={-1}
        >
          <span role="img" aria-label="Show password">👁️</span>
        </button>
      </div>
      {/* ...rest of your form... */}
    </form>
  );
};

const App = () => {
  return (
    <div>
      <LoginForm />
    </div>
  );
};

export default App;