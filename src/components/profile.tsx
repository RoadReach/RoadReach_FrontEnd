import React, { useState, useEffect } from "react";

const Profile: React.FC = () => {
  const firstName = localStorage.getItem("firstname") || "";
  const lastName = localStorage.getItem("lastname") || "";
  const email = localStorage.getItem("email") || "";
  const userid = localStorage.getItem("userid") || "";

  // Email editing state
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [editedEmail, setEditedEmail] = useState(email);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");

  // Phone number editing state
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [editedPhone, setEditedPhone] = useState("");

  // Email update handler
  const handleSaveEmail = async () => {
    setEmailError("");
    setEmailSuccess("");
    if (!editedEmail || !/^\S+@\S+\.\S+$/.test(editedEmail)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    try {
      const response = await fetch("http://localhost:8080/api/users/updateEmail", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userid, email: editedEmail, firstname: firstName, lastname: lastName })
      });
      if (response.ok) {
        localStorage.setItem("email", editedEmail);
        //setEmailSuccess("Email updated successfully.");
        setIsEditingEmail(false);
        alert("Email updated successfully.");
      } else {
        setEmailError("Failed to update email. Please try again.");
      }
    } catch (err) {
      setEmailError("Server error. Please try again later.");
    }
  };

  const [form, setForm] = useState({
    phonenumber: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
  });
  const [phoneError, setPhoneError] = useState("");

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
        if (data) {
            console.log("User data found, populating form.");
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
          setEditedPhone(data.phonenumber || "");
        } else {
          setUserExists(false);
          console.log("No user data found, resetting form.");
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
    if (name === "phonenumber") {
      // US phone format: +1 123-456-7890
      const phoneRegex = /^\+1\s\d{3}-\d{3}-\d{4}$/;
      if (!phoneRegex.test(value)) {
        setPhoneError("Phone number must be in format:+1 123-456-7890");
      } else {
        setPhoneError("");
      }
    }
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (name === "phonenumber" && isEditingPhone) {
      setEditedPhone(value);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.phonenumber) {
      setPhoneError("Phone number is required and must be in format:+1 ***-***-****");
      return;
    }
    if (phoneError) {
      return;
    }
    setEditingAddress(false);

    const userid = localStorage.getItem("userid") || "";
    const firstname = localStorage.getItem("firstname") || "";
    const lastname = localStorage.getItem("lastname") || "";
    const email = localStorage.getItem("email") || "";

    // Use POST for insert, PUT for update
    const method = userExists ? "PUT" : "POST";

    const response = await fetch("http://localhost:8080/api/users/userData", {
      method,
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

    if (response.ok) {
      alert("Address updated successfully!");
    } else {
      alert("Failed to update address.");
    }
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
        <b>{"\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0"}
            PROFILE</b>
      </div>
      {/* Top Info Row: Name, UserID, Personal Info */}
      <div style={{
        width: "100%",
        margin: "5px auto 0 auto",
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
                      placeholder="Phone Number (+1 ***-***-****)"
                      style={inputStyle}
                      required
                    />
                    {phoneError && (
                      <div style={{ color: "red", marginTop: 4 }}>{phoneError}</div>
                    )}
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <select
                      name="country"
                      value={form.country}
                      onChange={handleChange}
                      style={inputStyle}
                      required
                    >
                        <option value="">Select Country</option>
                      <option value="US">US</option>
                      <option value="Canada">Canada</option>
                    </select>
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
                      UPDATE
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
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start"
        }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Email:</div>
          {isEditingEmail ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="email"
                value={editedEmail}
                onChange={e => setEditedEmail(e.target.value)}
                style={inputStyle}
              />
              <button
                style={{ background: "#337ab7", color: "#fff", border: "none", borderRadius: 4, padding: "8px 16px", cursor: "pointer", fontWeight: 500 }}
                onClick={handleSaveEmail}
              >Save</button>
              <button
                style={{ background: "#eee", color: "#337ab7", border: "none", borderRadius: 4, padding: "8px 16px", cursor: "pointer", fontWeight: 500 }}
                onClick={() => { setIsEditingEmail(false); setEditedEmail(email); setEmailError(""); setEmailSuccess(""); }}
              >Cancel</button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span style={{ fontSize: 18 }}>{email}</span>
              <button
                style={{ background: "none", color: "#337ab7", padding: "6px 18px", fontSize: "18px", fontWeight: 500, cursor: "pointer",position: "absolute",right:"65%",bottom:"36%" }}
                onClick={() => setIsEditingEmail(true)}
              >Edit</button>
            </div>
          )}
          {emailError && <div style={{ color: "red", marginTop: 8 }}>{emailError}</div>}
          {emailSuccess && <div style={{ color: "green", marginTop: 8 }}>{emailSuccess}</div>}
        </div>

        {/* Phone Number Card */}
        <div style={{
          background: "#fff",
          borderRadius: 6,
          boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          padding: "16px 32px",
          minHeight: 60,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start"
        }}>
          <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Phone Number:</div>
          {isEditingPhone ? (
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="text"
                value={editedPhone}
                onChange={e => {
                  setEditedPhone(e.target.value);
                  const phoneRegex = /^\+1\s\d{3}-\d{3}-\d{4}$/;
                  if (!phoneRegex.test(e.target.value)) {
                    setPhoneError("Phone number must be in format: +1 123-456-7890");
                  } else {
                    setPhoneError("");
                  }
                }}
                placeholder="Phone Number (+1 123-456-7890)"
                style={inputStyle}
              />
              <button
                style={{ background: "#337ab7", color: "#fff", border: "none", borderRadius: 4, padding: "8px 16px", cursor: "pointer", fontWeight: 500 }}
                onClick={async () => {
                  if (!editedPhone) {
                    setPhoneError("Phone number is required and must be in format: +1 123-456-7890");
                    return;
                  }
                  const phoneRegex = /^\+1\s\d{3}-\d{3}-\d{4}$/;
                  if (!phoneRegex.test(editedPhone)) {
                    setPhoneError("Phone number must be in format: +1 123-456-7890");
                    return;
                  }
                  setPhoneError("");
                  // Save phone number in address (backend update)
                  const response = await fetch("http://localhost:8080/api/users/userData", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      userid,
                      phonenumber: editedPhone,
                      address1: form.address1,
                      address2: form.address2,
                      city: form.city,
                      state: form.state,
                      zipcode: form.zipcode,
                      country: form.country,
                    })
                  });
                  if (response.ok) {
                    setForm(prev => ({ ...prev, phonenumber: editedPhone }));
                    setIsEditingPhone(false);
                    alert("Phone number updated successfully.");
                  } else {
                    setPhoneError("Failed to update phone number. Please try again.");
                  }
                }}
              >Save</button>
              <button
                style={{ background: "#eee", color: "#337ab7", border: "none", borderRadius: 4, padding: "8px 16px", cursor: "pointer", fontWeight: 500 }}
                onClick={() => { setIsEditingPhone(false); setEditedPhone(form.phonenumber); setPhoneError(""); }}
              >Cancel</button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
              <span style={{ fontSize: 18 }}>{form.phonenumber}</span>
              <button
                style={{ background: "none", color: "#337ab7", border: "1px solid #337ab7", borderRadius: 4, padding: "6px 18px", fontSize: "18px", fontWeight: 500, cursor: "pointer" }}
                onClick={() => { setIsEditingPhone(true); setEditedPhone(form.phonenumber); }}
              >Edit</button>
            </div>
          )}
          {phoneError && <div style={{ color: "red", marginTop: 8 }}>{phoneError}</div>}
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
      {/* Delete Account Button */}
      <div style={{
        width: "74%",
        margin: "24px auto 0 auto",
        display: "flex",
        justifyContent: "center"
      }}>
        <button
          style={{
            background: "#d32f2f",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontSize: "18px",
            fontWeight: 500,
            cursor: "pointer",
            padding: "10px 32px",
            marginTop: "8px"
          }}
          onClick={async () => {
            if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
              const userid = localStorage.getItem("userid") || "";
              const response = await fetch(`http://localhost:8080/api/users/profile/${userid}`, {
                method: "DELETE",
              });
              if (response.ok) {
                alert("Your account has been deleted.");
                localStorage.clear();
                window.location.href = "/"; // Redirect to home page
              } else {
                alert("Failed to delete account. Please try again.");
              }
            }
          }}
        >
          Delete Account
        </button>
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