import { Card, CardContent } from '@/components/ui/card';
import type { DecodedVinSummary } from '@/lib/api/types';

const fields: Array<[keyof DecodedVinSummary, string]> = [
  ['modelYear', 'Year'],
  ['make', 'Make'],
  ['model', 'Model'],
  ['trim', 'Trim'],
  ['series', 'Series'],
  ['vehicleType', 'Type'],
  ['bodyClass', 'Body'],
  ['fuelType', 'Fuel'],
  ['driveType', 'Drive'],
  ['engineCylinders', 'Cyl.'],
  ['displacementL', 'Displacement (L)'],
  ['transmissionStyle', 'Transmission'],
  ['manufacturer', 'Manufacturer'],
  ['plantCountry', 'Plant Country'],
];

export function SpecGrid({ data }: { data: DecodedVinSummary }) {
  return (
    <Card>
      <CardContent className="grid grid-cols-2 gap-4 p-6 sm:grid-cols-3 lg:grid-cols-4">
        {fields.map(([k, label]) => {
          const v = data[k];
          if (!v) return null;
          return (
            <div key={String(k)} className="space-y-0.5">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
              <div className="text-sm font-medium">{String(v)}</div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
