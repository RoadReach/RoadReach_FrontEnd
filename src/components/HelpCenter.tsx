import React, { useState } from "react";
import ScrollToSection from "./ScrollToSection";
import RentalCarOnlyBookingsArticle from "./RentalCarOnlyBookingsArticle";
import RoadReachTravelAccountArticle from "./RoadReachTravelAccountArticle";
import RoadReachLogo from "../assets/RoadReach_Logo_cropped.png";
import RentalCarOnlyChangesArticle from "./RentalCarOnlyChangesArticle";
import RentalCarsArticle from "./RentalCarsArticle";
import GeneralInformationArticle from "./GeneralInformationArticle";
import TroubleshootArticle from "./TroubleshootArticle";
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
const InfoIcon = () => <span className="hc-icon">ℹ️</span>;
const CarIcon = () => <span className="hc-icon">🚗</span>;
const TroubleshootIcon = () => <span className="hc-icon">🛠️</span>;

// Removed voteBtnStyle in favor of .hc-vote-btn class

// REPLACE old popularAnswers (string array) with objects (id,title)
const popularAnswers = [
  { id: "troubleshoot", title: "Website Issue/Error Message" },
  { id: "rental-car-only-bookings", title: "Rental Car Only Bookings" },
  { id: "account", title: "RoadReach Travel Account" },
  { id: "rental-car-changes", title: "Rental Car Only Changes & Cancellations" },
];

