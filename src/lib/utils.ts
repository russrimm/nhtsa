import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | Date | undefined | null): string {
  if (!value) return '—';
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function range(start: number, end: number, step = 1): number[] {
  const out: number[] = [];
  if (step > 0) for (let i = start; i <= end; i += step) out.push(i);
  else for (let i = start; i >= end; i += step) out.push(i);
  return out;
}
