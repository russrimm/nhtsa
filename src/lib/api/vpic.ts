import { z } from 'zod';
import { getJson, getJsonValidated } from './http';
import type { DecodedVinSummary } from './types';

const VPIC_BASE = 'https://vpic.nhtsa.dot.gov/api/vehicles';

const vpicResult = z.object({
  Count: z.number().optional(),
  Message: z.string().optional(),
  Results: z.array(z.any()),
});

interface DecodeRow {
  Variable: string;
  Value: string | null;
  ValueId?: string | null;
}

interface MakeRow {
  Make_ID: number;
  Make_Name: string;
}

interface ModelRow {
  Model_ID: number;
  Model_Name: string;
  Make_Name: string;
}

export async function decodeVin(vin: string, modelYear?: number): Promise<DecodedVinSummary> {
  const url = `${VPIC_BASE}/DecodeVin/${encodeURIComponent(vin.trim())}?format=json${
    modelYear ? `&modelyear=${modelYear}` : ''
  }`;
  const json = await getJsonValidated(url, vpicResult);
  const raw: Record<string, string> = {};
  for (const row of json.Results as DecodeRow[]) {
    if (row.Value && row.Variable) raw[row.Variable] = row.Value;
  }
  return {
    vin: vin.trim().toUpperCase(),
    make: raw['Make'],
    model: raw['Model'],
    modelYear: raw['Model Year'],
    manufacturer: raw['Manufacturer Name'],
    vehicleType: raw['Vehicle Type'],
    bodyClass: raw['Body Class'],
    fuelType: raw['Fuel Type - Primary'] || raw['Fuel Type'],
    driveType: raw['Drive Type'],
    engineCylinders: raw['Engine Number of Cylinders'],
    displacementL: raw['Displacement (L)'],
    transmissionStyle: raw['Transmission Style'],
    plantCountry: raw['Plant Country'],
    trim: raw['Trim'],
    series: raw['Series'],
    errorCode: raw['Error Code'],
    errorText: raw['Error Text'],
    raw,
  };
}

export async function getAllMakes(): Promise<string[]> {
  const url = `${VPIC_BASE}/GetAllMakes?format=json`;
  const json = await getJson<{ Results: MakeRow[] }>(url);
  return json.Results.map((r) => r.Make_Name).sort((a, b) => a.localeCompare(b));
}

export async function getModelsForMakeYear(make: string, year: number): Promise<string[]> {
  const url = `${VPIC_BASE}/GetModelsForMakeYear/make/${encodeURIComponent(
    make,
  )}/modelyear/${year}?format=json`;
  const json = await getJson<{ Results: ModelRow[] }>(url);
  return Array.from(new Set(json.Results.map((r) => r.Model_Name))).sort((a, b) =>
    a.localeCompare(b),
  );
}
