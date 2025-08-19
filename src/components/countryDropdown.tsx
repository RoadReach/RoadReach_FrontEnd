import React, { useEffect, useState } from 'react';
import { fetchCountries } from './countryService';

const CountryDropdown: React.FC = () => {
  const [countries, setCountries] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCountries()
      .then(setCountries)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading countries...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <select>
      <option value="">Select a country</option>
      {countries.map(country => (
        <option key={country} value={country}>{country}</option>
      ))}
    </select>
  );
};

export default CountryDropdown;