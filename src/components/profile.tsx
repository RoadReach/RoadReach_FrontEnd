import React, { useState } from "react";

const Profile: React.FC = () => {
  // Get full name from localStorage or backend
  const fullName = localStorage.getItem("firstname") || "";

  const [form, setForm] = useState({
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit logic here (e.g., send to backend)
    alert("Profile details submitted!");
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 32, background: "#fff", borderRadius: 8, boxShadow: "0 0 16px rgba(0,0,0,0.08)" }}>
      <h2 style={{ marginBottom: 24 }}>Profile</h2>
      <div style={{ marginBottom: 24, fontSize: 18 }}>
        <strong>Full Name:</strong> {fullName}
      </div>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <label>Address 1</label>
          <input
            type="text"
            name="address1"
            value={form.address1}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "6px", border: "1px solid #337ab7", marginTop: "4px" }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>Address 2</label>
          <input
            type="text"
            name="address2"
            value={form.address2}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "6px", border: "1px solid #337ab7", marginTop: "4px" }}
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>City</label>
          <input
            type="text"
            name="city"
            value={form.city}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "6px", border: "1px solid #337ab7", marginTop: "4px" }}
            required
          />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label>State</label>
          <input
            type="text"
            name="state"
            value={form.state}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "6px", border: "1px solid #337ab7", marginTop: "4px" }}
            required
          />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label>Zipcode</label>
          <input
            type="text"
            name="zipcode"
            value={form.zipcode}
            onChange={handleChange}
            style={{ width: "100%", padding: "10px", fontSize: "16px", borderRadius: "6px", border: "1px solid #337ab7", marginTop: "4px" }}
            required
          />
        </div>
        <button
          type="submit"
          style={{
            background: "#337ab7",
            color: "#fff",
            padding: "12px 40px",
            border: "none",
            borderRadius: "6px",
            fontSize: "18px",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Profile;