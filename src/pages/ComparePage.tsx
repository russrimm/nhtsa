import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQueries } from '@tanstack/react-query';
import { Star, X, ExternalLink, Plus } from 'lucide-react';
import { useCompare } from '@/components/compare/CompareContext';
import { VehicleImage } from '@/components/vehicle/VehicleImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getRatingVariants, getRatingDetail } from '@/lib/api/ratings';
import { getRecalls } from '@/lib/api/recalls';
import { getComplaints } from '@/lib/api/complaints';
import { getInvestigations } from '@/lib/api/investigations';
import type { RatingsSummary } from '@/lib/api/types';
import type { CompareVehicle } from '@/lib/store/compare';

interface VehicleData {
  rating: RatingsSummary | null;
  recalls: number | null;
  complaints: number | null;
  investigations: number | null;
}

async function fetchCompareData(v: CompareVehicle): Promise<VehicleData> {
  const [variantsRes, recallsRes, complaintsRes, investigationsRes] = await Promise.allSettled([
    getRatingVariants(v.year, v.make, v.model),
    getRecalls(v.year, v.make, v.model),
    getComplaints(v.year, v.make, v.model),
    getInvestigations(v.year, v.make, v.model),
  ]);

  const variants = variantsRes.status === 'fulfilled' ? variantsRes.value : [];
  let rating: RatingsSummary | null = null;
  if (variants.length > 0) {
    rating = await getRatingDetail(variants[0].VehicleId).catch(() => null);
  }

  return {
    rating,
    recalls: recallsRes.status === 'fulfilled' ? recallsRes.value.length : null,
    complaints: complaintsRes.status === 'fulfilled' ? complaintsRes.value.length : null,
    investigations: investigationsRes.status === 'fulfilled' ? investigationsRes.value.length : null,
  };
}

function StarRating({ value }: { value?: string }) {
  const n = parseInt(value ?? '', 10);
  if (!value || isNaN(n) || value === 'Not Rated') {
    return <span className="text-xs text-muted-foreground">Not rated</span>;
  }
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          className={cn(
            'h-3.5 w-3.5',
            i < n ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground/25',
          )}
        />
      ))}
      <span className="ml-1 text-xs font-medium">{n}/5</span>
    </span>
  );
}

type Highlight = 'best' | 'worst' | null;

function getHighlights(values: (number | null)[], lowerIsBetter = false): Highlight[] {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length < 2) return values.map(() => null);
  const best = lowerIsBetter ? Math.min(...valid) : Math.max(...valid);
  const worst = lowerIsBetter ? Math.max(...valid) : Math.min(...valid);
  return values.map((v) => {
    if (v === null) return null;
    if (v === best) return 'best';
    if (v === worst && best !== worst) return 'worst';
    return null;
  });
}

function highlightClass(h: Highlight) {
  if (h === 'best') return 'bg-green-500/10 text-green-700 dark:text-green-400';
  if (h === 'worst') return 'bg-red-500/10 text-red-700 dark:text-red-400';
  return '';
}

const COL_LABEL = '160px';

