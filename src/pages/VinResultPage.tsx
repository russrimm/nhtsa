import { Link, useParams } from 'react-router-dom';
import { ArrowRight, AlertCircle } from 'lucide-react';
import { useDecodeVin } from '@/hooks/useNhtsa';
import { SpecGrid } from '@/components/vehicle/SpecGrid';
import { VehicleImage } from '@/components/vehicle/VehicleImage';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function VinResultPage() {
  const { vin = '' } = useParams();
  const q = useDecodeVin(vin);

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">VIN</p>
        <h1 className="font-mono text-2xl font-semibold">{vin}</h1>
      </div>

      {q.isLoading && <Skeleton className="h-48 w-full" />}
      {q.isError && (
        <Card>
          <CardContent className="p-6 flex items-center gap-3 text-destructive">
            <AlertCircle className="h-5 w-5" /> Failed to decode VIN. Please check the VIN and try again.
          </CardContent>
        </Card>
      )}

      {q.data && (
        <>
          {q.data.errorText && q.data.errorCode && q.data.errorCode !== '0' && (
            <Card>
              <CardContent className="p-4 text-sm text-amber-700 dark:text-amber-300">
                vPIC notes: {q.data.errorText}
              </CardContent>
            </Card>
          )}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            {q.data.make && q.data.model && (
              <VehicleImage
                make={q.data.make}
                model={q.data.model}
                year={q.data.modelYear}
                className="h-48 w-full sm:h-40 sm:w-64 shrink-0"
              />
            )}
            <div className="flex-1">
              <SpecGrid data={q.data} />
            </div>
          </div>
          {q.data.modelYear && q.data.make && q.data.model && (
            <div>
              <Button asChild>
                <Link
                  to={`/vehicle/${q.data.modelYear}/${encodeURIComponent(
                    q.data.make,
                  )}/${encodeURIComponent(q.data.model)}`}
                >
                  See ratings, recalls & complaints
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
