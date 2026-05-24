import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRatingsMakes, useRatingsModels, useRatingsYears } from '@/hooks/useNhtsa';
import { RatingsPanel } from '@/components/vehicle/RatingsPanel';

export function RatingsPage() {
  const years = useRatingsYears();
  const [year, setYear] = React.useState('');
  const [make, setMake] = React.useState('');
  const [model, setModel] = React.useState('');
  const makes = useRatingsMakes(year ? Number(year) : undefined);
  const models = useRatingsModels(year ? Number(year) : undefined, make || undefined);

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Safety Ratings</h1>
        <p className="text-sm text-muted-foreground">
          NCAP 5-star ratings for frontal crash, side crash, and rollover resistance.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Select value={year} onValueChange={(v) => { setYear(v); setMake(''); setModel(''); }}>
          <SelectTrigger><SelectValue placeholder={years.isLoading ? 'Loading…' : 'Year'} /></SelectTrigger>
          <SelectContent>
            {(years.data ?? []).map((y) => (<SelectItem key={y} value={String(y)}>{y}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={make} onValueChange={(v) => { setMake(v); setModel(''); }} disabled={!year}>
          <SelectTrigger><SelectValue placeholder={makes.isLoading ? 'Loading…' : 'Make'} /></SelectTrigger>
          <SelectContent>
            {(makes.data ?? []).map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
          </SelectContent>
        </Select>
        <Select value={model} onValueChange={setModel} disabled={!make}>
          <SelectTrigger><SelectValue placeholder={models.isLoading ? 'Loading…' : 'Model'} /></SelectTrigger>
          <SelectContent>
            {(models.data ?? []).map((m) => (<SelectItem key={m} value={m}>{m}</SelectItem>))}
          </SelectContent>
        </Select>
      </div>
      {year && make && model && (
        <RatingsPanel year={Number(year)} make={make} model={model} />
      )}
    </div>
  );
}
