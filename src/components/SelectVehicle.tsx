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
  const [refreshing, setRefreshing] = useState(false);
  // All vehicles returned from backend for current price range (no type filter so we can compute counts)
  const [vehiclesAll, setVehiclesAll] = useState<Vehicle[]>([]);
  const [activeVehicle, setActiveVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState<string | null>(null);
  const lastSearchRef = useRef<string>('');
  const [selectedCell, setSelectedCell] = useState<{ type: string, company: string } | null>(null);

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
  useEffect(() => {
    if (!criteria) return;
    setError(null);
    if (vehiclesAll.length === 0) setLoading(true); else setRefreshing(true);
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

  const proceed = (v: Vehicle) => {
    setActiveVehicle(v);
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
          <button className="select-vehicle__back" onClick={() => navigate(-1)}>&larr; Back</button>
        </div>
        <div className="select-vehicle__summary">
      <div><strong>Pick-Up:</strong> {criteria?.pickupLocation} • {criteria?.pickupDate} {criteria?.pickupTime}</div>
      <div><strong>Drop-Off:</strong> {criteria?.dropoffLocation} • {criteria?.dropoffDate} {criteria?.dropoffTime}</div>
      <div><strong>Age 25+:</strong> {criteria?.is25 ? 'Yes' : 'No'}</div>
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
                  <th className="sticky-left sticky-top">Type</th>
                  {companies.map(company => (
                    <th key={company} className="sticky-top">{company}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
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
                                      <span className="vehicle-detail-card__info-icon">✔️</span>
                                      The price includes your Costco Member discount.
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
                                          <span title="Bags" style={{ marginLeft: 12 }}>🧳 {vehicle.bags}</span>
                                        </span>
                                      </div>
                                      <div className="vehicle-detail-card__car-features-row">
                                        <div className="vehicle-detail-card__car-features-left">
                                          <img src={selectVehicleCar} alt="Car" className="vehicle-detail-card__car-img" />
                                        </div>
                                        <div className="vehicle-detail-card__car-features-right">
                                          <ul className="vehicle-detail-card__features">
                                            <li>Unlimited mileage</li>
                                            <li><a href="#">Geographic and Other Restrictions</a></li>
                                            <li><a href="#">Additional Driver Included</a></li>
                                            <li>{vehicle.transmission.toUpperCase()} transmission, Air conditioning</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="vehicle-detail-card__right">
                                      
                                      <div className="vehicle-detail-card__price-details">
                                        <a href="#" className="vehicle-detail-card__price-link">Price Details</a>
                                        <div className="vehicle-detail-card__price-main">${vehicle.price.toFixed(2)}</div>
                                        <div className="vehicle-detail-card__price-sub">Total Price</div>
                                        <a href="#" className="vehicle-detail-card__terms-link">Terms & Conditions</a>
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
            <a href="#" className="vehicle-modal__price-link">Price Details</a>
            <div className="vehicle-modal__price-main">${activeVehicle.price}</div>
            {/* Blue highlight box just under the price */}
            <div className="vehicle-modal__blue-info">
              <span className="vehicle-modal__blue-info-icon">✔️</span>
              {activeVehicle.company === "Avis"
                ? "The price includes savings of up to 25% off Avis base rates."
                : "The price includes your Costco Member discount and an upgrade."}
            </div>
            <div className="vehicle-modal__price-sub">Total Price</div>
            <a href="#" className="vehicle-modal__terms-link">Terms & Conditions</a>
          </div>
        </div>
        <ul className="vehicle-modal__list">
          <li>Unlimited mileage</li>
          <li><a href="#">Geographic and Other Restrictions</a></li>
          <li><a href="#">Additional Driver Included</a></li>
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
      </main>
      </> )}
    </div>
  );
};

export default SelectVehicle;