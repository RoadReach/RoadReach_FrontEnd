import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { LocationSuggestion } from "./LocationDropdown";
import useRentalLocationSuggest from "./useRentalLocationSuggest";
import './RentalCars.css';

const RentalCars: React.FC = () => {
  const [sameLocation, setSameLocation] = useState(true);
  const navigate = useNavigate();
  // Country from header (GeoDropdown)
  const [country, setCountry] = useState<'us' | 'ca'>((localStorage.getItem("selectedCountry")?.toLowerCase() as 'us' | 'ca') || 'us');

  useEffect(() => {
    const handleStorage = () => {
      const newCountry = (localStorage.getItem("selectedCountry")?.toLowerCase() as 'us' | 'ca') || 'us';
      setCountry(newCountry);
      setPickupLocation("");
      setDropoffLocation("");
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);
  // Pick-up
  const [pickupLocation, setPickupLocation] = useState("");
  const [showPickupSuggest, setShowPickupSuggest] = useState(false);
  const pickupRef = useRef<HTMLInputElement>(null);
  const { suggestions: pickupSuggestions, loading: pickupLoading } = useRentalLocationSuggest(pickupLocation, country);
  // Drop-off
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [showDropoffSuggest, setShowDropoffSuggest] = useState(false);
  const { suggestions: dropoffSuggestions, loading: dropoffLoading } = useRentalLocationSuggest(dropoffLocation, country);

  // Debug logging
  useEffect(() => {
    console.log('Country:', country);
    console.log('Pickup Suggestions:', pickupSuggestions);
    console.log('Dropoff Suggestions:', dropoffSuggestions);
  }, [country, pickupSuggestions, dropoffSuggestions]);
  // Helper to format a Date as YYYY-MM-DD in LOCAL time (avoids UTC shift from toISOString)
  const formatLocalDate = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  // Dates & times (initialize immediately so inputs are pre-filled on first render)
  const [pickupDate, setPickupDate] = useState(() => {
    const today = new Date();
    return formatLocalDate(today);
  });
  const [pickupTime, setPickupTime] = useState("12:00");
  const [dropoffDate, setDropoffDate] = useState(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return formatLocalDate(tomorrow);
  });
  const [dropoffTime, setDropoffTime] = useState("12:00");
  const [is25, setIs25] = useState(false);
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Format date for display (MM/DD/YYYY) and parse back to ISO (YYYY-MM-DD)
  const formatDisplayDate = (iso: string) => {
    if (!iso) return '';
    const [y,m,d] = iso.split('-');
    return `${m}/${d}/${y}`;
  };
  const parseDisplayDate = (display: string): string | null => {
    // Accept MM/DD/YYYY digits with optional slashes while typing
    const cleaned = display.replace(/[^0-9/]/g,'');
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(cleaned)) return null;
    const [mm,dd,yyyy] = cleaned.split('/');
    const month = Number(mm); const day = Number(dd); const year = Number(yyyy);
    if (month < 1 || month > 12) return null;
    const daysInMonth = new Date(year, month, 0).getDate();
    if (day < 1 || day > daysInMonth) return null;
    const iso = `${year}-${mm}-${dd}`;
    return iso;
  };

  interface DateFieldProps {
    label: string;
    value: string; // ISO yyyy-mm-dd
    onChange: (iso: string) => void;
    min: string;
    required?: boolean;
    invalid?: boolean;
    ariaLabel: string;
    title: string;
  }

  const DateField: React.FC<DateFieldProps> = ({ label, value, onChange, min, required, invalid, ariaLabel, title }) => {
    const [display, setDisplay] = useState<string>(formatDisplayDate(value));
    const prevISORef = useRef(value);
    const hiddenRef = useRef<HTMLInputElement>(null);

    // Sync display when external ISO value changes
    useEffect(() => {
      if (value !== prevISORef.current) {
        prevISORef.current = value;
        setDisplay(formatDisplayDate(value));
      }
    }, [value]);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let v = e.target.value;
      // Auto-insert slashes as user types digits
      const digits = v.replace(/[^0-9]/g, '');
      if (digits.length <= 8) {
  const mm = digits.slice(0,2);
  const dd = digits.slice(2,4);
  const yyyy = digits.slice(4,8);
        v = mm;
        if (dd) v += '/' + dd; else if (digits.length > 2) v += '/';
        if (yyyy) v += '/' + yyyy; else if (digits.length > 4) v += '/';
      }
      setDisplay(v);
      const iso = parseDisplayDate(v);
      if (iso) {
        // Validate against min
        if (iso >= min) {
          onChange(iso);
        }
      }
    };

    const handleBlur = () => {
      const iso = parseDisplayDate(display);
      if (!iso || iso < min) {
        // revert to last valid value
        setDisplay(formatDisplayDate(value));
      } else if (iso !== value) {
        onChange(iso);
      }
    };

    return (
      <div className="rental-form-field">
        <label className="rental-form-label">{label}</label>
        <div className="rental-form-date-wrapper">
          <input
            type="text"
            inputMode="numeric"
            placeholder="MM/DD/YYYY"
            value={display}
            onChange={handleTextChange}
            onBlur={handleBlur}
            required={required}
            className={`rental-form-input${invalid ? ' rental-form-input--invalid' : ''}`}
            {...(invalid ? { 'aria-invalid': 'true' } : {})}
            aria-label={ariaLabel}
            title={title}
          />
          <button
            type="button"
            className="rental-form-date-btn"
            aria-label={`Choose ${label}`}
            onClick={() => {
              const el = hiddenRef.current;
              if (!el) return;
              if ('showPicker' in el && typeof (el as unknown as { showPicker?: () => void }).showPicker === 'function') {
                try { (el as unknown as { showPicker: () => void }).showPicker(); return; } catch { /* ignore */ }
              }
              // Fallback: trigger click to open native picker (Safari/iOS/Firefox variants)
              el.click();
              el.focus();
            }}
          >📅</button>
          <input
            ref={hiddenRef}
            type="date"
            className="rental-form-date-hidden"
            tabIndex={-1}
            aria-hidden="true"
            value={value}
            min={min}
            onChange={(e) => {
              const iso = e.target.value;
              if (iso && iso >= min) {
                onChange(iso);
              }
            }}
          />
        </div>
      </div>
    );
  };

  // (Removed post-mount initialization effect; defaults now provided via useState initializers.)

  // Ensure dropoff always >= pickup; if user sets pickup beyond dropoff, auto-adjust
  useEffect(() => {
    if (pickupDate && dropoffDate && pickupDate >= dropoffDate) {
      const d = new Date(pickupDate + 'T00:00:00');
      d.setDate(d.getDate() + 1);
      setDropoffDate(formatLocalDate(d));
    }
  }, [pickupDate, dropoffDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    const locationValid = sameLocation ? !!pickupLocation : (!!pickupLocation && !!dropoffLocation);
    if (!locationValid || !pickupDate || !dropoffDate || !is25) {
      return; // show validation
    }
    const params = new URLSearchParams({
      same: sameLocation ? '1' : '0',
      ploc: pickupLocation,
      dloc: sameLocation ? pickupLocation : dropoffLocation,
      pd: pickupDate,
      pt: pickupTime,
      dd: dropoffDate,
      dt: dropoffTime,
      a25: is25 ? '1' : '0'
    });
    navigate(`/select-vehicle?${params.toString()}`, {
      state: {
        search: {
          sameLocation,
          pickupLocation,
          dropoffLocation: sameLocation ? pickupLocation : dropoffLocation,
          pickupDate,
          pickupTime,
          dropoffDate,
          dropoffTime,
          is25
        }
      }
    });
  };

  return (
    <div className="rental-form-container">
      <div className="rental-form-card">
        <form onSubmit={handleSubmit}>
          {/** Staged validation: age checkbox error waits until location(s) valid */}
          <div className="rental-form-radio-row">
            <label className="rental-form-radio-label">
              <input
                type="radio"
                checked={sameLocation}
                onChange={() => setSameLocation(true)}
                className="rental-form-radio-input"
              />
              Pick-up and Drop-off at Same Location
            </label>
            <label className="rental-form-radio-label rental-form-radio-label-margin">
              <input
                type="radio"
                checked={!sameLocation}
                onChange={() => setSameLocation(false)}
                className="rental-form-radio-input"
              />
              Drop-off at Different Location
            </label>
            <span className="rental-form-required">* Indicates required fields</span>
          </div>
          <div className={`rental-form-fields-row${sameLocation ? " rental-form-fields-row--span" : ""}`}>
            {sameLocation ? (
              <>
                <div className="rental-form-field">
                  <label className="rental-form-label" htmlFor="pickupLocationSame">Pick-Up and Drop-Off Location*</label>
                  <input
                    id="pickupLocationSame"
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      setShowPickupSuggest(true);
                    }}
                    onFocus={() => setShowPickupSuggest(true)}
                    onBlur={() => setTimeout(() => setShowPickupSuggest(false), 150)}
                    placeholder="Airport, City, Zip Code or Address"
                    ref={pickupRef}
                    className={`rental-form-input${submitAttempted && !pickupLocation ? ' rental-form-input--invalid' : ''}`}
                    {...(submitAttempted && !pickupLocation ? { 'aria-invalid': 'true' } : {})}
                  />
                  {/** No inline text error; red border only */}
                  {(showPickupSuggest && pickupLocation.length >= 2) && (
                    <ul className="rental-form-suggest-list">
                      {pickupLoading && (
                        <li className="rental-form-suggest-loading">Loading...</li>
                      )}
                      {!pickupLoading && Array.isArray(pickupSuggestions) && pickupSuggestions.length === 0 && (
                        <li className="rental-form-suggest-none">No locations found</li>
                      )}
                      {!pickupLoading && Array.isArray(pickupSuggestions) && pickupSuggestions.length > 0 && pickupSuggestions.map((loc, idx) => (
                        <li key={loc.id || idx} className="rental-form-suggest-item"
                          onMouseDown={() => {
                            setPickupLocation(loc.name);
                            setShowPickupSuggest(false);
                          }}
                        >
                          <LocationSuggestion
                            type={loc.type}
                            name={loc.name}
                            country={loc.countryCode}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <DateField
                  label="Pick-Up Date*"
                  value={pickupDate}
                  onChange={setPickupDate}
                  min={formatLocalDate(new Date())}
                  invalid={submitAttempted && !pickupDate}
                  ariaLabel="Pick-Up Date"
                  title="Pick-Up Date"
                />
                {submitAttempted && !pickupDate && (
                  <div className="rental-form-field-error">Pick-Up date is required</div>
                )}
                <div className="rental-form-field">
                  <label className="rental-form-label">Pick-Up Time*</label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                    className="rental-form-input rental-form-time-select"
                    aria-label="Pick-Up Time"
                    title="Pick-Up Time"
                  >
                    {Array.from({ length: 48 }, (_, i) => {
                      const hour = Math.floor(i / 2);
                      const minute = i % 2 === 0 ? '00' : '30';
                      const value = `${hour.toString().padStart(2, '0')}:${minute}`;
                      const label = value === '12:00' ? 'Noon' : value;
                      return <option key={value} value={value}>{label}</option>;
                    })}
                  </select>
                </div>
                <DateField
                  label="Drop-Off Date*"
                  value={dropoffDate}
                  onChange={setDropoffDate}
                  min={pickupDate || formatLocalDate(new Date())}
                  invalid={submitAttempted && !dropoffDate}
                  ariaLabel="Drop-Off Date"
                  title="Drop-Off Date"
                />
                {submitAttempted && !dropoffDate && (
                  <div className="rental-form-field-error">Drop-Off date is required</div>
                )}
                <div className="rental-form-field">
                  <label className="rental-form-label">Drop-Off Time*</label>
                  <select
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    required
                    className="rental-form-input rental-form-time-select"
                    aria-label="Drop-Off Time"
                    title="Drop-Off Time"
                  >
                    {Array.from({ length: 48 }, (_, i) => {
                      const hour = Math.floor(i / 2);
                      const minute = i % 2 === 0 ? '00' : '30';
                      const value = `${hour.toString().padStart(2, '0')}:${minute}`;
                      const label = value === '12:00' ? 'Noon' : value;
                      return <option key={value} value={value}>{label}</option>;
                    })}
                  </select>
                </div>
              </>
            ) : (
              <>
                <div className="rental-form-field">
                  <label className="rental-form-label" htmlFor="pickupLocation">Pick-Up Location*</label>
                  <input
                    id="pickupLocation"
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      setShowPickupSuggest(true);
                    }}
                    onFocus={() => setShowPickupSuggest(true)}
                    onBlur={() => setTimeout(() => setShowPickupSuggest(false), 150)}
                    placeholder="Airport, City, Zip Code or Address"
                    ref={pickupRef}
                    className={`rental-form-input${submitAttempted && !pickupLocation ? ' rental-form-input--invalid' : ''}`}
                    {...(submitAttempted && !pickupLocation ? { 'aria-invalid': 'true' } : {})}
                  />
                  {/** No inline text error; red border only */}
                  {(showPickupSuggest && pickupLocation.length >= 2) && (
                    <ul className="rental-form-suggest-list">
                      {pickupLoading && (
                        <li className="rental-form-suggest-loading">Loading...</li>
                      )}
                      {!pickupLoading && Array.isArray(pickupSuggestions) && pickupSuggestions.length === 0 && (
                        <li className="rental-form-suggest-none">No locations found</li>
                      )}
                      {!pickupLoading && Array.isArray(pickupSuggestions) && pickupSuggestions.length > 0 && pickupSuggestions.map((loc, idx) => (
                        <li key={loc.id || idx} className="rental-form-suggest-item"
                          onMouseDown={() => {
                            setPickupLocation(loc.name);
                            setShowPickupSuggest(false);
                          }}
                        >
                          <LocationSuggestion
                            type={loc.type}
                            name={loc.name}
                            country={loc.countryCode}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <DateField
                  label="Pick-Up Date*"
                  value={pickupDate}
                  onChange={setPickupDate}
                  min={formatLocalDate(new Date())}
                  required
                  invalid={submitAttempted && !pickupDate}
                  ariaLabel="Pick-Up Date"
                  title="Pick-Up Date"
                />
                <div className="rental-form-field">
                  <label className="rental-form-label">Pick-Up Time*</label>
                  <select
                    value={pickupTime}
                    onChange={(e) => setPickupTime(e.target.value)}
                    required
                    className="rental-form-input"
                    aria-label="Pick-Up Time"
                    title="Pick-Up Time"
                  >
                    {Array.from({ length: 48 }, (_, i) => {
                      const hour = Math.floor(i / 2);
                      const minute = i % 2 === 0 ? '00' : '30';
                      const value = `${hour.toString().padStart(2, '0')}:${minute}`;
                      const label = value === '12:00' ? 'Noon' : value;
                      return <option key={value} value={value}>{label}</option>;
                    })}
                  </select>
                </div>
                <div className="rental-form-field">
                  <label className="rental-form-label" htmlFor="dropoffLocation">Drop-Off Location*</label>
                  <input
                    id="dropoffLocation"
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => {
                      setDropoffLocation(e.target.value);
                      setShowDropoffSuggest(true);
                    }}
                    onFocus={() => setShowDropoffSuggest(true)}
                    onBlur={() => setTimeout(() => setShowDropoffSuggest(false), 150)}
                    placeholder="Airport, City, Zip Code or Address"
                    className={`rental-form-input${submitAttempted && !dropoffLocation ? ' rental-form-input--invalid' : ''}`}
                    {...(submitAttempted && !dropoffLocation ? { 'aria-invalid': 'true' } : {})}
                  />
                  {/** No inline text error; red border only */}
                  {(showDropoffSuggest && dropoffLocation.length >= 2) && (
                    <ul className="rental-form-suggest-list">
                      {dropoffLoading && (
                        <li className="rental-form-suggest-loading">Loading...</li>
                      )}
                      {!dropoffLoading && Array.isArray(dropoffSuggestions) && dropoffSuggestions.length === 0 && (
                        <li className="rental-form-suggest-none">No locations found</li>
                      )}
                      {!dropoffLoading && Array.isArray(dropoffSuggestions) && dropoffSuggestions.length > 0 && dropoffSuggestions.map((loc, idx) => (
                        <li key={loc.id || idx} className="rental-form-suggest-item"
                          onMouseDown={() => {
                            setDropoffLocation(loc.name);
                            setShowDropoffSuggest(false);
                          }}
                        >
                          <LocationSuggestion
                            type={loc.type}
                            name={loc.name}
                            country={loc.countryCode}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <DateField
                  label="Drop-Off Date*"
                  value={dropoffDate}
                  onChange={setDropoffDate}
                  min={pickupDate || formatLocalDate(new Date())}
                  invalid={submitAttempted && !dropoffDate}
                  ariaLabel="Drop-Off Date"
                  title="Drop-Off Date"
                />
                {submitAttempted && !dropoffDate && (
                  <div className="rental-form-field-error">Drop-Off date is required</div>
                )}
                <div className="rental-form-field">
                  <label className="rental-form-label">Drop-Off Time*</label>
                  <select
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    required
                    className="rental-form-input rental-form-time-select"
                    aria-label="Drop-Off Time"
                    title="Drop-Off Time"
                  >
                    {Array.from({ length: 48 }, (_, i) => {
                      const hour = Math.floor(i / 2);
                      const minute = i % 2 === 0 ? '00' : '30';
                      const value = `${hour.toString().padStart(2, '0')}:${minute}`;
                      const label = value === '12:00' ? 'Noon' : value;
                      return <option key={value} value={value}>{label}</option>;
                    })}
                  </select>
                </div>
              </>
            )}
          </div>
          <div className="rental-form-check-row">
            <input
              type="checkbox"
              checked={is25}
              onChange={(e) => setIs25(e.target.checked)}
              className="rental-form-checkbox"
              aria-label="Confirm age at least 25"
              title="Confirm age at least 25"
            />
            <span className="rental-form-check-label">
              Yes, I am at least 25 years old.*
            </span>
            {(() => {
              const locationValidRender = sameLocation ? !!pickupLocation : (!!pickupLocation && !!dropoffLocation);
              return submitAttempted && locationValidRender && !is25 ? (
                <span className="rental-form-error-inline">Required</span>
              ) : null;
            })()}
            <span className="rental-form-powered-inline">Driven by <strong>Low Price Finder&trade;</strong></span>

          </div>
          <div className="rental-form-submit-row">
            <button
              type="submit"
              className="rental-form-submit-btn"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RentalCars;