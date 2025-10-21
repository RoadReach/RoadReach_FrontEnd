import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchVehicles, fetchVehiclePriceRange } from './vehicleService';
import type { Vehicle } from './vehicleService';
import './SelectVehicle.css';
import selectVehicleCar from '../assets/selectVehicleCar.png';
import alamo from '../assets/alamo.png';
import avis from '../assets/avis.png';
import budget from '../assets/budget.png';
import enterprise from '../assets/enterprise.png';

interface SearchState {
  sameLocation: boolean;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  is25: boolean;
}

const SelectVehicle: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const maybeState = location.state as unknown;
  const search: SearchState | undefined = (typeof maybeState === 'object' && maybeState !== null && 'search' in maybeState)
    ? (maybeState as { search: SearchState }).search
    : undefined;

  // Query param fallback (shareable URL) if no state present
  const params = new URLSearchParams(location.search);
  const fromQuery = !search && params.has('ploc') ? {
    sameLocation: params.get('same') === '1',
    pickupLocation: params.get('ploc') || '',
    dropoffLocation: params.get('dloc') || '',
    pickupDate: params.get('pd') || '',
    pickupTime: params.get('pt') || '',
    dropoffDate: params.get('dd') || '',
    dropoffTime: params.get('dt') || '',
    is25: params.get('a25') === '1'
  } : undefined;
  const criteria = search || fromQuery;
  // Stable hash for dependency arrays (object reference would change each render)
  const criteriaHash = criteria ? [
    criteria.pickupLocation,
    criteria.dropoffLocation,
    criteria.pickupDate,
    criteria.pickupTime,
    criteria.dropoffDate,
    criteria.dropoffTime,
    criteria.is25 ? '1' : '0',
    criteria.sameLocation ? '1' : '0'
  ].join('|') : '';

  // Helper: format date + time into 'Oct 21, 2025, 12:00 PM'
  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return '';
    try {
      // If time already contains AM/PM, normalize casing and append to formatted date
      if (timeStr && /[AP]M/i.test(timeStr)) {
        const dateOnly = new Date(dateStr);
        const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(dateOnly);
        return `${dateFmt}, ${timeStr.toUpperCase()}`;
      }

      // Build a Date from date + time (assume time like HH:mm or HH:mm:ss)
      let iso = dateStr;
      if (timeStr) {
        const t = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
        iso = `${dateStr}T${t}`;
      }
      let dt = new Date(iso);
      if (isNaN(dt.getTime())) {
        // Try a space-separated fallback
        dt = new Date(`${dateStr} ${timeStr || ''}`);
      }
      if (isNaN(dt.getTime())) {
        return `${dateStr} ${timeStr || ''}`.trim();
      }

      const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(dt);
      const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(dt);
      return `${dateFmt}, ${timeFmt}`;
    } catch {
      return `${dateStr} ${timeStr || ''}`.trim();
    }
  };

  // Filters & vehicle data hooks (must be unconditional)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  // Committed prices used for backend fetch
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(500);
  // Live slider edits (not yet applied to backend)
  const [sliderMin, setSliderMin] = useState(0);
  const [sliderMax, setSliderMax] = useState(500);
  const [pendingPriceChange, setPendingPriceChange] = useState(false);
  const vehicleTypes = ['Economy','Compact','Intermediate','Standard','Full Size','SUV','Luxury','Van'];
  const [typeFilters, setTypeFilters] = useState<string[]>([]);
  const capacityOptions = ['4-5 passengers','6+ passengers'];
  const [capacityFilters, setCapacityFilters] = useState<string[]>([]);
  const bagOptions = ['1-2 bags','3-4 bags','5+ bags'];
  const [bagFilters, setBagFilters] = useState<string[]>([]);
  const agencyOptions = ['Alamo','Avis','Budget','Enterprise Rent-A-Car'];
  const [agencyFilters, setAgencyFilters] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  // All vehicles returned from backend for current price range (no type filter so we can compute counts)
  const [vehiclesAll, setVehiclesAll] = useState<Vehicle[]>([]);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastSearchRef = useRef<string>('');
  const [selectedCell, setSelectedCell] = useState<{ type: string, company: string } | null>(null);
  const [showPriceDetails, setShowPriceDetails] = useState<{ vehicle: Vehicle } | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const [showGeoRestrictions, setShowGeoRestrictions] = useState(false);
  const [showAdditionalDrivers, setShowAdditionalDrivers] = useState(false);

  // Persist query params so page is shareable/bookmarkable
  useEffect(() => {
    if (!criteria) return;
    const p = new URLSearchParams();
    p.set('ploc', criteria.pickupLocation);
    p.set('dloc', criteria.dropoffLocation);
    p.set('pd', criteria.pickupDate);
    p.set('pt', criteria.pickupTime);
    p.set('dd', criteria.dropoffDate);
    p.set('dt', criteria.dropoffTime);
    if (criteria.sameLocation) p.set('same', '1');
    if (criteria.is25) p.set('a25', '1');
    if (minPrice !== priceRange[0]) p.set('minP', String(minPrice));
    if (maxPrice !== priceRange[1]) p.set('maxP', String(maxPrice));
    if (typeFilters.length) p.set('types', typeFilters.join(','));
    if (capacityFilters.length) p.set('cap', capacityFilters.join(','));
    if (bagFilters.length) p.set('bags', bagFilters.join(','));
    if (agencyFilters.length) p.set('ag', agencyFilters.join(','));
    const newSearch = '?' + p.toString();
    // Only navigate if search string actually changed (prevents update loops)
    if (newSearch !== lastSearchRef.current) {
      lastSearchRef.current = newSearch;
      if (newSearch !== location.search) {
        navigate({ search: newSearch }, { replace: true });
      }
    }
  // criteria object is represented via criteriaHash to avoid referential churn
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteriaHash, minPrice, maxPrice, priceRange, typeFilters, capacityFilters, bagFilters, agencyFilters, navigate, location.search]);

  // Fetch dynamic price range on first load (does not depend on filters beyond criteria)
  useEffect(() => {
    if (!criteria) return;
    fetchVehiclePriceRange({
      pickupLocation: criteria.pickupLocation,
      dropoffLocation: criteria.dropoffLocation,
      pickupDate: criteria.pickupDate,
      pickupTime: criteria.pickupTime,
      dropoffDate: criteria.dropoffDate,
      dropoffTime: criteria.dropoffTime,
      is25: criteria.is25
    }).then(range => {
      setPriceRange(range);
      setMinPrice(range[0]);
      setMaxPrice(range[1]);
      setSliderMin(range[0]);
      setSliderMax(range[1]);
      setError(null);
    }).catch(() => {
      setError('Failed to load price range. Please retry.');
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteriaHash]);

  // Fetch vehicles whenever committed min/max or criteria change
  // Fetch vehicles whenever committed min/max or criteria change
  useEffect(() => {
    if (!criteria) return;
    setError(null);
    // Use loading to indicate any active fetch (initial load or refresh)
    setLoading(true);
    fetchVehicles({
      pickupLocation: criteria.pickupLocation,
      dropoffLocation: criteria.dropoffLocation,
      pickupDate: criteria.pickupDate,
      pickupTime: criteria.pickupTime,
      dropoffDate: criteria.dropoffDate,
      dropoffTime: criteria.dropoffTime,
      is25: criteria.is25,
      minPrice: minPrice,
      maxPrice: maxPrice
    }).then(list => {
      setVehiclesAll(list);
      setLoading(false);
      setRefreshing(false);
      setError(null);
    }).catch(() => {
      setLoading(false);
      setRefreshing(false);
      setError('Failed to load vehicles. Please try again.');
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteriaHash, minPrice, maxPrice]);
  const noCriteria = !criteria;

  const toggleType = (t: string) => {
    setTypeFilters(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  const toggleGeneric = (value: string, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter(prev => prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]);
  };

  const matchesCapacity = useCallback((v: Vehicle) => {
    if (capacityFilters.length === 0) return true;
    return capacityFilters.some(range => {
      if (range.startsWith('4-5')) return v.passengers >= 4 && v.passengers <= 5;
      if (range.startsWith('6+')) return v.passengers >= 6;
      return true;
    });
  }, [capacityFilters]);

  const matchesBags = useCallback((v: Vehicle) => {
    if (bagFilters.length === 0) return true;
    return bagFilters.some(range => {
      if (range.startsWith('1-2')) return v.bags >= 1 && v.bags <= 2;
      if (range.startsWith('3-4')) return v.bags >= 3 && v.bags <= 4;
      if (range.startsWith('5+')) return v.bags >= 5;
      return true;
    });
  }, [bagFilters]);

  const matchesAgency = useCallback((v: Vehicle) => {
    if (agencyFilters.length === 0) return true;
    return agencyFilters.includes(v.company);
  }, [agencyFilters]);

  const filteredVehicles = useMemo(() => {
    return vehiclesAll.filter(v => {
      if (typeFilters.length && !typeFilters.includes(v.type)) return false;
      if (v.price < sliderMin || v.price > sliderMax) return false; // live price filtering
      return matchesCapacity(v) && matchesBags(v) && matchesAgency(v);
    });
  }, [vehiclesAll, typeFilters, matchesCapacity, matchesBags, matchesAgency, sliderMin, sliderMax]);

  // Counts for each type ignoring current type filter (but respecting other filters)
  const typeCounts: Record<string, number> = useMemo(() => {
    const base = vehiclesAll.filter(v => matchesCapacity(v) && matchesBags(v) && matchesAgency(v) && v.price >= sliderMin && v.price <= sliderMax);
    const map: Record<string, number> = {};
    base.forEach(v => { map[v.type] = (map[v.type] || 0) + 1; });
    return map;
  }, [vehiclesAll, matchesCapacity, matchesBags, matchesAgency, sliderMin, sliderMax]);

  // Min price per type (respect other filters & current live slider range)
  const typeMinPrice: Record<string, number> = useMemo(() => {
    const base = vehiclesAll.filter(v => matchesCapacity(v) && matchesBags(v) && matchesAgency(v) && v.price >= sliderMin && v.price <= sliderMax);
    const map: Record<string, number> = {};
    base.forEach(v => {
      if (map[v.type] == null || v.price < map[v.type]) map[v.type] = v.price;
    });
    return map;
  }, [vehiclesAll, matchesCapacity, matchesBags, matchesAgency, sliderMin, sliderMax]);

  // Slider fill percentages
  const sliderFill = useMemo(() => {
    const [minR, maxR] = priceRange;
    const span = Math.max(1, maxR - minR);
    const leftPct = ((sliderMin - minR) / span) * 100;
    const rightPct = ((sliderMax - minR) / span) * 100;
    return { left: leftPct, width: Math.max(0, rightPct - leftPct) };
  }, [priceRange, sliderMin, sliderMax]);

  // Update CSS vars for slider fill (no inline style enforcement)
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--slider-fill-left', sliderFill.left + '%');
    root.style.setProperty('--slider-fill-width', sliderFill.width + '%');
  }, [sliderFill]);

  // Find unique companies from filteredVehicles (or use agencyOptions for all columns)
  const companies = agencyOptions;

  return (
    <div className="select-vehicle__layout">
      {noCriteria ? (
        <div className="select-vehicle__wrapper">
          <div className="select-vehicle__card">
            <p>No search criteria found. Please start a new search.</p>
            <button className="btn btn--primary" onClick={() => navigate('/rental-cars')}>Start New Search</button>
          </div>
        </div>
      ) : (<>
      <aside className="select-vehicle__filters" aria-label="Filters">
        <h2 className="filters__title">Filter by</h2>
        <div className="filters__block">
          <p className="filters__subtitle">Price Range</p>
          <div className="dual-range" aria-label="Price range sliders">
            <input aria-label="Minimum price" type="range" min={priceRange[0]} max={priceRange[1]} value={sliderMin}
              onChange={e => { const v = Math.min(Number(e.target.value), sliderMax - 1); setSliderMin(v); setPendingPriceChange(true); }} />
            <input aria-label="Maximum price" type="range" min={priceRange[0]} max={priceRange[1]} value={sliderMax}
              onChange={e => { const v = Math.max(Number(e.target.value), sliderMin + 1); setSliderMax(v); setPendingPriceChange(true); }} />
            <div className="dual-range__track" aria-hidden="true">
              <div className="dual-range__fill" />
            </div>
          </div>
          <div className="price-inputs">
            <label>Min
              <input type="number" value={sliderMin} min={priceRange[0]} max={sliderMax-1} onChange={e => {
                let v = Number(e.target.value); if (isNaN(v)) v = sliderMin; v = Math.max(priceRange[0], Math.min(v, sliderMax - 1)); setSliderMin(v); setPendingPriceChange(true);
              }} />
            </label>
            <label>Max
              <input type="number" value={sliderMax} min={sliderMin+1} max={priceRange[1]} onChange={e => {
                let v = Number(e.target.value); if (isNaN(v)) v = sliderMax; v = Math.min(priceRange[1], Math.max(v, sliderMin + 1)); setSliderMax(v); setPendingPriceChange(true);
              }} />
            </label>
            <button className="btn btn--secondary price-apply" disabled={!pendingPriceChange}
              onClick={() => { setMinPrice(sliderMin); setMaxPrice(sliderMax); setPendingPriceChange(false); }}>
              Apply
            </button>
          </div>
        </div>
        <div className="filters__block">
          <div className="filters__row-head">
            <p className="filters__subtitle">Car Types</p>
            <span className="filters__from-col">From</span>
          </div>
          <ul className="filters__types filters__types--priced">
            {vehicleTypes.map(t => {
              const count = typeCounts[t] ?? 0;
              const price = typeMinPrice[t];
              const disabled = count === 0 || price == null;
              return (
                <li key={t} className={disabled ? 'is-disabled' : ''}>
                  <label className="filters__checkbox-label">
                    <input type="checkbox" disabled={disabled} checked={typeFilters.includes(t)} onChange={() => toggleType(t)} /> {t}
                  </label>
                  <span className="filters__type-price">{price != null ? `$${price}` : '-'}</span>
                </li>
              );
            })}
          </ul>
        </div>
        <hr className="filters__divider" />
        <div className="filters__block">
          <p className="filters__subtitle">Capacity</p>
          <ul className="filters__types">
            {capacityOptions.map(opt => (
              <li key={opt}>
                <label className="filters__checkbox-label">
                  <input type="checkbox" checked={capacityFilters.includes(opt)} onChange={() => toggleGeneric(opt, setCapacityFilters)} /> {opt}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <hr className="filters__divider" />
        <div className="filters__block">
          <p className="filters__subtitle">Bags</p>
          <ul className="filters__types">
            {bagOptions.map(opt => (
              <li key={opt}>
                <label className="filters__checkbox-label">
                  <input type="checkbox" checked={bagFilters.includes(opt)} onChange={() => toggleGeneric(opt, setBagFilters)} /> {opt}
                </label>
              </li>
            ))}
          </ul>
        </div>
        <hr className="filters__divider" />
        <div className="filters__block">
          <p className="filters__subtitle">Car Agencies</p>
          <ul className="filters__types">
            {agencyOptions.map(opt => (
              <li key={opt}>
                <label className="filters__checkbox-label">
                  <input type="checkbox" checked={agencyFilters.includes(opt)} onChange={() => toggleGeneric(opt, setAgencyFilters)} /> {opt}
                </label>
              </li>
            ))}
          </ul>
        </div>
        {(typeFilters.length > 0 || capacityFilters.length > 0 || bagFilters.length > 0 || agencyFilters.length > 0 || minPrice !== priceRange[0] || maxPrice !== priceRange[1]) && (
          <button
            className="filters__clear btn btn--secondary"
            onClick={() => {
              setTypeFilters([]);
              setCapacityFilters([]);
              setBagFilters([]);
              setAgencyFilters([]);
              setMinPrice(priceRange[0]);
              setMaxPrice(priceRange[1]);
              setSliderMin(priceRange[0]);
              setSliderMax(priceRange[1]);
              setPendingPriceChange(false);
            }}
          >Reset Filters</button>
        )}
        <div className="support-help" aria-label="Need help">
          <img src={new URL('../assets/support-agent.svg', import.meta.url).href} alt="Support" className="support-help__img" width={64} height={64} />
          <h3 className="support-help__title">Need Help?</h3>
          <p className="support-help__phone">
            <a href="tel:+18669217925" aria-label="Call 1 866 921 7925">Call 1-866-921-7925</a>
          </p>
          <p className="support-help__hours">Weekdays 05:00 AM - 07:00 PM<br/>Weekends 06:00 AM - 05:00 PM<br/>Pacific Time</p>
        </div>
    </aside>
    <main className="select-vehicle__main">
        <div className="select-vehicle__header">
          <h1 className="select-vehicle__title">Select Vehicle | RoadReach</h1>
          <div className="select-vehicle__header-actions">
            <button
              className="select-vehicle__edit"
              onClick={() => {
                // navigate to search form with same criteria so user can edit
                if (criteria) {
                  navigate('/rental-cars', { state: { search: criteria } });
                } else {
                  navigate('/rental-cars');
                }
              }}
              aria-label="Edit search"
            >
              Edit
            </button>
            <button className="select-vehicle__back" onClick={() => navigate(-1)}>&larr; Back</button>
          </div>
        </div>
        <div className="select-vehicle__criteria-bar">
          <div className="criteria__left">
            <div className="criteria__location">{criteria?.pickupLocation}</div>
            <div className="criteria__dates">{formatDateTime(criteria?.pickupDate, criteria?.pickupTime)} - {formatDateTime(criteria?.dropoffDate, criteria?.dropoffTime)}</div>
          </div>
          <div className="criteria__actions">
            <button
              className="select-vehicle__edit"
              onClick={() => {
                if (criteria) {
                  navigate('/rental-cars', { state: { search: criteria } });
                } else {
                  navigate('/rental-cars');
                }
              }}
            >
              Edit
            </button>
          </div>
        </div>
        {error && (
          <div className="select-vehicle__error" role="alert">
            {error} <button className="btn btn--secondary" onClick={() => {
              // simple refetch trigger: adjust maxPrice by +0 then back to force effect if criteria stable
              setError(null);
              setMinPrice(m => m);
            }}>Retry</button>
          </div>
        )}
        {loading && <div className="select-vehicle__loading" role="status">Loading vehicles...</div>}
        {!loading && !error && (
          <div className="vehicle-table-wrapper">
            <table className="vehicle-table-matrix">
              <thead>
                <tr>
                  <th className="sticky-left sticky-top">Taxes and fees are<br />included in the price</th>
                  {companies.map(company => (
                    <th key={company} className="sticky-top">
                      <img
                        src={
                          company === "Alamo" ? alamo :
                          company === "Avis" ? avis :
                          company === "Budget" ? budget :
                          company === "Enterprise Rent-A-Car" ? enterprise :
                          ""
                        }
                        alt={company}
                        className="vehicle-detail-card__agency-logo"
                      />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Custom info rows */}
                <tr>
                  <td className="sticky-left vehicle-table-info-cell" style={{ background: "#003a5c", color: "#fff", fontWeight: "bold" }}>Location:</td>
                  {companies.map(company => (
                    <td
                      key={company}
                      className="vehicle-table-info-cell"
                      style={{
                        background:
                          company === "Alamo"
                            ? "#476a83" // Example: yellow for Alamo
                            : company === "Budget"
                            ? "#476a83" // Example: light blue for Budget
                            : "#5a7990",
                        color: "#fff",
                        textAlign: "center",
                        fontSize: "1.2em"
                      }}
                    >
                      {criteria.pickupLocation}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="sticky-left vehicle-table-info-cell" style={{ background: "#003a5c", color: "#fff", fontWeight: "bold" }}>Address:</td>
                  {companies.map(company => (
                    <td
                      key={company}
                      className="vehicle-table-info-cell"
                      style={{
                        background:
                          company === "Alamo"
                            ? "#476a83"
                            : company === "Budget"
                            ? "#476a83"
                            : "#5a7990",
                        color: "#fff",
                        textAlign: "center"
                      }}
                    >
                      {criteria.pickupLocation}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="sticky-left vehicle-table-info-cell" style={{ background: "#003a5c", color: "#fff", fontWeight: "bold" }}>Pick-Up Hours:</td>
                  {companies.map(company => (
                    <td
                      key={company}
                      className="vehicle-table-info-cell"
                      style={{
                        background:
                          company === "Alamo"
                            ? "#476a83"
                            : company === "Budget"
                            ? "#476a83"
                            : "#5a7990",
                        color: "#fff",
                        textAlign: "center",
                        fontSize: "14px"
                      }}
                    >
                      12:00 AM - 01:00 AM<br />06:30 AM - 12:00 AM
                    </td>
                  ))}
                </tr>
                {/* Existing vehicle rows below */}
                {vehicleTypes.map((type, rowIdx) => {
                  const isSelectedRow = selectedCell?.type === type;
                  return (
                    <React.Fragment key={type}>
                      <tr className={rowIdx % 2 === 1 ? "vehicle-table-row-alt" : ""}>
                        <td className="sticky-left">{type}</td>
                        {companies.map(company => {
                          const vehicle = filteredVehicles.find(v => v.type === type && v.company === company);
                          return (
                            <td
                            key={company}
                            className={
                              vehicle && selectedCell?.type === type && selectedCell?.company === company
                                ? "vehicle-table-price--selected"
                                : ""
                            }
                          >
                            {vehicle ? (
                              <div
                                className="vehicle-table-price vehicle-table-price--clickable"
                                onClick={() => setSelectedCell({ type, company })}
                                style={{ cursor: 'pointer' }}
                                title="View details"
                              >
                                ${vehicle.price}
                              </div>
                            ) : (
                              <span className="vehicle-table-empty">—</span>
                            )}
                          </td>
                          );
                        })}
                      </tr>
                      {/* Card row: only show if this row is selected */}
                      {isSelectedRow && (
                        <tr>
                          <td colSpan={companies.length + 1} style={{ padding: 0, background: "#fff" }}>
                            {(() => {
                              const vehicle = filteredVehicles.find(
                                v => v.type === type && v.company === selectedCell.company
                              );
                              if (!vehicle) return null;
                              return (
                                <div className="vehicle-detail-card">
                                  <div className="vehicle-detail-card__info-row">
                                    <div className="vehicle-detail-card__info-box">
                                      <span className="vehicle-detail-card__info-icon" aria-label="Info">
                                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                                          <circle cx="16" cy="16" r="10" fill="#2d7bb3"/>
                                          <path d="M13.5 15.5l3.5 3.5 11.5-15" stroke="#fff" strokeWidth="3.5" strokeLinecap="square" strokeLinejoin="round"/>
                                        </svg>
                                      </span>
                                      The price includes your Costco Member discount and an upgrade.
                                    </div>
                                    <div className="vehicle-detail-card__reserve">
                                      Reserve Now, Pay Later<br />No Cancellation Fees
                                    </div>
                                  </div>
                                  <div className="vehicle-detail-card__main">
                                    <div className="vehicle-detail-card__left">
                                      <h2 className="vehicle-detail-card__title">{vehicle.type}</h2>
                                      <div className="vehicle-detail-card__agency-row">
                                        <img
                                          src={
                                            vehicle.company === "Alamo" ? alamo :
                                            vehicle.company === "Avis" ? avis :
                                            vehicle.company === "Budget" ? budget :
                                            vehicle.company === "Enterprise Rent-A-Car" ? enterprise :
                                            ""
                                          }
                                          alt={vehicle.company}
                                          className="vehicle-detail-card__agency-logo"
                                        />
                                        <span className="vehicle-detail-card__icon-group">
                                          <span title="Passengers">👤 {vehicle.passengers}</span>
                                          <span title="Bags" style={{ marginLeft: 12 }}>💼 {vehicle.bags}</span>
                                        </span>
                                      </div>
                                      <div className="vehicle-detail-card__car-features-row">
                                        <div className="vehicle-detail-card__car-features-left">
                                          <img src={selectVehicleCar} alt="Car" className="vehicle-detail-card__car-img" />
                                        </div>
                                        <div className="vehicle-detail-card__car-features-right">
                                          <ul className="vehicle-detail-card__features">
                                            <li>Unlimited mileage</li>
                                            <li><a
                                                  href="#"
                                                  className="vehicle-detail-card__geo-restrictions-link"
                                                  onClick={e => {
                                                    e.preventDefault();
                                                    setShowGeoRestrictions(true);
                                                  }}
                                                >Geographic and Other Restrictions</a></li>
                                            <li><a
                                                href="#"
                                                className="vehicle-detail-card__terms-link"
                                                onClick={e => {
                                                  e.preventDefault();
                                                  setShowAdditionalDrivers(true);
                                                }}
                                              >Additional Driver Included</a></li>
                                            <li>{vehicle.transmission.toUpperCase()} transmission, Air conditioning</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="vehicle-detail-card__right">

                                      <div className="vehicle-detail-card__price-details">
                                        <a
                                          href="#"
                                          className="vehicle-detail-card__price-link"
                                          onClick={e => {
                                            e.preventDefault();
                                            setShowPriceDetails({ vehicle });
                                          }}
                                        >
                                          Price Details
                                        </a>
                                        <div className="vehicle-detail-card__price-main">${vehicle.price.toFixed(2)}</div>
                                        <div className="vehicle-detail-card__price-sub">Total Price</div>
                                        <a
                                          href="#"
                                          className="vehicle-detail-card__terms-link"
                                          onClick={e => {
                                            e.preventDefault();
                                            setShowTerms(true);
                                          }}
                                        >
                                          Terms & Conditions
                                        </a>
                                      </div>
                                      <button className="btn btn--primary vehicle-detail-card__continue" onClick={() => alert('Continue flow')}>Continue</button>
                                    </div>
                                  </div>
                                  <div className="vehicle-detail-card__rewards">
                                    Earn approximately <strong>$1.57</strong> towards your <a href="#">Executive Member 2% Reward</a><br />
                                    Earn up to <strong>3% CASH BACK REWARDS</strong> on eligible travel with the <a href="#">RoadReach Anywhere Visa® Card by Citi</a>
                                  </div>
                                </div>
                              );
                            })()}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        {activeVehicle && (
  <div className="vehicle-modal" role="dialog" aria-modal="true" aria-label="Vehicle details">
    <div className="vehicle-modal__dialog vehicle-modal__dialog--detailed">
      <button className="vehicle-modal__close" onClick={() => setActiveVehicle(null)} aria-label="Close">×</button>
      <div className="vehicle-modal__main-details">
        <div className="vehicle-modal__agency">
          <img src={`/assets/${activeVehicle.company.toLowerCase().replace(/[^a-z]/g, '')}-logo.png`} alt={activeVehicle.company} className="vehicle-modal__agency-logo" />
        </div>
        <h2 className="vehicle-modal__title">{activeVehicle.type}</h2>
        <div className="vehicle-modal__icons">
          <span title="Passengers">👤 {activeVehicle.passengers}</span>
          <span title="Bags" style={{ marginLeft: 12 }}>🧳 {activeVehicle.bags}</span>
        </div>
        <img src="/assets/car-placeholder.png" alt="Car" className="vehicle-modal__car-img" />
        <div className="vehicle-modal__price-details">
          <div>Reserve Now, Pay Later<br />No Cancellation Fees</div>
          <div>
            <a
              href="#"
              className="vehicle-modal__price-link"
              onClick={e => {
                e.preventDefault();
                setShowPriceDetails({ vehicle: activeVehicle });
              }}
            >
              Price Details
            </a>
            <div className="vehicle-modal__price-main">${activeVehicle.price}</div>
            {/* Blue highlight box just under the price */}
            <div className="vehicle-modal__blue-info">
              <span className="vehicle-modal__blue-info-icon">✔️</span>
              "The price includes your Costco Member discount and an upgrade."
            </div>
            <div className="vehicle-modal__price-sub">Total Price</div>
            <a
              href="#"
              className="vehicle-detail-card__terms-link"
              onClick={e => {
                e.preventDefault();
                setShowTerms(true);
              }}
            >
              Terms & Conditions
            </a>
          </div>
        </div>
        <ul className="vehicle-modal__list">
          <li>Unlimited mileage</li>
           <li><a
                href="#"
                className="vehicle-detail-card__geo-restrictions-link"
                onClick={e => {
                e.preventDefault();
                setShowGeoRestrictions(true);
                }}
                >Geographic and Other Restrictions</a></li>
          <li><a
              href="#"
              className="vehicle-detail-card__terms-link"
              onClick={e => {
              e.preventDefault();
              setShowTerms(true);
            }}
            >Additional Driver Included</a></li>
          <li>{activeVehicle.transmission} transmission, Air conditioning</li>
          {activeVehicle.eco && <li>Eco Friendly</li>}
          {activeVehicle.luxury && <li>Luxury Class</li>}
        </ul>
        <button className="btn btn--primary vehicle-modal__continue" onClick={() => alert('Proceed flow placeholder')}>Continue</button>
        <div className="vehicle-modal__rewards">
          Earn approximately <strong>$1.57</strong> towards your <a href="#">Executive Member 2% Reward</a><br />
          Earn up to <strong>3% CASH BACK REWARDS</strong> on eligible travel with the <a href="#">Costco Anywhere Visa® Card by Citi</a>
        </div>
      </div>
    </div>
  </div>
)}
{showPriceDetails && (
  <div className="vehicle-modal" role="dialog" aria-modal="true" aria-label="Price details">
    <div className="price-details-modal__dialog">
      <div className="price-details-modal__header">
        Price Details
        <button className="price-details-modal__close" onClick={() => setShowPriceDetails(null)} aria-label="Close">×</button>
      </div>
      <div className="price-details-modal__body">
        <div className="price-details-modal__row price-details-modal__row--total">
          <span>Total Price</span>
          <span style={{ fontSize: '36px' }}>${showPriceDetails.vehicle.price.toFixed(2)}</span>
        </div>
        <div className="price-details-modal__row">
          <span className="price-details-modal__row--label">Car Rental</span>
          <span className="price-details-modal__row--value">${(showPriceDetails.vehicle.price * 0.9).toFixed(2)}</span>
        </div>
        <div className="price-details-modal__row price-details-modal__row--tax">
          <span className="price-details-modal__row--label">Taxes and Fees</span>
          <span className="price-details-modal__row--value">${(showPriceDetails.vehicle.price * 0.1).toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>
)}
{showTerms && (
  <div className="vehicle-modal" role="dialog" aria-modal="true" aria-label="Terms and Conditions">
    <div className="terms-details-modal__dialog">
      <div className="price-details-modal__header">
        Terms & Conditions
        <button className="price-details-modal__close" onClick={() => setShowTerms(false)} aria-label="Close">×</button>
      </div>
      <div className="terms-details-modal__body">
        <div style={{ fontSize: '1.1rem', color: '#003a5c', lineHeight: '1.7' }}>
          {/* Replace below with your actual terms */}
          <p style={{ fontSize: '30px',marginTop:0}}>Terms & Conditions</p>
          <p className="terms-details-text">Debit cards may not be an accepted form of payment;
            see your rental itinerary for details. Should you wish to make a change to your rental,
            book a new reservation with the updated information and then cancel your original
            reservation. Payment information is not required to confirm this reservation.
            The reservation may be cancelled at any time, without penalty, prior to pickup
            of the vehicle. One additional driver fee will be waived for Costco members at
            participating locations. Additional drivers will need a valid driver's license
            and a major credit card. All additional drivers must meet the renter requirements;
            including age, car class, and location requirements. For full requirements regarding
            additional drivers, please contact your pick-up location. An additional daily fee will
            apply to all additional drivers not described above. Please note: For changes made to
            the reservation, the original rental rate is subject to change. Early or late pickups
            as well as early or late drop offs and any returns to an alternate location are subject
            to charges or penalties paid by the renter directly through the rental car company.
            Please check your insurance policy and/or credit card agreement for rental vehicle
            coverage. Prices are available only to Costco members residing in the United States.
          </p><br />
          <p className="terms-details-text">
            The savings of up to 30% applies to Budget base rates and is applicable only to the time
            and mileage charges of the rental. Offer does not apply to car group X. All taxes, fees
            (including but not limited to Air Conditioning Excise Recovery Fee, Concession Recovery
            Fee, Vehicle License Recovery Fee, Energy Recovery Fee, Tire Management Fee, and Frequent
            Traveler Fee) and surcharges (including but not limited to Customer Facility Charge and
            Environmental Fee Recovery Charge) are extra. Offer is available for U.S. residents only
            for rentals at participating locations in the U.S., Puerto Rico, U.S. Virgin Islands, and
            Canada. Offer may not be used in conjunction with any other BCD number, promotion or offer.
            Weekly rates require a minimum five day rental period. Weekend rate available Thursday noon;
            car must be returned by Monday 11:59 p.m., or higher rate will apply. A Saturday night keep
            and an advance reservation may be required. Offer is subject to vehicle availability at the
            time of rental and may not be available on some rates at some times, including some online
            rates at Budget.com. Car rental return restrictions may apply. Offer subject to change
            without notice. Holiday and other blackout periods may apply. Renter must meet Budget age,
            driver and credit requirements. Minimum age may vary by location. An additional daily
            surcharge may apply for renters under 25 years old. Fuel charges are extra. (CM)</p>
        </div>
      </div>
    </div>
  </div>
)}
{showGeoRestrictions && (
          <div className="vehicle-modal" role="dialog" aria-modal="true" aria-label="Geographic Restrictions">
            <div className="geo-details-modal__dialog">
              <div className="price-details-modal__header">
                Geographic Restrictions
                <button className="price-details-modal__close" onClick={() => setShowGeoRestrictions(false)} aria-label="Close">×</button>
              </div>
              <div>
              <div style={{ fontSize: '1.1rem', color: '#003a5c', lineHeight: '1.7' }}>
                {/* Replace below with your actual terms */}

                <p className="geo-details-text">
                  Rentals originating in the United States: Most vehicles rented in the US can be
                  driven throughout the US and Canada. Some vehicle classes like Exotics, Large
                  Passenger or Cargo Vans, and other specialty vehicles may not be allowed to
                  travel outside of the US. Vehicles rented in the US cannot be driven into Mexico.
                </p>
               </div>
              </div>
            </div>
          </div>
)}
{showAdditionalDrivers && (
          <div className="vehicle-modal" role="dialog" aria-modal="true" aria-label="Additional Driver">
            <div className="geo-details-modal__dialog">
              <div className="price-details-modal__header">
                Additional Driver Included
                <button className="price-details-modal__close" onClick={() => setShowAdditionalDrivers(false)} aria-label="Close">×</button>
              </div>
              <div>
              <div style={{ fontSize: '1.1rem', color: '#003a5c', lineHeight: '1.7' }}>
                {/* Replace below with your actual terms */}

                <p className="geo-details-text">
                  One additional driver fee will be waived for Costco members at participating
                  locations. Age restrictions and renter requirements may apply.
                </p>
               </div>
              </div>
            </div>
          </div>
)}
      </main>
      </> )}
    </div>
  );
};

export default SelectVehicle;