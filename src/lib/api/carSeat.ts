import { getJson, qs } from './http';
import type { CarSeatStation } from './types';

const BASE = 'https://api.nhtsa.gov';

interface ApiStation {
  id?: number | string;
  organizationName?: string;
  contactFirstName?: string;
  contactLastName?: string;
  mobileStation?: boolean;
  address1?: string;
  city?: string;
  stateCode?: string;
  postalCode?: string;
  phone1?: string;
  email?: string;
  cpsCertified?: boolean;
  latitude?: number | string;
  longitude?: number | string;
}

interface StationsResponse {
  Count?: number;
  Results?: ApiStation[];
  results?: ApiStation[];
}

function normalize(r: ApiStation, i: number): CarSeatStation {
  const lat = typeof r.latitude === 'string' ? parseFloat(r.latitude) : r.latitude;
  const lng = typeof r.longitude === 'string' ? parseFloat(r.longitude) : r.longitude;
  return {
    id: String(r.id ?? i),
    name: r.organizationName ?? [r.contactFirstName, r.contactLastName].filter(Boolean).join(' ') ?? 'Inspection station',
    address1: r.address1,
    city: r.city,
    state: r.stateCode,
    zip: r.postalCode,
    phone: r.phone1,
    email: r.email,
    lat: Number.isFinite(lat as number) ? (lat as number) : undefined,
    lng: Number.isFinite(lng as number) ? (lng as number) : undefined,
    cpsCertified: r.cpsCertified,
  };
}

/**
 * Search car-seat inspection stations near a US ZIP code.
 * Endpoint: /cscRpt/searchByZip
 */
export async function searchStationsByZip(zip: string, miles = 25): Promise<CarSeatStation[]> {
  const url = `${BASE}/cscRpt/searchByZip${qs({ zip, miles })}`;
  const json = await getJson<StationsResponse>(url);
  const rows = json.Results ?? json.results ?? [];
  return rows.map(normalize);
}
