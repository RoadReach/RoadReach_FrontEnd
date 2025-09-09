import React, { useState, useRef, useEffect } from "react";
import { LocationSuggestion } from "./LocationDropdown";
import useRentalLocationSuggest from "./useRentalLocationSuggest";
import './RentalCars.css';

const RentalCars: React.FC = () => {
  const [sameLocation, setSameLocation] = useState(true);
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
  // Dates & times
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("12:00");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("12:00");
  const [is25, setIs25] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add search logic here
  };

  return (
    <div className="rental-form-container">
      <div className="rental-form-card">
        <form onSubmit={handleSubmit}>
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
                  <label className="rental-form-label">Pick-Up and Drop-Off Location*</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      setShowPickupSuggest(true);
                    }}
                    onFocus={() => setShowPickupSuggest(true)}
                    onBlur={() => setTimeout(() => setShowPickupSuggest(false), 150)}
                    placeholder="Airport, City, Zip Code or Address"
                    required
                    ref={pickupRef}
                    className="rental-form-input"
                  />
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
                <div className="rental-form-field">
                  <label className="rental-form-label">Pick-Up Date*</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                    className="rental-form-input"
                    aria-label="Pick-Up Date"
                    title="Pick-Up Date"
                  />
                </div>
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
                  <label className="rental-form-label">Drop-Off Date*</label>
                  <input
                    type="date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    required
                    className="rental-form-input"
                    aria-label="Drop-Off Date"
                    title="Drop-Off Date"
                  />
                </div>
                <div className="rental-form-field">
                  <label className="rental-form-label">Drop-Off Time*</label>
                  <select
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    required
                    className="rental-form-input"
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
                  <label className="rental-form-label">Pick-Up Location*</label>
                  <input
                    type="text"
                    value={pickupLocation}
                    onChange={(e) => {
                      setPickupLocation(e.target.value);
                      setShowPickupSuggest(true);
                    }}
                    onFocus={() => setShowPickupSuggest(true)}
                    onBlur={() => setTimeout(() => setShowPickupSuggest(false), 150)}
                    placeholder="Airport, City, Zip Code or Address"
                    required
                    ref={pickupRef}
                    className="rental-form-input"
                  />
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
                <div className="rental-form-field">
                  <label className="rental-form-label">Pick-Up Date*</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    required
                    className="rental-form-input"
                    aria-label="Pick-Up Date"
                    title="Pick-Up Date"
                  />
                </div>
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
                  <label className="rental-form-label">Drop-Off Location*</label>
                  <input
                    type="text"
                    value={dropoffLocation}
                    onChange={(e) => {
                      setDropoffLocation(e.target.value);
                      setShowDropoffSuggest(true);
                    }}
                    onFocus={() => setShowDropoffSuggest(true)}
                    onBlur={() => setTimeout(() => setShowDropoffSuggest(false), 150)}
                    placeholder="Airport, City, Zip Code or Address"
                    required
                    className="rental-form-input"
                  />
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
                <div className="rental-form-field">
                  <label className="rental-form-label">Drop-Off Date*</label>
                  <input
                    type="date"
                    value={dropoffDate}
                    onChange={(e) => setDropoffDate(e.target.value)}
                    required
                    className="rental-form-input"
                    aria-label="Drop-Off Date"
                    title="Drop-Off Date"
                  />
                </div>
                <div className="rental-form-field">
                  <label className="rental-form-label">Drop-Off Time*</label>
                  <select
                    value={dropoffTime}
                    onChange={(e) => setDropoffTime(e.target.value)}
                    required
                    className="rental-form-input"
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
              required
              className="rental-form-checkbox"
              aria-label="Confirm age at least 25"
              title="Confirm age at least 25"
            />
            <span className="rental-form-check-label">
              Yes, I am at least 25 years old.*
            </span>

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