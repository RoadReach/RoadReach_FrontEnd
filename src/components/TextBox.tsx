import React, { useState } from "react";
import './TextBox.css';

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
    <div className="textbox-group">
      <input
        type={type}
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="textbox-input"
        aria-label={label}
      />
      <label className={`textbox-label ${isActive ? 'active' : ''}`}>{label}</label>
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
      <div className="textbox-group">
        <input
          type={showPassword ? 'text' : 'password'}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          className="textbox-input"
          aria-label="Password"
        />
        <label className={`textbox-label ${formData.password || showPassword ? 'active' : ''}`}>Password</label>
        <button type="button" onClick={() => setShowPassword(p => !p)} className="password-toggle" tabIndex={-1}>
          <span role="img" aria-label="Show password">👁️</span>
        </button>
      </div>
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