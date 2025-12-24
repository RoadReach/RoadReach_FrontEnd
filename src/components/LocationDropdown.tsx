import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane, faBuilding } from '@fortawesome/free-solid-svg-icons';
import './LocationDropdown.css';

// LocationSuggestion component for displaying a city or airport with icon
export function LocationSuggestion({ type, name, state, country }: {
  type: 'airport' | 'city';
  name: string;
  state?: string;
  country: string;
}) {
  return (
    <div className="loc-result">
      <FontAwesomeIcon icon={type === 'airport' ? faPlane : faBuilding} />
      <span>{name} {state ? `(${state}, ${country})` : `(${country})`}</span>
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
        className="loc-input"
      />
      <div className="loc-results">
        {filteredLocations.map(loc => (
          <LocationSuggestion
            key={loc.id}
            type={loc.type}
            name={loc.name}
            state={loc.stateCode}
            country={loc.countryCode}
          />
        ))}
        {filteredLocations.length === 0 && <div className="loc-empty">No results found</div>}
      </div>
    </div>
  );
}
