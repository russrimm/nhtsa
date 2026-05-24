import * as React from 'react';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCarSeatStations } from '@/hooks/useNhtsa';
import { StationMap } from '@/components/map/StationMap';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

export function CarSeatLocatorPage() {
  const [input, setInput] = React.useState('');
  const [zip, setZip] = React.useState<string | undefined>(undefined);
  const q = useCarSeatStations(zip, 25);

  const center = React.useMemo(() => {
    const first = q.data?.find((s) => s.lat != null && s.lng != null);
    return first ? { lat: first.lat!, lng: first.lng! } : undefined;
  }, [q.data]);

  return (
    <div className="container py-8 space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold">Car Seat Inspection Locator</h1>
        <p className="text-sm text-muted-foreground">
          Find a NHTSA-affiliated child car seat inspection station near a US ZIP code (within ~25
          miles).
        </p>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (/^\d{5}$/.test(input.trim())) setZip(input.trim());
        }}
        className="flex max-w-sm gap-2"
      >
        <Input
          inputMode="numeric"
          pattern="\d{5}"
          maxLength={5}
          placeholder="ZIP code (e.g. 20590)"
          value={input}
          onChange={(e) => setInput(e.target.value.replace(/\D/g, ''))}
        />
        <Button type="submit" disabled={!/^\d{5}$/.test(input.trim())}>
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>
      </form>

      {q.isLoading && <Skeleton className="h-[480px] w-full" />}
      {q.isError && (
        <Card>
          <CardContent className="p-6 text-sm text-destructive">
            Could not load stations. Please try a different ZIP.
          </CardContent>
        </Card>
      )}
      {q.data && (
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <StationMap stations={q.data} center={center} />
          <div className="space-y-2 max-h-[480px] overflow-y-auto">
            {q.data.length === 0 && (
              <p className="text-sm text-muted-foreground">No stations found within 25 miles.</p>
            )}
            {q.data.map((s) => (
              <Card key={s.id}>
                <CardContent className="p-3 space-y-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-sm">{s.name}</div>
                    {s.cpsCertified && <Badge variant="success">CPS</Badge>}
                  </div>
                  {(s.address1 || s.city) && (
                    <div className="flex items-start gap-1 text-xs text-muted-foreground">
                      <MapPin className="h-3 w-3 mt-0.5 shrink-0" />
                      <div>
                        {s.address1}
                        {s.address1 && <br />}
                        {[s.city, s.state, s.zip].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  )}
                  {s.phone && <div className="text-xs">{s.phone}</div>}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
