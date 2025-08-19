export async function fetchCountries(): Promise<string[]> {
  const response = await fetch('http://localhost:8080/countries');
  if (!response.ok) {
    throw new Error('Failed to fetch countries');
  }
  return response.json();
}