function SectionRow({ label, cols }: { label: string; cols: number }) {
  return (
    <div
      className="col-span-full grid border-t bg-muted/50"
      style={{ gridTemplateColumns: `${COL_LABEL} repeat(${cols}, 1fr)` }}
    >
      <div className="col-span-full px-4 py-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

interface DataRowProps {
  label: string;
  cells: React.ReactNode[];
  highlights?: Highlight[];
}

function DataRow({ label, cells, highlights }: DataRowProps) {
  return (
    <div
      className="grid border-t"
      style={{ gridTemplateColumns: `${COL_LABEL} repeat(${cells.length}, 1fr)` }}
    >
      <div className="flex items-center px-4 py-3 text-sm text-muted-foreground bg-muted/20 border-r">
        {label}
      </div>
      {cells.map((cell, i) => (
        <div
          key={i}
          className={cn(
            'flex items-center px-4 py-3 text-sm border-r last:border-r-0 transition-colors',
            highlights ? highlightClass(highlights[i]) : '',
          )}
        >
          {cell}
        </div>
      ))}
    </div>
  );
}

export function ComparePage() {
  const { list, remove, clear } = useCompare();
  const navigate = useNavigate();
  const n = list.length;

  const queries = useQueries({
    queries: list.map((v) => ({
      queryKey: ['compare', v.year, v.make, v.model],
      queryFn: () => fetchCompareData(v),
      staleTime: 1000 * 60 * 5,
    })),
  });

  if (n === 0) {
    return (
      <div className="container py-20 flex flex-col items-center gap-4 text-center">
        <p className="text-muted-foreground">No vehicles selected for comparison.</p>
        <p className="text-sm text-muted-foreground">
          Use the <strong>Add to Compare</strong> button on any vehicle page to get started.
        </p>
        <Button onClick={() => navigate('/')}>Go to Dashboard</Button>
      </div>
    );
  }

  const data = queries.map((q) => q.data ?? null);
  const loading = queries.some((q) => q.isLoading);

  // Compute highlights
  const ratingVal = (d: VehicleData | null) =>
    d?.rating?.OverallRating ? parseInt(d.rating.OverallRating) : null;
  const overallHL = getHighlights(data.map(ratingVal));
  const frontHL = getHighlights(
    data.map((d) => (d?.rating?.OverallFrontCrashRating ? parseInt(d.rating.OverallFrontCrashRating) : null)),
  );
  const sideHL = getHighlights(
    data.map((d) => (d?.rating?.OverallSideCrashRating ? parseInt(d.rating.OverallSideCrashRating) : null)),
  );
  const rolloverHL = getHighlights(
    data.map((d) => (d?.rating?.RolloverRating ? parseInt(d.rating.RolloverRating) : null)),
  );
  const recallHL = getHighlights(data.map((d) => d?.recalls ?? null), true);
  const complaintHL = getHighlights(data.map((d) => d?.complaints ?? null), true);
  const investigHL = getHighlights(data.map((d) => d?.investigations ?? null), true);

  return (
    <div className="container py-8 space-y-6 pb-24">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-semibold">Vehicle Comparison</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Green = best in category · Red = worst in category
          </p>
        </div>
        <div className="flex gap-2">
          {n < 4 && (
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              <Plus className="mr-1 h-3 w-3" /> Add vehicle
            </Button>
          )}
          <Button variant="ghost" size="sm" onClick={clear}>
            Clear all
          </Button>
        </div>
      </div>

      {/* Vehicle header cards */}
      <div
        className="grid gap-4"
        style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}
      >
        {list.map((v, i) => (
          <Card key={`${v.year}-${v.make}-${v.model}`} className="overflow-hidden">
            <VehicleImage make={v.make} model={v.model} year={v.year} className="h-44 w-full rounded-none" />
            <CardContent className="p-3 space-y-2">
              <p className="font-semibold text-sm leading-tight">
                {v.year} {v.make} {v.model}
              </p>
              {loading && <Skeleton className="h-4 w-24" />}
              {!loading && data[i]?.rating?.VehicleDescription && (
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {data[i]!.rating!.VehicleDescription}
                </p>
              )}
              <div className="flex gap-1.5">
                <Button asChild size="sm" variant="outline" className="flex-1 text-xs h-7">
                  <Link
                    to={`/vehicle/${v.year}/${encodeURIComponent(v.make)}/${encodeURIComponent(v.model)}`}
                  >
                    Details <ExternalLink className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => remove(v)}
                  aria-label="Remove from comparison"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison grid */}
      <div className="rounded-lg border overflow-hidden overflow-x-auto">
        <div style={{ minWidth: `calc(${COL_LABEL} + ${n * 160}px)` }}>

          {/* Safety Ratings */}
          <SectionRow label="Safety Ratings (NCAP)" cols={n} />
          <DataRow
            label="Overall"
            cells={data.map((d, i) =>
              loading ? <Skeleton className="h-4 w-24" /> :
              <StarRating key={i} value={d?.rating?.OverallRating} />,
            )}
            highlights={overallHL}
          />
          <DataRow
            label="Front Crash"
            cells={data.map((d, i) =>
              loading ? <Skeleton className="h-4 w-24" /> :
              <StarRating key={i} value={d?.rating?.OverallFrontCrashRating} />,
            )}
            highlights={frontHL}
          />
          <DataRow
            label="Side Crash"
            cells={data.map((d, i) =>
              loading ? <Skeleton className="h-4 w-24" /> :
              <StarRating key={i} value={d?.rating?.OverallSideCrashRating} />,
            )}
            highlights={sideHL}
          />
          <DataRow
            label="Rollover"
            cells={data.map((d, i) =>
              loading ? <Skeleton className="h-4 w-24" /> :
              <StarRating key={i} value={d?.rating?.RolloverRating} />,
            )}
            highlights={rolloverHL}
          />

          {/* Safety Data */}
          <SectionRow label="Safety Data" cols={n} />
          <DataRow
            label="Recalls"
            cells={data.map((d, i) =>
              loading ? <Skeleton className="h-4 w-12" /> : (
                <span key={i} className="flex items-center gap-2">
                  <span className="font-semibold">{d?.recalls ?? '—'}</span>
                  {(d?.recalls ?? 0) > 0 && (
                    <Badge variant="warning" className="text-xs">
                      {d!.recalls} recall{d!.recalls !== 1 ? 's' : ''}
                    </Badge>
                  )}
                </span>
              ),
            )}
            highlights={recallHL}
          />
          <DataRow
            label="Complaints"
            cells={data.map((d, i) =>
              loading ? <Skeleton className="h-4 w-12" /> : (
                <span key={i} className="font-semibold">{d?.complaints ?? '—'}</span>
              ),
            )}
            highlights={complaintHL}
          />
          <DataRow
            label="Investigations"
            cells={data.map((d, i) =>
              loading ? <Skeleton className="h-4 w-12" /> : (
                <span key={i} className="font-semibold">{d?.investigations ?? '—'}</span>
              ),
            )}
            highlights={investigHL}
          />
        </div>
      </div>
    </div>
  );
}
