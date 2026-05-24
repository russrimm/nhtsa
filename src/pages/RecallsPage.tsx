import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useRecallMakes, useRecallModels, useRecallYears, useRecalls } from '@/hooks/useNhtsa';
import { RecallsTable } from '@/components/vehicle/RecallsTable';
import { Skeleton } from '@/components/ui/skeleton';

export function RecallsPage() {
  const years = useRecallYears();
  const [year, setYear] = React.useState<string>('');
  const [make, setMake] = React.useState<string>('');
  const [model, setModel] = React.useState<string>('');

  const makes = useRecallMakes(year ? Number(year) : undefined);
  const models = useRecallModels(year ? Number(year) : undefined, make || undefined);
  const recalls = useRecalls(
    year ? Number(year) : undefined,
    make || undefined,
    model || undefined,
  );

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Recalls</h1>
        <p className="text-sm text-muted-foreground">
          Search NHTSA defect & noncompliance campaigns by Year, Make, and Model.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Select value={year} onValueChange={(v) => { setYear(v); setMake(''); setModel(''); }}>
          <SelectTrigger><SelectValue placeholder={years.isLoading ? 'Loading…' : 'Year'} /></SelectTrigger>
          <SelectContent>
            {(years.data ?? []).map((y) => (
              <SelectItem key={y} value={String(y)}>{y}</SelectItem>
            ))}
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
        recalls.isLoading ? <Skeleton className="h-40 w-full" /> : <RecallsTable recalls={recalls.data ?? []} />
      )}
    </div>
  );
}
