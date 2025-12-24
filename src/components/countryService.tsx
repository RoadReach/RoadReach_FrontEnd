
// Only keep service functions here
export async function fetchCountries(): Promise<string[]> {
  const response = await fetch('http://localhost:8080/api/users/geo/countries');
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }
  const data = await response.json();
  // Only return country codes
  return data.map((country: { countryCode: string }) => country.countryCode);
}

export async function fetchStatesByCountry(countryCode: string): Promise<string[]> {
  const response = await fetch(`http://localhost:8080/api/users/geo/countries/${countryCode}/states`);
  if (!response.ok) {
    throw new Error('Failed to fetch states');
  }
  const data = await response.json();
  // Only return state codes
  return data.map((state: { stateCode: string }) => state.stateCode);
}