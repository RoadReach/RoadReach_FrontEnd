import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Upgrades.css';

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

const sampleUpgrades = [
  { id: 'baby_seat', title: 'Child Toddler Seat', price: 14.50, desc: 'Duration' },
  { id: 'gps', title: 'Navigational System', price: 6.99, desc: 'Duration' },
  { id: 'roadside', title: 'Roadside Assistance', price: 8.99, desc: 'Duration' },
  { id: 'etoll', title: 'E-Toll', price: 13.49, desc: 'Duration' },
  { id: 'wifi', title: 'Wi-Fi', price: 21.99, desc: 'Duration' },
  { id: 'sirius', title: 'Sirius XM', price: 7.99, desc: 'Duration' }
];

const Upgrades: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // location.state may be undefined or contain our expected shape
  type VehicleLike = { price?: number } | undefined;
  const state = location.state as unknown as { search?: SearchState; selectedVehicle?: VehicleLike } | undefined;
  const selectedVehicle = state?.selectedVehicle;

  const formatDateTime = (dateStr?: string, timeStr?: string) => {
    if (!dateStr) return '';
    try {
      if (timeStr && /[AP]M/i.test(timeStr)) {
        const dateOnly = new Date(dateStr);
        const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(dateOnly);
        return `${dateFmt}, ${timeStr.toUpperCase()}`;
      }
      let iso = dateStr;
      if (timeStr) {
        const t = timeStr.length === 5 ? `${timeStr}:00` : timeStr;
        iso = `${dateStr}T${t}`;
      }
      let dt = new Date(iso);
      if (isNaN(dt.getTime())) dt = new Date(`${dateStr} ${timeStr || ''}`);
      if (isNaN(dt.getTime())) return `${dateStr} ${timeStr || ''}`.trim();
      const dateFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(dt);
      const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).format(dt);
      return `${dateFmt}, ${timeFmt}`;
    } catch {
      return `${dateStr} ${timeStr || ''}`.trim();
    }
  };

  // initialize first item with quantity 1 like the screenshot
  const initialSelected: Record<string, number> = {};
  if (sampleUpgrades.length > 0) initialSelected[sampleUpgrades[0].id] = 1;
  const [selected, setSelected] = useState<Record<string, number>>(initialSelected);

  const changeQty = (id: string, delta: number) => {
    setSelected(prev => {
      const cur = prev[id] || 0;
      const next = Math.max(0, cur + delta);
      return { ...prev, [id]: next };
    });
  };

  const extrasTotal = useMemo(() => {
    return sampleUpgrades.reduce((sum, u) => {
      const qty = selected[u.id] || 0;
      return sum + qty * u.price;
    }, 0);
  }, [selected]);

  const vehiclePrice = selectedVehicle?.price ? Number(selectedVehicle.price) : 0;
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="upgrades__page">
      <div className="upgrades__topbar">
        <div className="upgrades__topbar-left">
          <div className="upgrades__location">{state?.search ? state.search.pickupLocation : ''}</div>
          <div className="upgrades__dates">{state?.search ? `${formatDateTime(state.search.pickupDate, state.search.pickupTime)} - ${formatDateTime(state.search.dropoffDate, state.search.dropoffTime)}` : ''}</div>
        </div>
        <div className="upgrades__topbar-right">
          <div className="upgrades__total-label">Total Price</div>
          <div className="upgrades__total-amount">${(vehiclePrice + extrasTotal).toFixed(2)}</div>
          <button className="btn btn--primary upgrades__top-cta" onClick={() => setShowConfirm(true)}>Continue to Upgrades</button>
        </div>
      </div>

      <div className="upgrades__container">
        <main className="upgrades__main">
          <h2 className="upgrades__title">Select Your Optional Equipment</h2>
          <div className="upgrades__table">
            <div className="upgrades__table-head">
              <div className="col desc">Description</div>
              <div className="col price">Per Unit Price</div>
              <div className="col qty">Quantity</div>
            </div>
            {sampleUpgrades.map((u, idx) => {
              const qty = selected[u.id] || 0;
              return (
                <div key={u.id} className={`upgrades__row ${idx % 2 === 0 ? 'alt' : ''}`}>
                  <div className="col desc"><a href="#">{u.title}</a></div>
                  <div className="col price">${u.price.toFixed(2)} / {u.desc}</div>
                  <div className="col qty">
                    <button className="qty-btn" onClick={() => changeQty(u.id, -1)} disabled={qty <= 0}>−</button>
                    <span className="qty-val">{qty}</span>
                    <button className="qty-btn" onClick={() => changeQty(u.id, 1)}>+</button>
                  </div>
                </div>
              );
            })}

            <div className="upgrades__disclaimer">Prices are in U.S. dollars (unless specified otherwise). Taxes and fees associated with optional special equipment are not included.</div>
          </div>
        </main>
        <aside className="upgrades__sidebar">
          <div className="help-box">
            <div className="help-box__title">Need Help?</div>
            <div className="help-box__phone">Call 1-866-921-7925</div>
            <div className="help-box__hours">Weekdays 5:00am - 7:00pm<br/>Weekends 6:00am - 5:00pm<br/>Pacific Time</div>
          </div>
          <div className="upgrades__bottom-cta">
            <button className="btn btn--secondary" onClick={() => navigate(-1)}>Back</button>
            <button className="btn btn--primary" onClick={() => setShowConfirm(true)}>Continue to Upgrades</button>
          </div>
        </aside>
      </div>
      {showConfirm && (
        <div className="confirm-overlay" role="dialog" aria-modal="true" aria-label="Confirm Changes">
          <div className="confirm-dialog">
            <button className="confirm-close" onClick={() => setShowConfirm(false)} aria-label="Close">×</button>
            <h3 className="confirm-title">Confirm Changes</h3>
            <div className="confirm-body">This change will add <strong>${extrasTotal.toFixed(2)}</strong> to your total rental price. Additional taxes and/or fees will apply.</div>
            <div className="confirm-actions">
              <button className="btn btn--secondary" onClick={() => navigate(-1)}>CANCEL</button>
              <button className="btn btn--primary" onClick={() => setShowConfirm(false)}>CONTINUE</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Upgrades;
