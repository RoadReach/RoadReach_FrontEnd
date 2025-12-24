import React, { useState, useEffect } from "react";
import './Profile.css';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Profile: React.FC = () => {
  const [deleting, setDeleting] = useState(false);
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

  // Password editing state
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [editedPassword, setEditedPassword] = useState("");
  const [editedOldPassword, setEditedOldPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [oldPasswordError, setOldPasswordError] = useState("");

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
        toast.success("Email updated successfully.");
      } else {
        setEmailError("Failed to update email. Please try again.");
      }
    } catch {
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

  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");

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

  useEffect(() => {
    if (form.country) {
      fetch(`http://localhost:8080/api/countries/${form.country}/states`)
        .then((res) => {
          if (!res.ok) throw new Error("No states found");
          return res.json();
        })
        .then((data) => {
          setStates(data);
          setStateError("");
        })
        .catch(() => {
          setStates([]);
          setStateError("No states found");
        });
    } else {
      setStates([]);
      setStateError("");
    }
  }, [form.country]);

  useEffect(() => {
    if (form.country && form.state) {
      fetch(`http://localhost:8080/api/countries/${form.country}/states/${form.state}/cities`)
        .then((res) => {
          if (!res.ok) throw new Error("No cities found");
          return res.json();
        })
        .then((data) => {
          setCities(data);
          setCityError("");
        })
        .catch(() => {
          setCities([]);
          setCityError("No cities found");
        });
    } else {
      setCities([]);
      setCityError("");
    }
  }, [form.country, form.state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "phonenumber") {
      // Remove all non-digit characters
      let digits = value.replace(/\D/g, "");

      // If the first digit is "1", remove it (since +1 is always added)
      if (digits.startsWith("1")) {
        digits = digits.slice(1);
      }

      if (digits.length > 10) digits = digits.slice(0, 10); // Limit to 10 digits

      // Format as +1 123-456-7890
      let formatted = "+1 ";
      if (digits.length > 0) formatted += digits.slice(0, 3);
      if (digits.length > 3) formatted += "-" + digits.slice(3, 6);
      if (digits.length > 6) formatted += "-" + digits.slice(6, 10);

      setForm((prev) => ({
        ...prev,
        phonenumber: formatted,
      }));

      if (isEditingPhone) {
        setEditedPhone(formatted);
      }

      const phoneRegex = /^\+1\s\d{3}-\d{3}-\d{4}$/;
      if (!phoneRegex.test(formatted)) {
        setPhoneError("Phone number must be in format: +1 123-456-7890");
      } else {
        setPhoneError("");
      }
      return; // Don't run the rest for phone number
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      toast.success("Address updated successfully!");
    } else {
      toast.error("Failed to update address.");
    }
  };

  // Password validation function
  interface ValidatePassword {
    (pw: string): boolean;
  }

   const validatePassword: ValidatePassword = (pw) => {
  // At least 8 chars, one uppercase, one lowercase, one number, one special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/.test(pw);
};

  return (
    <div className="profile-page">
      <div className="profile-hero"><h1 className="profile-hero__title">PROFILE</h1></div>
      <div className="profile-row">
        <div className="profile-card">
          <div className="profile-card__title">Personal Information</div>
          <div className="profile-flex">
            <div className="profile-field">
              <div className="profile-field__label">Name:</div>
              <div className="profile-field__value">{`${firstName} ${lastName}`}</div>
            </div>
            <div className="profile-field">
              <div className="profile-field__label">UserID:</div>
              <div className="profile-field__value">{userid}</div>
            </div>
            <div className="profile-field">
              <div className="profile-field__label">Address:</div>
              {!editingAddress ? (
                <div className="profile-field__value">
                  {form.address1}
                  {form.address2 && (<><br />{form.address2}</>)}<br />
                  {form.city}, {form.state} {form.country} - {form.zipcode}
                </div>
              ) : (
                <form onSubmit={handleAddressSubmit} className="profile-address-form">
                  <div className="floating-label-group">
                    <input
                      className="profile-input"
                      type="text"
                      name="phonenumber"
                      value={form.phonenumber}
                      onChange={handleChange}
                      required
                      title="Phone Number"
                      placeholder="Phone Number (+1 123-456-7890)"
                    />
                    <label className={form.phonenumber ? 'floating-label filled' : 'floating-label'}>Phone Number</label>
                    {phoneError && <div className="profile-error">{phoneError}</div>}
                  </div>
                  <div className="floating-label-group">
                    <select className="profile-input" name="country" value={form.country} onChange={handleChange} required aria-label="Country">
                      <option value="" disabled hidden></option>
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                    <label className={form.country ? 'floating-label filled' : 'floating-label'}>Country</label>
                  </div>
                  <div className="floating-label-group">
                    <input
                      className="profile-input"
                      type="text"
                      name="address1"
                      value={form.address1}
                      onChange={handleChange}
                      required
                      title="Address 1"
                      placeholder="Address 1"
                    />
                    <label className={form.address1 ? 'floating-label filled' : 'floating-label'}>Address 1</label>
                  </div>
                  <div className="floating-label-group">
                    <input
                      className="profile-input"
                      type="text"
                      name="address2"
                      value={form.address2}
                      onChange={handleChange}
                      title="Address 2"
                      placeholder="Address 2"
                    />
                    <label className={form.address2 ? 'floating-label filled' : 'floating-label'}>Address 2</label>
                  </div>
                  <div className="floating-label-group">
                    <input
                      className="profile-input"
                      type="text"
                      name="city"
                      list="cityOptions"
                      value={form.city}
                      onChange={handleChange}
                      required
                      title="City"
                      placeholder="City"
                    />
                    <label className={form.city ? 'floating-label filled' : 'floating-label'}>City</label>
                    {cities.length > 0 && (
                      <datalist id="cityOptions">{cities.map(c => <option key={c} value={c} />)}</datalist>
                    )}
                    {cityError && <div className="profile-error">{cityError}</div>}
                  </div>
                  <div className="floating-label-group">
                    <input
                      className="profile-input"
                      type="text"
                      name="state"
                      list="stateOptions"
                      value={form.state}
                      onChange={handleChange}
                      required
                      title="State / Province"
                      placeholder="State / Province"
                    />
                    <label className={form.state ? 'floating-label filled' : 'floating-label'}>State / Province</label>
                    {states.length > 0 && (
                      <datalist id="stateOptions">{states.map(s => <option key={s} value={s} />)}</datalist>
                    )}
                    {stateError && <div className="profile-error">{stateError}</div>}
                  </div>
                  <div className="floating-label-group">
                    <input
                      className="profile-input"
                      type="text"
                      name="zipcode"
                      value={form.zipcode}
                      onChange={handleChange}
                      required
                      title="Zipcode"
                      placeholder="Zipcode"
                    />
                    <label className={form.zipcode ? 'floating-label filled' : 'floating-label'}>Zipcode</label>
                  </div>
                  <div className="profile-address-actions">
                    <button type="submit" className="profile-action-btn profile-flex-grow">UPDATE</button>
                    <button type="button" className="profile-action-btn profile-action-btn--light profile-flex-grow" onClick={() => setEditingAddress(false)}>Cancel</button>
                  </div>
                </form>
              )}
            </div>
            {!editingAddress && (
              <button className="profile-inline-btn" onClick={() => setEditingAddress(true)}>Edit</button>
            )}
          </div>
        </div>
      </div>
      <div className="profile-subrow">
        {/* Email Card */}
        <div className="profile-small-card">
          <div className="profile-small-card__label">Email:</div>
          {isEditingEmail ? (
      <div className="profile-inline profile-inline-stretch">
              <input
                type="email"
                value={editedEmail}
                onChange={e => setEditedEmail(e.target.value)} className="profile-input"
        title="Email"
        placeholder="Email address"
              />
              <button className="profile-action-btn" onClick={handleSaveEmail}>Save</button>
              <button className="profile-action-btn profile-action-btn--light" onClick={() => { setIsEditingEmail(false); setEditedEmail(email); setEmailError(""); setEmailSuccess(""); }}>Cancel</button>
            </div>
          ) : (
            <div className="profile-inline">
              <span className="profile-field__value">{email}</span>
              <button className="profile-inline-btn" onClick={() => setIsEditingEmail(true)}>Edit</button>
            </div>
          )}
          {emailError && <div className="profile-error">{emailError}</div>}
          {emailSuccess && <div className="profile-success">{emailSuccess}</div>}
        </div>

        {/* Phone Number Card */}
        <div className="profile-small-card">
          <div className="profile-small-card__label">Phone Number:</div>
          {isEditingPhone ? (
            <div className="profile-inline profile-inline-stretch">
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
                placeholder="Phone Number (+1 123-456-7890)" className="profile-input"
              />
              <button className="profile-action-btn" onClick={async () => {
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
                    toast.success("Phone number updated successfully.");
                  } else {
                    setPhoneError("Failed to update phone number. Please try again.");
                  }
                }}>Save</button>
              <button className="profile-action-btn profile-action-btn--light" onClick={() => { setIsEditingPhone(false); setEditedPhone(form.phonenumber); setPhoneError(""); }}>Cancel</button>
            </div>
          ) : (
            <div className="profile-inline">
              <span className="profile-field__value">{form.phonenumber}</span>
              <button className="profile-inline-btn" onClick={() => { setIsEditingPhone(true); setEditedPhone(form.phonenumber); }}>Edit</button>
            </div>
          )}
          {phoneError && <div className="profile-error">{phoneError}</div>}
        </div>

        {/* Password Card */}
        <div className="profile-small-card">
          <div className="profile-small-card__label">Password:</div>
          {isEditingPassword ? (
            <div className="profile-password-col">
              {/* Old Password */}
              <input
                type="password"
                value={editedOldPassword}
                onChange={e => {
                  setEditedOldPassword(e.target.value);
                  if (e.target.value !== (localStorage.getItem("password") || "")) {
                    setOldPasswordError("Old password does not match.");
                  } else {
                    setOldPasswordError("");
                  }
                }}
                placeholder="Old Password"
                className="profile-input"
              />
              {/* New Password */}
              <input
                type="password"
                value={editedPassword}
                onChange={e => {
                  setEditedPassword(e.target.value);
                  if (!validatePassword(e.target.value)) {
                    setPasswordError("Password must be at least 8 characters, include a number, one uppercase letter, one lowercase letter, and a special character.");
                  } else {
                    setPasswordError("");
                  }
                }}
                placeholder="New Password"
                className="profile-input"
                disabled={!!oldPasswordError || !editedOldPassword}
              />
              {/* Retype New Password */}
              <input
                type="password"
                value={retypePassword}
                onChange={e => setRetypePassword(e.target.value)}
                placeholder="Retype New Password"
                className="profile-input"
                disabled={!!oldPasswordError || !editedOldPassword}
              />
              <div className="profile-address-actions">
                <button className="profile-action-btn" onClick={async () => {
                    if (oldPasswordError || !editedOldPassword) return;

                    if (editedPassword !== retypePassword) {
                      setPasswordError("New passwords do not match.");
                      return;
                    }
                    setPasswordError("");
                    // Save password in backend
                    const response = await fetch("http://localhost:8080/api/users/updatePassword", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        userid,
                        password: editedPassword
                      })
                    });
                    if (response.ok) {
                      setIsEditingPassword(false);
                      toast.success("Password updated successfully. You can now log in with your new password.");
                      localStorage.setItem("password", editedPassword);
                    } else {
                      setPasswordError("Failed to update password. Please try again.");
                    }
                  }}>Save</button>
                <button className="profile-action-btn profile-action-btn--light" onClick={() => {
                    setIsEditingPassword(false);
                    setEditedPassword("");
                    setEditedOldPassword("");
                    setRetypePassword("");
                    setPasswordError("");
                    setOldPasswordError("");
                  }}>Cancel</button>
              </div>
              {oldPasswordError && <div className="profile-error profile-error-inline">{oldPasswordError}</div>}
              {passwordError && <div className="profile-error profile-error-inline">{passwordError}</div>}
            </div>
          ) : (
            <div className="profile-inline">
              <span className="profile-field__value">**********</span>
              <button className="profile-inline-btn" onClick={() => { setIsEditingPassword(true); setEditedPassword(""); }}>Edit</button>
            </div>
          )}

        </div>
      </div>
      <div className="profile-delete-row">
        <button className="profile-delete-btn" disabled={deleting} onClick={async () => {
            if (deleting) return;
            if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
              setDeleting(true);
              const userid = localStorage.getItem("userid") || "";
              try {
                const response = await fetch(`http://localhost:8080/api/users/profile/${userid}`, {
                  method: "DELETE",
                });
                if (response.ok) {
                  toast.success("Your account has been deleted.");
                  localStorage.clear();
                  window.location.href = "/"; // Redirect to home page
                } else {
                  toast.error("Failed to delete account. Please try again.");
                }
              } finally {
                setDeleting(false);
              }
            }
          }}>{deleting ? "Deleting..." : "Delete Account"}</button>
      </div>
      <br />
      <ToastContainer />
    </div>
  );
};

export default Profile;