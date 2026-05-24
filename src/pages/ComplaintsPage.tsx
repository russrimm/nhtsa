import * as React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  useComplaints,
  useRecallMakes,
  useRecallModels,
  useRecallYears,
} from '@/hooks/useNhtsa';
import { ComplaintsTable } from '@/components/vehicle/ComplaintsTable';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Complaints share the same Year/Make/Model dropdown source as recalls
 * (`/products/vehicle/...`), so we reuse those hooks here.
 */
export function ComplaintsPage() {
  const years = useRecallYears();
  const [year, setYear] = React.useState('');
  const [make, setMake] = React.useState('');
  const [model, setModel] = React.useState('');
  const makes = useRecallMakes(year ? Number(year) : undefined);
  const models = useRecallModels(year ? Number(year) : undefined, make || undefined);
  const complaints = useComplaints(
    year ? Number(year) : undefined,
    make || undefined,
    model || undefined,
  );

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Complaints</h1>
        <p className="text-sm text-muted-foreground">
          Consumer complaints filed with NHTSA's Office of Defects Investigation (ODI).
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
        complaints.isLoading ? <Skeleton className="h-40 w-full" /> : <ComplaintsTable complaints={complaints.data ?? []} />
      )}
    </div>
  );
}
