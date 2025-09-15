import React, { useState } from "react";
import RoadReachLogo from "../assets/RoadReach_Logo_cropped.png";
import './HelpCenter.css';

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
const TroubleshootIcon = () => <span className="hc-icon">🛠️</span>;
const InfoIcon = () => <span className="hc-icon">ℹ️</span>;
const CarIcon = () => <span className="hc-icon">🚗</span>;

// Removed voteBtnStyle in favor of .hc-vote-btn class

// REPLACE old popularAnswers (string array) with objects (id,title)
const popularAnswers = [
  { id: "rental-car-only-bookings", title: "Rental Car Only Bookings" },
  { id: "account", title: "RoadReach Travel Account" },
  { id: "rental-car-changes", title: "Rental Car Only Changes & Cancellations" },
];

// NEW article content map
const articleContent: Record<string, { title: string; body: React.ReactElement }> = {
  "rental-car-only-bookings": {
    title: "Rental Car Only Bookings",
    body: (
  <div className="printable hc-article-body">
        <p>
          RoadReach offers members exclusive rental car rates and one free additional driver with our
          rental partners. Executive Members earn a 2% reward per rental.
        </p>

        <h4>In this article:</h4>
  <ul className="hc-article-toc">
          <li><a href="#additional-driver">Additional driver</a></li>
          <li><a href="#booking">Booking</a></li>
          <li><a href="#email-confirmations">Email confirmations</a></li>
          <li><a href="#insurance-options">Insurance options</a></li>
          <li><a href="#loyalty-numbers">Loyalty numbers</a></li>
          <li><a href="#optional-equipment">Optional equipment</a></li>
          <li><a href="#restrictions">Restrictions</a></li>
        </ul>

  <h3 id="additional-driver" className="hc-article-sub">Additional driver</h3>
        <p>
          When booking a Rental Car with RoadReach, one additional driver fee is waived for qualifying members:
        </p>
        <ul>
          <li><strong>Alamo &amp; Enterprise:</strong> U.S., Canada, UK, Puerto Rico, France, Germany, Ireland, Spain</li>
          <li><strong>Avis &amp; Budget:</strong> U.S. and Canada</li>
        </ul>
        <p>
          Additional drivers are added at pick‑up and must meet the rental agency’s requirements (license & major credit card). Charges may apply for drivers under 25.
        </p>

  <h3 id="booking" className="hc-article-sub">Booking a rental car</h3>
        <p>To book:</p>
        <ol>
          <li>Sign in to your account</li>
          <li>Select Rental Cars</li>
          <li>Enter pickup & drop off: location, dates, times</li>
          <li>Select if you are at least 25 years old</li>
          <li>Click Search</li>
          <li>Use filters to narrow</li>
        </ol>
        <p><em>Or</em></p>
        <ol start={7}>
          <li>Call RoadReach Travel (rental cars option)</li>
          <li>Select a rental partner to connect to a representative</li>
          <li>Follow prompts for account assistance if needed</li>
        </ol>

  <h3 id="email-confirmations" className="hc-article-sub">Email confirmations</h3>
        <p>
          You’ll receive a confirmation email with RoadReach and agency confirmation numbers. Check spam/junk if missing or resend from your account.
        </p>

  <h3 id="insurance-options" className="hc-article-sub">Insurance options</h3>
        <p>Insurance isn’t included; you may add coverage via:</p>
        <ul>
          <li>Third‑party travel insurance</li>
          <li>Rental agency insurance (pre‑book or at pick‑up)</li>
          <li>Credit card benefits</li>
          <li>Personal auto insurance</li>
        </ul>

  <h3 id="loyalty-numbers" className="hc-article-sub">Loyalty numbers</h3>
        <p>Enter supported loyalty numbers under Driver Details. Contact the rewards program for point eligibility.</p>

  <h3 id="optional-equipment" className="hc-article-sub">Optional equipment / add‑ons</h3>
        <p>
          Add navigation, child seats, satellite radio during booking (availability varies). To add later you may need to cancel/rebook or request at pick‑up (pricing may change).
        </p>

  <h3 id="restrictions" className="hc-article-sub">Restrictions</h3>
        <p>
          Review geographic & cross‑border restrictions. Confirm terms for international or one‑way trips.
        </p>

  <hr className="hc-article-sep" />

        <div className="hc-answer-help">
          <span className="hc-answer-help-label">Is this answer helpful?</span>
          <div className="hc-inline-flex">
            <button className="hc-vote-btn" aria-label="Helpful">👍</button>
            <button className="hc-vote-btn" aria-label="Not helpful">👎</button>
          </div>
        </div>

        <div className="hc-related">
          <h4>Related Answers</h4>
          <ul>
            <li>Rental Car Only General Information</li>
            <li>Rental Car Only Changes &amp; Cancellations</li>
            <li>RoadReach Rewards Program</li>
          </ul>
        </div>
      </div>
    )
  }
};



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
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null); // NEW

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "phoneNumber") {
      // live-format phone as user types
      const formatted = formatPhone(value);
      setForm({ ...form, phoneNumber: formatted });
  setError("");
      if (formatted && !isValidPhone(formatted)) {
        setPhoneError("Phone number must be 10 digits");
      } else {
        setPhoneError("");
      }
      return;
    }

    setForm({ ...form, [name]: value });
  setError("");

    if (name === "email") {
      if (!value) setEmailError("Email is required");
      else if (!emailRegex.test(value.trim())) setEmailError("Enter a valid email");
      else setEmailError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setError("");

    if (!form.fullName || !form.email || !form.requestType || !form.description) {
      setError("Please fill in all required fields.");
      setSubmitting(false);
      return;
    }
    if (!emailRegex.test(form.email.trim())) {
      setEmailError("Enter a valid email");
      setSubmitting(false);
      return;
    }
    if (form.phoneNumber && !isValidPhone(form.phoneNumber)) {
      setPhoneError("Phone number must be 10 digits");
      setSubmitting(false);
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
        setSubmitting(false);
        return;
      }
      setToast("Request submitted successfully");
      setForm({
        fullName: "",
        email: "",
        phoneNumber: "",
        requestType: "General",
        description: "",
      });
      setTimeout(() => setToast(null), 4000);
    } catch {
      setError("Failed to submit request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="hc-overlay" onClick={onClose}>
      {toast && (
        <div role="alert" className="hc-toast">
          {toast}
          <button onClick={() => setToast(null)} className="hc-toast-close" aria-label="Close notification">×</button>
        </div>
      )}
      <div className="hc-modal" onClick={e => e.stopPropagation()}>
        <button className="hc-close" onClick={onClose}>&times;</button>

        {/* ARTICLE VIEW */}
        {selectedArticle && articleContent[selectedArticle] ? (
          <div>
            <div className="hc-back-header">
              <button onClick={() => setSelectedArticle(null)} className="hc-back-btn-icon" aria-label="Back">←</button>
              <div className="hc-header hc-header--inline">
                <img src={RoadReachLogo} alt="RoadReach Logo" />
                <span className="hc-header-title">Help Center</span>
              </div>
            </div>
            <div className="hc-article-search">
              <input className="hc-article-search-input" placeholder="How can we help?" value={search} onChange={(e) => setSearch(e.target.value)} />
              <button className="hc-article-search-btn">🔍</button>
            </div>
            <h1 className="hc-article-title">
              {articleContent[selectedArticle].title}
            </h1>
            <div className="hc-article-layout">
              <div className="hc-article-main">
                {articleContent[selectedArticle].body}
                <div className="hc-print-bar">
                  <button onClick={() => window.print()} className="hc-print-btn">🖨️ Print</button>
                </div>
              </div>
              <aside className="hc-contact">
                <div className="hc-contact-heading">Contact Us</div>
                <div className="hc-contact-section">
                  <div className="hc-contact-icon">📞</div>
                  <div>
                    <div className="hc-contact-label">Questions or Book Now</div>
                    <a href="tel:1-866-921-7925" className="hc-contact-phone">1-866-921-7925</a>
                    <div className="hc-contact-small">Mon - Fri: 5AM to 7PM<br/>Sat - Sun: 6AM to 5PM PT</div>
                  </div>
                </div>
                <div className="hc-contact-section">
                  <div className="hc-contact-icon">🌐</div>
                  <div>
                    <div className="hc-contact-label">Help While Traveling</div>
                    <a href="tel:1-866-317-4711" className="hc-contact-phone">1-866-317-4711</a>
                  </div>
                </div>
                <div className="hc-contact-section">
                  <div className="hc-contact-icon">🗂️</div>
                  <div>
                    <div className="hc-contact-label">Post-Travel Inquiry</div>
                    <a href="#" className="hc-contact-phone">File a claim</a>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        ) : !showForm ? (
          // HOME VIEW (update list items to be clickable)
          <>
            <div className="hc-header">
              <img src={RoadReachLogo} alt="RoadReach Logo" />
              <span className="hc-header-title">Help Center</span>
            </div>
            <div className="hc-search-bar">
              <form onSubmit={e => e.preventDefault()}>
                <input className="hc-search-input" placeholder="How can we help?" value={search} onChange={e => setSearch(e.target.value)} />
                <button type="submit" className="hc-search-submit"><span role="img" aria-label="search">🔍</span></button>
              </form>
            </div>
            <div>
              <div className="hc-popular-title">Popular Answers</div>
              <ul className="hc-popular-list">
                {popularAnswers.map(ans => (
                  <li key={ans.id} className="hc-popular-item" onClick={() => setSelectedArticle(ans.id)}>{ans.title}</li>
                ))}
              </ul>
              <a href="#" className="hc-show-more">Show more Published Answers <span className="hc-more-arrow">›</span></a>
            </div>
            <div className="hc-quick-links-wrap">
              <div className="hc-quick-link"><span>Troubleshoot</span> <TroubleshootIcon /></div>
              <div className="hc-quick-link"><span>General Information</span> <InfoIcon /></div>
              <div className="hc-quick-link"><span>Rental Cars</span> <CarIcon /></div>
            </div>
            <button className="hc-submit-btn" onClick={() => setShowForm(true)}>Submit a Request</button>
          </>
        ) : (
          // FORM VIEW (unchanged)
          <>
            <h2 className="hc-header-title">Submit a request</h2>
            <form onSubmit={handleSubmit} className="hc-form">
              <label className="hc-label">Full Name</label>
              <input
                className="hc-input"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
              <label className="hc-label">Email</label>
              <input
                className="hc-input"
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
              {emailError && <div className="hc-field-error">{emailError}</div>}
              <label className="hc-label">Phone Number</label>
              <input
                className="hc-input"
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={handleChange}
                onBlur={(e) => {
                  if (e.target.value && !isValidPhone(e.target.value)) setPhoneError("Enter a valid phone (10-15 digits)");
                }}
                placeholder="Enter your phone number (optional)"
              />
              {phoneError && <div className="hc-field-error">{phoneError}</div>}
              <label className="hc-label">Request Type</label>
              <select
                className="hc-input"
                name="requestType"
                aria-label="Request Type"
                title="Request Type"
                value={form.requestType}
                onChange={handleChange}
              >
                <option value="General">General</option>
                <option value="Booking">Booking</option>
                <option value="Technical">Technical</option>
                <option value="Other">Other</option>
              </select>
              <label className="hc-label">Description</label>
              <textarea
                className="hc-input hc-textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Describe your issue or request"
                required
              />
              {error && <div className="hc-error">{error}</div>}
              <button type="submit" className="hc-form-submit" disabled={submitting}>{submitting ? "Submitting..." : "Submit"}</button>
              <button type="button" className="hc-back-btn" onClick={() => setShowForm(false)}>Back to Help Center</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
export default HelpCenter;
