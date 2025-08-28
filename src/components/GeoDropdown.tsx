import React, { useEffect, useState } from "react";

interface GeoDropdownProps {
  showOnlyCountry?: boolean;
}

const API_BASE = "http://localhost:8080/api";

const countryOptions = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
];

const GeoDropdown: React.FC<GeoDropdownProps> = ({ showOnlyCountry }) => {
  const [country, setCountry] = useState(() => localStorage.getItem("selectedCountry") || "");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");

  useEffect(() => {
    localStorage.setItem("selectedCountry", country);
  }, [country]);

  useEffect(() => {
    if (country && !showOnlyCountry) {
      fetch(`${API_BASE}/countries/${country}/states`)
        .then((res) => {
          if (!res.ok) throw new Error("No states found");
          return res.json();
        })
        .then((data) => {
          setStates(data);
          setState("");
          setCities([]);
          setCity("");
          setStateError("");
        })
        .catch(() => {
          setStates([]);
          setStateError("No states found");
        });
    } else {
      setStates([]);
      setState("");
      setCities([]);
      setCity("");
      setStateError("");
    }
  }, [country, showOnlyCountry]);

  useEffect(() => {
    if (country && state && !showOnlyCountry) {
      fetch(`${API_BASE}/countries/${country}/states/${encodeURIComponent(state)}/cities`)
        .then((res) => {
          if (!res.ok) throw new Error("No cities found");
          return res.json();
        })
        .then((data) => {
          setCities(data);
          setCity("");
          setCityError("");
        })
        .catch(() => {
          setCities([]);
          setCityError("No cities found");
        });
    } else {
      setCities([]);
      setCity("");
      setCityError("");
    }
  }, [country, state, showOnlyCountry]);

  return (
    <div>
      {/* Country Dropdown */}
      <label htmlFor="country">Country:</label>
      <select
        id="country"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      >
        <option value="">Select Country</option>
        {countryOptions.map((c) => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
      {/* Only show state/city dropdowns if not showOnlyCountry */}
      {!showOnlyCountry && (
        <>
          {/* State Dropdown */}
          <label htmlFor="state">State/Province:</label>
          <select
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            disabled={!states.length}
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {stateError && <div style={{ color: "red" }}>{stateError}</div>}

          {/* City Dropdown */}
          <label htmlFor="city">City:</label>
          <select
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            disabled={!cities.length}
          >
            <option value="">Select City</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {cityError && <div style={{ color: "red" }}>{cityError}</div>}
        </>
      )}
    </div>
  );
};

export default GeoDropdown;
