import { useState, useEffect } from "react";

export interface LocationSuggestionType {
  id: string;
  name: string;
  type: "airport" | "city";
  stateCode?: string;
  stateName?: string;
  stateAbbr?: string;
  countryCode: string;
  code?: string; // airport code
}


const useRentalLocationSuggest = (query: string, country: 'us' | 'ca' = 'us') => {
  const [suggestions, setSuggestions] = useState<LocationSuggestionType[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }
    let active = true;
    setLoading(true);
    fetch(`http://localhost:8080/api/countries/${country}/locations/suggest?query=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((data) => {
        if (active) {
          setSuggestions(Array.isArray(data) ? data : []);
        }
      })
      .catch(() => {
        if (active) setSuggestions([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [query, country]);

  return { suggestions, loading };
};

export default useRentalLocationSuggest;