// NEW article content map
const articleContent: Record<string, { title: string; body: React.ReactElement }> = {
  "troubleshoot": {
    title: "Troubleshoot",
    body: <TroubleshootArticle />
  },
  "rental-car-only-bookings": {
    title: "Rental Car Only Bookings",
    body: <RentalCarOnlyBookingsArticle />
  },
  "account": {
    title: "RoadReach Travel Account",
    body: <RoadReachTravelAccountArticle />
  },
  "rental-car-changes": {
    title: "Rental Car Only Changes & Cancellations",
    body: <RentalCarOnlyChangesArticle />
  },
  "general-information": {
    title: "General Information",
    body: <GeneralInformationArticle />
  },
  "rental-cars": {
    title: "Rental Cars",
    body: <RentalCarsArticle />
  },
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
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [highlightSectionId, setHighlightSectionId] = useState<string | null>(null);
  const [searchActive, setSearchActive] = useState(false);

  // Prepare a flat list of all articles for search
  // For richer search, also check for section subtitles if available
  const allArticles = Object.entries(articleContent).map(([id, { title, body }]) => ({ id, title, body }));


  // Helper to extract all text content from article body (recursively)
  // @ts-expect-error: Accepts any React node for recursive text extraction
  function extractBodyText(node: unknown): string {
    if (!node) return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(extractBodyText).join(" ");
    // Cast to any for property access
    const n: any = node;
    if (n.type === React.Fragment && n.props && n.props.children) {
      return extractBodyText(n.props.children);
    }
    if (n.props) {
      let text = "";
      for (const key of Object.keys(n.props)) {
        text += " " + extractBodyText(n.props[key]);
      }
      return text.trim();
    }
    return "";
  }

  // Helper to extract all sections and their text from an article body
  // @ts-expect-error: Accepts any React node for recursive section extraction
  function extractSections(node: unknown, parentId: string | null = null): Array<{id: string|null, title: string|null, text: string}> {
    let sections: Array<{id: string|null, title: string|null, text: string}> = [];
    if (!node) return sections;
    if (Array.isArray(node)) {
      node.forEach(child => {
        sections = sections.concat(extractSections(child, parentId));
      });
      return sections;
    }
    if (typeof node === 'string' || typeof node === 'number') {
      if (parentId) {
        sections.push({id: parentId, title: null, text: String(node)});
      }
      return sections;
    }
    const n: any = node;
    if (n.props && (n.type === 'h3' || n.type === 'h4' || (n.props.className && n.props.className.includes('hc-article-sub')))) {
      const id = n.props.id || null;
      const title = extractBodyText(n);
      sections.push({id, title, text: ''});
      if (n.props.children) {
        sections = sections.concat(extractSections(n.props.children, id));
      }
      return sections;
    }
    if (n.props && n.props.className && n.props.className.includes('hc-article-body')) {
      const text = extractBodyText(n);
      sections.push({id: parentId, title: null, text});
      if (n.props.children) {
        sections = sections.concat(extractSections(n.props.children, parentId));
      }
      return sections;
    }
    if (n.props && n.props.children) {
      sections = sections.concat(extractSections(n.props.children, parentId));
    }
    return sections;
  }

  const searchResults = search.trim()
    ? allArticles.map(a => {
        const keyword = search.trim().toLowerCase();
        let bodyElement = a.body;
        if (typeof a.body === 'function') {
          bodyElement = a.body();
        }
        // Find all matching sections
        const sections = extractSections(bodyElement);
        const matches = sections.filter(sec =>
          (sec.title && sec.title.toLowerCase().includes(keyword)) ||
          (sec.text && sec.text.toLowerCase().includes(keyword))
        );
        if (a.title.toLowerCase().includes(keyword) || matches.length > 0) {
          return {
            ...a,
            matches
          };
        }
        return null;
      }).filter(Boolean)
    : [];

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
            {/* Scroll/highlight logic for matching section */}
            <ScrollToSection sectionId={highlightSectionId} />
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
              <form onSubmit={e => { e.preventDefault(); setSearchActive(true); }}>
                <input
                  className="hc-search-input"
                  placeholder="How can we help?"
                  value={search}
                  onChange={e => {
                    setSearch(e.target.value);
                    setSearchActive(false);
                  }}
                  onFocus={() => search && setSearchActive(true)}
                />
                <button type="submit" className="hc-search-submit"><span role="img" aria-label="search">🔍</span></button>
              </form>
              {searchActive && searchResults.length > 0 && (
                <ul className="hc-search-results">
                  {searchResults.map(result => (
                    <li
                      key={result.id}
                      className="hc-search-result-item"
                      onClick={() => {
                        setSelectedArticle(result.id);
                        setSearchActive(false);
                        // If there is a matching section id, highlight it
                        const firstMatchWithId = result.matches && result.matches.find(m => m.id);
                        setHighlightSectionId(firstMatchWithId ? firstMatchWithId.id : null);
                      }}
                    >
                      <div className="hc-search-result-title">{result.title}</div>
                      {result.matches && result.matches.length > 0 && (
                        <ul className="hc-search-snippets">
                          {result.matches.slice(0,2).map((m, i) => (
                            <li key={i} className="hc-search-snippet">
                              {m.title && <div className="hc-search-snippet-title">{m.title}</div>}
                              <div className="hc-search-snippet-text">{m.text.length > 120 ? m.text.slice(0,120) + '...' : m.text}</div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              )}
              {searchActive && search && searchResults.length === 0 && (
                <div className="hc-search-no-results">No results found.</div>
              )}
            </div>
            <div>
              <div className="hc-popular-title">Popular Answers</div>
              <ul className="hc-popular-list">
                {popularAnswers.map(ans => (
                  <li key={ans.id} className="hc-popular-item" onClick={() => { setSelectedArticle(ans.id); setHighlightSectionId(null); }}>{ans.title}</li>
                ))}
              </ul>
              <a href="#" className="hc-show-more">Show more Published Answers <span className="hc-more-arrow">›</span></a>
            </div>
            <div className="hc-quick-links-wrap">
              <div className="hc-quick-link hc-quick-link--pointer" onClick={() => { setSelectedArticle("troubleshoot"); setHighlightSectionId(null); }}><span>Troubleshoot</span> <TroubleshootIcon /></div>
              <div className="hc-quick-link hc-quick-link--pointer" onClick={() => { setSelectedArticle("general-information"); setHighlightSectionId(null); }}><span>General Information</span> <InfoIcon /></div>
              <div className="hc-quick-link hc-quick-link--pointer" onClick={() => { setSelectedArticle("rental-cars"); setHighlightSectionId(null); }}><span>Rental Cars</span> <CarIcon /></div>

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