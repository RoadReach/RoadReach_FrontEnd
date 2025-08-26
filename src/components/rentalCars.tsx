import React, { useState } from "react";

const RentalCars: React.FC = () => {
  const [sameLocation, setSameLocation] = useState(true);
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropoffLocation, setDropoffLocation] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("Noon");
  const [dropoffDate, setDropoffDate] = useState("");
  const [dropoffTime, setDropoffTime] = useState("Noon");
  const [is25, setIs25] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add search logic here
  };

  return (
    <div
      style={{
        background: "#337ab7",
        minHeight: "50vh",
        width: "100%",
        paddingTop: "40px",
      }}
    >
      <div
        style={{
          background: "#fff",
          maxWidth: 1000,
          margin: "0 auto",
          borderRadius: "8px",
          padding: "32px 32px 24px 32px",
          boxShadow: "0 0 16px rgba(0,0,0,0.08)",
        }}
      >
        

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              marginBottom: 16,
            }}
          >
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "18px",
              }}
            >
              <input
                type="radio"
                checked={sameLocation}
                onChange={() => setSameLocation(true)}
                style={{ accentColor: "#337ab7" }}
              />
              Drop-off at Same Location
            </label>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontSize: "18px",
              }}
            >
              <input
                type="radio"
                checked={!sameLocation}
                onChange={() => setSameLocation(false)}
                style={{ accentColor: "#337ab7" }}
              />
              Drop-off at Different Location
            </label>
            <span
              style={{
                marginLeft: "auto",
                color: "#337ab7",
                fontSize: "16px",
              }}
            >
              * Indicates required fields
            </span>
          </div>
          <div
            style={{
              display: "flex",
              gap: 16,
              marginBottom: 16,
              alignItems: "flex-end", // Align fields at the bottom
            }}
          >
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>Pick-Up Location*</label>
              <input
                type="text"
                value={pickupLocation}
                onChange={(e) => setPickupLocation(e.target.value)}
                placeholder="Airport, City, Zip Code or Address"
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 12px",
                  fontSize: "18px",
                  border: "2px solid #337ab7",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>Pick-Up Date*</label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 12px",
                  fontSize: "18px",
                  border: "2px solid #337ab7",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>Pick-Up Time*</label>
              <select
                value={pickupTime}
                onChange={(e) => setPickupTime(e.target.value)}
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 12px",
                  fontSize: "18px",
                  border: "2px solid #337ab7",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
                required
              >
                <option>Noon</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </div>
            {!sameLocation && (
              <div style={{ flex: 1 }}>
                <label style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>Drop-Off Location*</label>
                <input
                  type="text"
                  value={dropoffLocation}
                  onChange={(e) => setDropoffLocation(e.target.value)}
                  placeholder="Airport, City, Zip Code or Address"
                  style={{
                    width: "100%",
                    height: "48px",
                    padding: "0 12px",
                    fontSize: "18px",
                    border: "2px solid #337ab7",
                    borderRadius: "8px",
                    boxSizing: "border-box",
                  }}
                  required
                />
              </div>
            )}
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>Drop-Off Date*</label>
              <input
                type="date"
                value={dropoffDate}
                onChange={(e) => setDropoffDate(e.target.value)}
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 12px",
                  fontSize: "18px",
                  border: "2px solid #337ab7",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
                required
              />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 500, marginBottom: 6, display: "block" }}>Drop-Off Time*</label>
              <select
                value={dropoffTime}
                onChange={(e) => setDropoffTime(e.target.value)}
                style={{
                  width: "100%",
                  height: "48px",
                  padding: "0 12px",
                  fontSize: "18px",
                  border: "2px solid #337ab7",
                  borderRadius: "8px",
                  boxSizing: "border-box",
                }}
                required
              >
                <option>Noon</option>
                <option>Morning</option>
                <option>Afternoon</option>
                <option>Evening</option>
              </select>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <input
              type="checkbox"
              checked={is25}
              onChange={(e) => setIs25(e.target.checked)}
              required
              style={{
                accentColor: "#337ab7",
                width: "20px",
                height: "20px",
              }}
            />
            <span
              style={{
                marginLeft: "8px",
                fontSize: "18px",
                color: "#337ab7",
                fontWeight: 500,
              }}
            >
              Yes, I am at least 25 years old.*
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: "16px",
                color: "#337ab7",
              }}
            >
              Driven by{" "}
              <span style={{ fontWeight: 600 }}>Low Price Finder™</span>
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "24px",
            }}
          >
            <button
              type="submit"
              style={{
                background: "#337ab7",
                color: "#fff",
                padding: "16px 80px",
                border: "none",
                borderRadius: "8px",
                fontSize: "22px",
                cursor: "pointer",
                fontWeight: 500,
              }}
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