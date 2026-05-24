import { getJson, qs } from './http';
import type { Investigation } from './types';

const BASE = 'https://api.nhtsa.gov';

interface InvestigationsResponse {
  count?: number;
  results?: Investigation[];
}

/**
 * Investigations API. If the endpoint is unavailable in the future, callers
 * should display the dataset link as a fallback (see /about page).
 */
export async function getInvestigations(
  year: number,
  make: string,
  model: string,
): Promise<Investigation[]> {
  const url = `${BASE}/investigations/investigationsByVehicle${qs({
    make,
    model,
    modelYear: year,
  })}`;
  try {
    const json = await getJson<InvestigationsResponse>(url);
    return json.results ?? [];
  } catch (err) {
    // Some YMM combos return 404; treat as "no investigations".
    if ((err as { status?: number }).status === 404) return [];
    throw err;
  }
}
