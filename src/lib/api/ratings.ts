import { getJson } from './http';
import type { RatingsSummary } from './types';

const BASE = 'https://api.nhtsa.gov/SafetyRatings';

interface RatingsListResponse<T> {
  Count: number;
  Message: string;
  Results: T[];
}

interface YearRow { ModelYear: number }
interface MakeRow { Make: string }
interface ModelRow { Model: string }
interface VariantRow {
  VehicleId: number;
  VehicleDescription: string;
}

export async function getRatingsYears(): Promise<number[]> {
  const json = await getJson<RatingsListResponse<YearRow>>(`${BASE}?format=json`);
  return (json.Results ?? []).map((r) => r.ModelYear).sort((a, b) => b - a);
}

export async function getRatingsMakes(year: number): Promise<string[]> {
  const json = await getJson<RatingsListResponse<MakeRow>>(
    `${BASE}/modelyear/${year}?format=json`,
  );
  return Array.from(new Set((json.Results ?? []).map((r) => r.Make))).sort();
}

export async function getRatingsModels(year: number, make: string): Promise<string[]> {
  const json = await getJson<RatingsListResponse<ModelRow>>(
    `${BASE}/modelyear/${year}/make/${encodeURIComponent(make)}?format=json`,
  );
  return Array.from(new Set((json.Results ?? []).map((r) => r.Model))).sort();
}

export async function getRatingVariants(
  year: number,
  make: string,
  model: string,
): Promise<VariantRow[]> {
  const json = await getJson<RatingsListResponse<VariantRow>>(
    `${BASE}/modelyear/${year}/make/${encodeURIComponent(make)}/model/${encodeURIComponent(
      model,
    )}?format=json`,
  );
  return json.Results ?? [];
}

export async function getRatingDetail(vehicleId: number): Promise<RatingsSummary | null> {
  const json = await getJson<RatingsListResponse<RatingsSummary>>(
    `${BASE}/VehicleId/${vehicleId}?format=json`,
  );
  return json.Results?.[0] ?? null;
}
