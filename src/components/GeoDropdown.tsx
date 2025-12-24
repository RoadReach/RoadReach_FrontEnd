import React, { useCallback, useEffect, useRef, useState } from "react";
import './GeoDropdown.css';

interface GeoDropdownProps {
  showOnlyCountry?: boolean;
  onCountryChange?: () => void;
}

const API_BASE = "http://localhost:8080/api";

const countryOptions = [
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
];

const GeoDropdown: React.FC<GeoDropdownProps> = ({ showOnlyCountry, onCountryChange }) => {
  const [country, setCountry] = useState(() => localStorage.getItem("selectedCountry") || "");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [stateError, setStateError] = useState("");
  const [cityError, setCityError] = useState("");

  // Flag dropdown (country only mode) state
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLUListElement | null>(null);

  const flags: Record<string, string> = {
    US: '🇺🇸',
    CA: '🇨🇦'
  };

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

  const handleCountrySelect = useCallback((value: string) => {
    setCountry(value);
    if (onCountryChange) onCountryChange();
  }, [onCountryChange]);

  // Close on outside click
  useEffect(() => {
    if (!showOnlyCountry || !open) return;
    const handler = (e: MouseEvent) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open, showOnlyCountry]);

  // Keyboard navigation for custom menu
  useEffect(() => {
    if (!showOnlyCountry || !open) return;
    const keyHandler = (e: KeyboardEvent) => {
      if (!open) return;
      if (['ArrowDown', 'ArrowUp'].includes(e.key)) {
        e.preventDefault();
        setActiveIndex((prev) => {
          const max = countryOptions.length - 1;
            if (e.key === 'ArrowDown') return prev >= max ? 0 : prev + 1;
            if (e.key === 'ArrowUp') return prev <= 0 ? max : prev - 1;
            return prev;
        });
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (activeIndex >= 0) {
          e.preventDefault();
          handleCountrySelect(countryOptions[activeIndex].code);
          setOpen(false);
          triggerRef.current?.focus();
        }
      } else if (e.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  }, [open, activeIndex, showOnlyCountry, handleCountrySelect]);

  const currentCountry = countryOptions.find(c => c.code === country);

  if (showOnlyCountry) {
    return (
      <div className="geo geo--inline geo-flag-select-wrapper">
        <div className="geo-flag-select">
          <button
            type="button"
            className="geo-flag-trigger"
            aria-haspopup="listbox"
            aria-label={currentCountry ? `Selected country ${currentCountry.name}. Activate to change` : 'Select country'}
            onClick={() => {
              setOpen(o => !o);
              setActiveIndex(country ? countryOptions.findIndex(c => c.code === country) : -1);
            }}
            ref={triggerRef}
          >
            <span className="geo-flag" aria-hidden="true">{currentCountry ? flags[currentCountry.code] : '🌐'}</span>
            <span className="geo-flag-name">{currentCountry ? currentCountry.name : 'Select Country'}</span>
            <span className="geo-caret" aria-hidden="true" />
          </button>
          {open && (
            <ul
              className="geo-flag-menu"
              role="listbox"
              aria-label="Select country"
              title="Select country"
              ref={menuRef}
            >
              {countryOptions.map((c, idx) => {
                const selected = c.code === country;
                const active = idx === activeIndex;
                return (
                  <li
                    key={c.code}
                    role="option"
                    className={`geo-flag-option${selected ? ' is-selected' : ''}${active ? ' is-active' : ''}`}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      handleCountrySelect(c.code);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <span className="geo-flag" aria-hidden="true">{flags[c.code]}</span>
                    <span className="geo-option-name">{c.name}</span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="geo">
      {/* Country Dropdown */}
      <label htmlFor="country">Country:</label>
      <select
        id="country"
        value={country}
        onChange={(e) => handleCountrySelect(e.target.value)}
      >
        <option value="">Select Country</option>
        {countryOptions.map((c) => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
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
      {stateError && <div className="geo-error">{stateError}</div>}

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
      {cityError && <div className="geo-error">{cityError}</div>}
    </div>
  );
};

export default GeoDropdown;
