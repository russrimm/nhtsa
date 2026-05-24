import type { YearMakeModel } from '../api/types';

const KEY = 'nhtsa.recent.v1';
const MAX = 8;

export interface RecentItem {
  kind: 'vin' | 'ymm';
  label: string;
  vin?: string;
  ymm?: YearMakeModel;
  at: number;
}

export function loadRecent(): RecentItem[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as RecentItem[];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

export function pushRecent(item: Omit<RecentItem, 'at'>): RecentItem[] {
  const existing = loadRecent().filter((r) => r.label !== item.label);
  const next = [{ ...item, at: Date.now() }, ...existing].slice(0, MAX);
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore quota errors */
  }
  return next;
}

export function clearRecent(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
