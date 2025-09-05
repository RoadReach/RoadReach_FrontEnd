import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faBuilding } from '@fortawesome/free-solid-svg-icons';

// LocationSuggestion component for displaying a city or airport with icon
export function LocationSuggestion({ type, name, state, country }: {
  type: 'airport' | 'city';
  name: string;
  state?: string;
  country: string;
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <FontAwesomeIcon icon={type === 'airport' ? faPlane : faBuilding} style={{ marginRight: 8 }} />
      <span>
        {name} {state ? `(${state}, ${country})` : `(${country})`}
      </span>
    </div>
  );
}

// LocationDropdown component for auto-suggesting locations
export function LocationDropdown({ locations }: {
  locations: Array<{
    id: string;
    type: 'airport' | 'city';
    name: string;
    stateCode?: string;
    countryCode: string;
    code?: string;
  }>;
}) {
  const [query, setQuery] = useState('');
  const filteredLocations = locations.filter(loc =>
    loc.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Enter city or airport"
        style={{ width: '100%', marginBottom: 8 }}
      />
      <div style={{ maxHeight: 300, overflowY: 'auto', border: '1px solid #ccc', borderRadius: 4 }}>
        {filteredLocations.map(loc => (
          <LocationSuggestion
            key={loc.id}
            type={loc.type}
            name={loc.name}
            state={loc.stateCode}
            country={loc.countryCode}
          />
        ))}
        {filteredLocations.length === 0 && <div style={{ padding: 8 }}>No results found</div>}
      </div>
    </div>
  );
}
