import React, { useState, useEffect } from "react";

const Profile: React.FC = () => {
  const firstName = localStorage.getItem("firstname") || "";
  const lastName = localStorage.getItem("lastname") || "";
  const email = localStorage.getItem("email") || "";
  const userid = localStorage.getItem("userid") || "";

  const [form, setForm] = useState({
    phonenumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });

  const [editingAddress, setEditingAddress] = useState(false);
  const [userExists, setUserExists] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    console.log("==fetchUserData==", userid);
    async function fetchUserData() {
      if (!userid) return;
      const response = await fetch(`http://localhost:8080/api/users/profile/${userid}`);
      if (response.ok) {
        const data = await response.json();
        console.log("Address Form Data:", data);
        if (data) {
          setUserExists(true);
          setForm({
            phonenumber: data.phonenumber || "",
            address1: data.address1 || "",
            address2: data.address2 || "",
            city: data.city || "",
            state: data.state || "",
            zipcode: data.zipcode || "",
            country: data.country || "",
          });
        } else {
          setUserExists(false);
          setForm({
            phonenumber: "",
            address1: "",
            address2: "",
            city: "",
            state: "",
            zipcode: "",
            country: "",
          });
        }
      } else {
        setUserExists(false);
      }
    }
    fetchUserData();
  }, [userid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditingAddress(false);

    // Get user info from localStorage
    const userid = localStorage.getItem("userid") || "";
    const firstname = localStorage.getItem("firstname") || "";
    const lastname = localStorage.getItem("lastname") || "";
    const email = localStorage.getItem("email") || "";

    // Send address and phone number to backend
    const response = await fetch("http://localhost:8080/api/users/userData", {
      method: "POST", // or "PUT" if updating
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userid,
        firstname,
        lastname,
        email,
        phonenumber: form.phonenumber,
        address1: form.address1,
        address2: form.address2,
        city: form.city,
        state: form.state,
        zipcode: form.zipcode,
        country: form.country,
      }),
    });

    // Handle response if needed
  };

  return (
    <div style={{ background: "#f4f4f4", minHeight: "100vh" , width: "100%"}}>
      {/* Header Bar */}
      <div style={{
        background: "#00395d",
        color: "#fff",
        padding: "32px 0 24px 0",
        textAlign: "left",
        fontSize: "40px",
        fontWeight: 400,
        letterSpacing: "1px"
      }}>
        <b>Profile</b>
      </div>
      {/* Top Info Row: Name, UserID, Personal Info */}
      <div style={{
        width: "100%",
        margin: "40px auto 0 auto",
        display: "flex",
        gap: "24px"
      }}>

        {/* Personal Info Card */}
        <div
          style={{
            background: "#fff",
            borderRadius: 6,
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            padding: "32px 32px 24px 32px",
            width: "70%",
            margin: "40px auto 0 auto",
            minHeight: 60,
          }}
        >
          <div style={{ fontWeight: 600, fontSize: 24, marginBottom: 18, textAlign: "left" }}>Personal Information</div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "48px",
              position: "relative",
              justifyContent: "center"
            }}
          >
            {/* Name */}
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>Name:</div>
              <div style={{ fontSize: 20 }}>{`${firstName} ${lastName}`}</div>
            </div>
            {/* UserID */}
            <div style={{ flex: 1, textAlign: "center" }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>UserID:</div>
              <div style={{ fontSize: 20 }}>{userid}</div>
            </div>
            {/* Address */}
            <div style={{ flex: 1, textAlign: "left" }}>
              <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>Address:</div>
              {!editingAddress ? (
                <div style={{ fontSize: 20 }}>
                  <div>
                    <span style={{ fontWeight: 600 }}>Phone:</span> {form.phonenumber}
                  </div>
                  {form.address1}
                  {form.address2 && <><br />{form.address2}</>}
                  <br />
                  {form.city}, {form.state} {form.country} - {form.zipcode}
                </div>
              ) : (
                <form onSubmit={handleAddressSubmit}>
                  <div style={{ marginBottom: 8 }}>
                    <input
                      type="text"
                      name="phonenumber"
                      value={form.phonenumber}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <input
                      type="text"
                      name="address1"
                      value={form.address1}
                      onChange={handleChange}
                      placeholder="Address 1"
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <input
                      type="text"
                      name="address2"
                      value={form.address2}
                      onChange={handleChange}
                      placeholder="Address 2"
                      style={inputStyle}
                    />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="City"
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="State"
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <input
                      type="text"
                      name="zipcode"
                      value={form.zipcode}
                      onChange={handleChange}
                      placeholder="Zipcode"
                      style={inputStyle}
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                    >
                      <option value="US">US</option>
                      <option value="Canada">Canada</option>
                    </select>
                  </div>
                  <div style={{ display: "flex", gap: 12 }}>
                    <button
                      type="submit"
                      style={{
                        background: "#337ab7",
                        color: "#fff",
                        padding: "8px 24px",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        cursor: "pointer",
                        fontWeight: 500,
                        flex: 1
                      }}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      style={{
                        background: "#eee",
                        color: "#337ab7",
                        padding: "8px 24px",
                        border: "none",
                        borderRadius: "6px",
                        fontSize: "16px",
                        cursor: "pointer",
                        fontWeight: 500,
                        flex: 1
                      }}
                      onClick={() => setEditingAddress(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
            {/* Edit Button */}
            {!editingAddress && (
              <button
                style={{
                  background: "none",
                  color: "#337ab7",
                  border: "none",
                  fontSize: "18px",
                  fontWeight: 500,
                  cursor: "pointer",
                  position: "absolute",
                  right: "-30px", // move right
                  top: "-10px"    // move up
                }}
                onClick={() => setEditingAddress(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
      {/* Email and Password Cards Side by Side */}
      <div style={{
        width: "74%",
        margin: "10px auto",
        display: "flex",
        gap: "24px"
      }}>
        {/* Email Card */}
        <div style={{
          background: "#fff",
          borderRadius: 6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: "16px 32px",
          minHeight: 60,
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Email:</div>
            <div style={{ fontSize: 18 }}>{email}</div>
          </div>
          <button
            style={{
              background: "none",
              color: "#337ab7",
              border: "none",
              fontSize: "18px",
              fontWeight: 500,
              cursor: "pointer"
            }}
            // Add edit email logic if needed
          >
            Edit
          </button>
        </div>
        {/* Password Card */}
        <div style={{
          background: "#fff",
          borderRadius: 6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: "16px 32px",
          minHeight: 60,
          flex: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <div>
            <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Password:</div>
            <div style={{ fontSize: 18 }}>**********</div>
          </div>
          <button
            style={{
              background: "none",
              color: "#337ab7",
              border: "none",
              fontSize: "18px",
              fontWeight: 500,
              cursor: "pointer"
            }}
            // Add edit password logic if needed
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  fontSize: "16px",
  borderRadius: "6px",
  border: "1px solid #337ab7",
  marginBottom: "4px",
  boxSizing: "border-box",
};

export default Profile;