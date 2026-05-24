import { getJson, qs } from './http';
import type { Recall } from './types';

const BASE = 'https://api.nhtsa.gov';

interface RecallsResponse {
  count: number;
  Count?: number;
  results: Recall[];
}

export async function getRecalls(year: number, make: string, model: string): Promise<Recall[]> {
  const url = `${BASE}/recalls/recallsByVehicle${qs({ make, model, modelYear: year })}`;
  const json = await getJson<RecallsResponse>(url);
  return json.results ?? [];
}

export async function getRecallModelYears(): Promise<number[]> {
  const url = `${BASE}/products/vehicle/modelYears?issueType=r`;
  const json = await getJson<{ results: Array<{ modelYear: string }> }>(url);
  return (json.results ?? [])
    .map((r) => Number(r.modelYear))
    .filter((y) => Number.isFinite(y))
    .sort((a, b) => b - a);
}

export async function getRecallMakes(modelYear: number): Promise<string[]> {
  const url = `${BASE}/products/vehicle/makes${qs({ modelYear, issueType: 'r' })}`;
  const json = await getJson<{ results: Array<{ make: string }> }>(url);
  return Array.from(new Set((json.results ?? []).map((r) => r.make))).sort();
}

export async function getRecallModels(modelYear: number, make: string): Promise<string[]> {
  const url = `${BASE}/products/vehicle/models${qs({ modelYear, make, issueType: 'r' })}`;
  const json = await getJson<{ results: Array<{ model: string }> }>(url);
  return Array.from(new Set((json.results ?? []).map((r) => r.model))).sort();
}
