import React, { useState } from "react";
import RoadReachLogo from "../assets/RoadReach_Logo_cropped.png";

// Validation helpers
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const normalizePhone = (v: string) => v.replace(/[^\d]/g, "");
const isValidPhone = (v: string) => normalizePhone(v).length === 10; // EXACT 10 digits now
const formatPhone = (v: string) => {
  const d = normalizePhone(v).slice(0, 10);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `(${d.slice(0,3)}) ${d.slice(3)}`;
  return `(${d.slice(0,3)}) ${d.slice(3,6)}-${d.slice(6)}`;
};

// Dummy icons (replace with SVG or icon components as needed)
const TroubleshootIcon = () => <span style={{fontSize: 28, color: "#1565c0"}}>🛠️</span>;
const InfoIcon = () => <span style={{fontSize: 28, color: "#1565c0"}}>ℹ️</span>;
const CarIcon = () => <span style={{fontSize: 28, color: "#1565c0"}}>🚗</span>;

const popularAnswers = [
  "Rental Car Only Bookings",
  "RoadReach Travel Account",
  "Rental Car Only Changes & Cancellations",
];

const HelpCenter = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    requestType: "General",
    description: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toast, setToast] = useState<string | null>(null); // <--- NEW
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // live-format phone as user types
      const formatted = formatPhone(value);
      setForm({ ...form, phoneNumber: formatted });
      setError("");
      setSuccess("");
      if (formatted && !isValidPhone(formatted)) {
        setPhoneError("Phone number must be 10 digits");
      } else {
        setPhoneError("");
      }
      return;
    }

    setForm({ ...form, [name]: value });
    setError("");
    setSuccess("");

    if (name === "email") {
      if (!value) setEmailError("Email is required");
      else if (!emailRegex.test(value.trim())) setEmailError("Enter a valid email");
      else setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.fullName || !form.email || !form.requestType || !form.description) {
      setError("Please fill in all required fields.");
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      setEmailError("Enter a valid email");
      return;
    }
    if (form.phoneNumber && !isValidPhone(form.phoneNumber)) {
      setPhoneError("Phone number must be 10 digits");
      return;
    }

    const payload = {
      ...form,
      phoneNumber: normalizePhone(form.phoneNumber) // send only digits
    };

    try {
      const res = await fetch("http://localhost:8080/api/support/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      if (!res.ok) {
        setError(text || "Failed to submit request.");
        return;
      }
      setSuccess(""); // we will use toast instead of inline success
      setToast("Request submitted successfully"); // <--- SHOW TOAST
      setForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        requestType: "General",
        description: "",
      });
      // auto-hide toast
      setTimeout(() => setToast(null), 4000);
    } catch (err) {
      setError("Failed to submit request. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      {/* Toast (outside modal to ensure always visible) */}
      {toast && (
        <div role="alert" style={styles.toast}>
          {toast}
          <button
            onClick={() => setToast(null)}
            style={styles.toastClose}
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      )}
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <button style={styles.closeBtn} onClick={onClose}>&times;</button>
        {!showForm ? (
          <>
            {/* Logo and Title */}
            <div style={{display: "flex", alignItems: "center", gap: 10, marginBottom: 8}}>
              <img src={RoadReachLogo} alt="RoadReach Logo" style={{height: 36, borderRadius: 6}} />
              <span style={{fontSize: 32, fontWeight: 500, letterSpacing: "-1px"}}>Help Center</span>
            </div>
            {/* Search Bar */}
            <div style={{background: "#1565c0", padding: 16, borderRadius: 8, marginBottom: 18}}>
              <form onSubmit={e => e.preventDefault()} style={{display: "flex"}}>
                <input
                  style={{
                    flex: 1,
                    padding: "10px 12px",
                    border: "none",
                    borderRadius: 4,
                    fontSize: 16,
                  }}
                  placeholder="How can we help?"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
                <button type="submit" style={{
                  background: "#fff",
                  border: "none",
                  borderRadius: "0 4px 4px 0",
                  padding: "0 16px",
                  cursor: "pointer"
                }}>
                  <span role="img" aria-label="search" style={{fontSize: 22, color: "#1565c0"}}>🔍</span>
                </button>
              </form>
            </div>
            {/* Popular Answers */}
            <div>
              <div style={{fontSize: 22, color: "#1565c0", fontWeight: 500, marginBottom: 8}}>Popular Answers</div>
              <ul style={{paddingLeft: 18, marginBottom: 12}}>
                {popularAnswers.map((ans, i) => (
                  <li key={i} style={{marginBottom: 4, fontSize: 16}}>{ans}</li>
                ))}
              </ul>
              <a href="#" style={{color: "#1565c0", fontSize: 15, textDecoration: "underline", marginBottom: 18, display: "inline-block"}}>
                Show more Published Answers <span style={{fontSize: 18}}>›</span>
              </a>
            </div>
            {/* Quick Links */}
            <div style={{marginTop: 10}}>
              <div style={styles.quickLink}><span>Troubleshoot</span> <TroubleshootIcon /></div>
              <div style={styles.quickLink}><span>General Information</span> <InfoIcon /></div>
              <div style={styles.quickLink}><span>Rental Cars</span> <CarIcon /></div>
            </div>
            {/* Contact/Submit Button */}
            <button style={styles.submitBtn} onClick={() => setShowForm(true)}>Submit a Request</button>
          </>
        ) : (
          <>
            <h2 style={styles.title}>Submit a request</h2>
            <form onSubmit={handleSubmit} style={styles.form}>
              <label style={styles.label}>Full Name</label>
              <input
                style={styles.input}
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
              <label style={styles.label}>Email</label>
              <input
                style={{ ...styles.input, borderColor: emailError ? "#d32f2f" : "#d1d5db" }}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onBlur={(e) => {
                  if (!e.target.value) setEmailError("Email is required");
                  else if (!emailRegex.test(e.target.value.trim())) setEmailError("Enter a valid email");
                }}
                placeholder="Enter your email"
                required
              />
              {emailError && <div style={styles.fieldError}>{emailError}</div>}
              <label style={styles.label}>Phone Number</label>
              <input
                style={{ ...styles.input, borderColor: phoneError ? "#d32f2f" : "#d1d5db" }}
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                onBlur={(e) => {
                  if (e.target.value && !isValidPhone(e.target.value)) setPhoneError("Enter a valid phone (10-15 digits)");
                }}
                placeholder="Enter your phone number (optional)"
              />
              {phoneError && <div style={styles.fieldError}>{phoneError}</div>}
              <label style={styles.label}>Request Type</label>
              <select
                style={styles.input}
                name="requestType"
                value={form.requestType}
                onChange={handleChange}
              >
                <option value="General">General</option>
                <option value="Booking">Booking</option>
                <option value="Technical">Technical</option>
                <option value="Other">Other</option>
              </select>
              <label style={styles.label}>Description</label>
              <textarea
                style={{ ...styles.input, minHeight: 80, resize: "vertical" }}
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your issue or request"
                required
              />
              {error && <div style={styles.error}>{error}</div>}
              {/* removed inline success since toast handles it */}
              <button type="submit" style={styles.submitBtn}>Submit</button>
              <button type="button" style={styles.cancelBtn} onClick={() => setShowForm(false)}>Back to Help Center</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.25)",
    zIndex: 2000,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    padding: "36px 32px 32px 32px",
    minWidth: 380,
    maxWidth: "90vw",
    position: "relative",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 16,
    background: "none",
    border: "none",
    fontSize: 28,
    color: "#888",
    cursor: "pointer",
  },
  title: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: 700,
    marginBottom: 24,
    marginTop: 0,
    letterSpacing: "-1px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  label: {
    fontWeight: 500,
    marginBottom: 4,
    fontSize: 16,
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #d1d5db",
    borderRadius: 6,
    fontSize: 16,
    outline: "none",
    marginBottom: 0,
  },
  submitBtn: {
    marginTop: 18,
    padding: "12px 0",
    background: "#e15b87",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    fontSize: 20,
    fontWeight: 600,
    cursor: "pointer",
    transition: "background 0.2s",
  },
  cancelBtn: {
    marginTop: 8,
    padding: "10px 0",
    background: "#f5f5f5",
    color: "#333",
    border: "none",
    borderRadius: 6,
    fontSize: 16,
    fontWeight: 500,
    cursor: "pointer",
  },
  error: {
    color: "#d32f2f",
    background: "#fff0f0",
    padding: "8px 12px",
    borderRadius: 4,
    marginBottom: 4,
    fontSize: 15,
    textAlign: "center",
  },
  success: {
    color: "#388e3c",
    background: "#e8f5e9",
    padding: "8px 12px",
    borderRadius: 4,
    marginBottom: 4,
    fontSize: 15,
    textAlign: "center",
  },
  quickLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "#f3f3f3",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    padding: "16px 18px",
    fontSize: 18,
    fontWeight: 500,
    marginBottom: 12,
    cursor: "pointer",
  },
  toast: {
    position: "fixed",
    top: 20,
    right: 20,
    background: "#1f7a42",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: 8,
    boxShadow: "0 4px 18px rgba(0,0,0,0.25)",
    fontSize: 15,
    fontWeight: 500,
    zIndex: 3000,
    display: "flex",
    alignItems: "center",
    gap: 12,
    maxWidth: 320,
  },
  toastClose: {
    background: "rgba(255,255,255,0.2)",
    border: "none",
    color: "#fff",
    fontSize: 18,
    lineHeight: 1,
    cursor: "pointer",
    width: 28,
    height: 28,
    borderRadius: 4,
  },
  fieldError: {
    color: "#d32f2f",
    fontSize: 13,
    marginTop: 4,
    marginBottom: -4
  },
};

export default HelpCenter;
