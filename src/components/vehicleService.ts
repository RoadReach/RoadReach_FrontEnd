import axios from 'axios';

interface ImportMetaEnv {
  VITE_API_BASE_URL?: string;
}
interface ImportMetaCustom {
  env: ImportMetaEnv;
}
// Base URL can be overridden via Vite env: VITE_API_BASE_URL
const meta = (import.meta as unknown) as ImportMetaCustom;
const API_BASE = meta.env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface Vehicle {
  id: string;
  city: string;
  type: string;
  company: string;
  price: number;
  passengers: number;
  bags: number;
  image?: string;
  transmission: string;
  eco?: boolean;
  luxury?: boolean;
}

export interface VehicleQuery {
  pickupLocation: string;
  dropoffLocation: string;
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string; // HH:mm
  dropoffDate: string;
  dropoffTime: string;
  is25: boolean;
  minPrice?: number;
  maxPrice?: number;
  types?: string[]; // CSV to backend
}

export async function fetchVehicles(query: VehicleQuery): Promise<Vehicle[]> {
  const params: Record<string, string> = {
    pickupLocation: query.pickupLocation,
    dropoffLocation: query.dropoffLocation,
    pickupDate: query.pickupDate,
    pickupTime: query.pickupTime,
    dropoffDate: query.dropoffDate,
    dropoffTime: query.dropoffTime,
    age25: query.is25 ? '1' : '0'
  };
  if (query.minPrice != null) params.minPrice = String(query.minPrice);
  if (query.maxPrice != null) params.maxPrice = String(query.maxPrice);
  if (query.types && query.types.length) params.types = query.types.join(',');

  const resp = await axios.get<Vehicle[]>(`${API_BASE}/vehicles`, { params });
  return resp.data;
}

// Optional helper to fetch price range if backend supports it.
export async function fetchVehiclePriceRange(query: Omit<VehicleQuery, 'minPrice' | 'maxPrice' | 'types'>): Promise<[number, number]> {
  try {
    const resp = await axios.get<{min:number;max:number}>(`${API_BASE}/vehicles/price-range`, { params: {
      pickupLocation: query.pickupLocation,
      dropoffLocation: query.dropoffLocation,
      pickupDate: query.pickupDate,
      pickupTime: query.pickupTime,
      dropoffDate: query.dropoffDate,
      dropoffTime: query.dropoffTime,
      age25: query.is25 ? '1' : '0'
    }});
    return [resp.data.min, resp.data.max];
  } catch {
    return [0, 500]; // Fallback default
  }
}