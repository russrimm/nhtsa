import { Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { RatingsSummary } from '@/lib/api/types';
import { useRatingDetail, useRatingVariants } from '@/hooks/useNhtsa';
import { Skeleton } from '@/components/ui/skeleton';

export function RatingsPanel({
  year,
  make,
  model,
}: {
  year: number;
  make: string;
  model: string;
}) {
  const variantsQ = useRatingVariants(year, make, model);
  if (variantsQ.isLoading) {
    return <Skeleton className="h-40 w-full" />;
  }
  const variants = variantsQ.data ?? [];
  if (!variants.length) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          NHTSA NCAP has not published safety ratings for this Year/Make/Model.
        </CardContent>
      </Card>
    );
  }
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {variants.map((v) => (
        <VariantCard key={v.VehicleId} vehicleId={v.VehicleId} title={v.VehicleDescription} />
      ))}
    </div>
  );
}

function VariantCard({ vehicleId, title }: { vehicleId: number; title: string }) {
  const q = useRatingDetail(vehicleId);
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {q.isLoading && <Skeleton className="h-24 w-full" />}
        {q.data && <RatingsDetail data={q.data} />}
      </CardContent>
    </Card>
  );
}

function StarRow({ label, value }: { label: string; value?: string }) {
  const n = value ? Number(value) : NaN;
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div className="flex items-center gap-1" aria-label={`${label}: ${value ?? 'Not rated'}`}>
        {Number.isFinite(n) && n > 0 ? (
          <>
            {Array.from({ length: 5 }, (_, i) => (
              <Star
                key={i}
                className={
                  i < n
                    ? 'h-4 w-4 fill-amber-400 stroke-amber-500'
                    : 'h-4 w-4 stroke-muted-foreground/50'
                }
              />
            ))}
            <span className="ml-2 text-xs text-muted-foreground">{n}/5</span>
          </>
        ) : (
          <span className="text-xs text-muted-foreground">Not rated</span>
        )}
      </div>
    </div>
  );
}

function RatingsDetail({ data }: { data: RatingsSummary }) {
  return (
    <div className="space-y-2">
      <StarRow label="Overall" value={data.OverallRating} />
      <StarRow label="Frontal crash" value={data.OverallFrontCrashRating} />
      <StarRow label="Side crash" value={data.OverallSideCrashRating} />
      <StarRow label="Rollover" value={data.RolloverRating} />
    </div>
  );
}
