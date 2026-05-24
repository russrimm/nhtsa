import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Car } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useRecallMakes, useRecallModels } from '@/hooks/useNhtsa';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { range } from '@/lib/utils';
import { pushRecent } from '@/lib/store/recent';

const VIN_RE = /^[A-HJ-NPR-Z0-9]{11,17}$/i;

export function GlobalSearch() {
  const nav = useNavigate();
  const [vin, setVin] = React.useState('');
  const currentYear = new Date().getFullYear();
  const years = React.useMemo(() => range(currentYear + 1, 1981, -1), [currentYear]);
  const [year, setYear] = React.useState<string>('');
  const [make, setMake] = React.useState<string>('');
  const [model, setModel] = React.useState<string>('');

  const makesQ = useRecallMakes(year ? Number(year) : undefined);
  const modelsQ = useRecallModels(year ? Number(year) : undefined, make || undefined);

  const onVinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = vin.trim().toUpperCase();
    if (!VIN_RE.test(v)) return;
    pushRecent({ kind: 'vin', label: v, vin: v });
    nav(`/vin/${encodeURIComponent(v)}`);
  };

  const goVehicle = () => {
    if (!year || !make || !model) return;
    pushRecent({
      kind: 'ymm',
      label: `${year} ${make} ${model}`,
      ymm: { year: Number(year), make, model },
    });
    nav(`/vehicle/${year}/${encodeURIComponent(make)}/${encodeURIComponent(model)}`);
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="grid gap-6 p-6 md:grid-cols-2">
        <form onSubmit={onVinSubmit} className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Search className="h-4 w-4" /> Decode a VIN
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="e.g. 1HGCM82633A004352"
              value={vin}
              onChange={(e) => setVin(e.target.value)}
              maxLength={17}
              autoComplete="off"
              spellCheck={false}
              className="font-mono uppercase"
            />
            <Button type="submit" disabled={!VIN_RE.test(vin.trim())}>
              Decode
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            17 characters; we'll pull specs, ratings, recalls, and complaints in one click.
          </p>
        </form>

        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Car className="h-4 w-4" /> Look up by Year / Make / Model
          </label>
          <div className="grid grid-cols-3 gap-2">
            <Select value={year} onValueChange={(v) => { setYear(v); setMake(''); setModel(''); }}>
              <SelectTrigger><SelectValue placeholder="Year" /></SelectTrigger>
              <SelectContent>
                {years.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={make} onValueChange={(v) => { setMake(v); setModel(''); }} disabled={!year || makesQ.isLoading || !makesQ.data?.length}>
              <SelectTrigger><SelectValue placeholder={makesQ.isLoading ? 'Loading…' : 'Make'} /></SelectTrigger>
              <SelectContent>
                {(makesQ.data ?? []).map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={model} onValueChange={setModel} disabled={!modelsQ.data || !year || !make}>
              <SelectTrigger><SelectValue placeholder={modelsQ.isLoading ? 'Loading…' : 'Model'} /></SelectTrigger>
              <SelectContent>
                {(modelsQ.data ?? []).map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={goVehicle} disabled={!year || !make || !model} className="w-full">
            Analyze vehicle
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
