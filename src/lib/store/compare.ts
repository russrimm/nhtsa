export const MAX_COMPARE = 4;
const KEY = 'nhtsa.compare.v1';

export interface CompareVehicle {
  year: number;
  make: string;
  model: string;
}

export function loadCompare(): CompareVehicle[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function saveCompare(list: CompareVehicle[]): void {
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, MAX_COMPARE)));
}
