import { getJson, qs } from './http';
import type { Complaint } from './types';

const BASE = 'https://api.nhtsa.gov';

interface ComplaintsResponse {
  count: number;
  results: Complaint[];
}

export async function getComplaints(
  year: number,
  make: string,
  model: string,
): Promise<Complaint[]> {
  const url = `${BASE}/complaints/complaintsByVehicle${qs({ make, model, modelYear: year })}`;
  const json = await getJson<ComplaintsResponse>(url);
  return json.results ?? [];
}
