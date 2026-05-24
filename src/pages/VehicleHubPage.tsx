import { useParams } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useComplaints,
  useInvestigations,
  useRatingVariants,
  useRecalls,
} from '@/hooks/useNhtsa';
import { useCompare } from '@/components/compare/CompareContext';
import { RecallsTable } from '@/components/vehicle/RecallsTable';
import { ComplaintsTable } from '@/components/vehicle/ComplaintsTable';
import { RatingsPanel } from '@/components/vehicle/RatingsPanel';
import { InvestigationsTable } from '@/components/vehicle/InvestigationsTable';
import { VehicleImage } from '@/components/vehicle/VehicleImage';

export function VehicleHubPage() {
  const { year, make, model } = useParams();
  const y = Number(year);
  const m = decodeURIComponent(make ?? '');
  const mod = decodeURIComponent(model ?? '');

  const recalls = useRecalls(y, m, mod);
  const complaints = useComplaints(y, m, mod);
  const investigations = useInvestigations(y, m, mod);
  const ratings = useRatingVariants(y, m, mod);
  const { add, remove, isInCompare, isFull } = useCompare();
  const vehicle = { year: y, make: m, model: mod };
  const inCompare = isInCompare(vehicle);

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <VehicleImage
          make={m}
          model={mod}
          year={y}
          className="h-48 w-full sm:h-40 sm:w-64 shrink-0"
        />
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">Vehicle</p>
          <h1 className="text-2xl font-semibold">{y} {m} {mod}</h1>
          <Button
            variant={inCompare ? 'secondary' : 'outline'}
            size="sm"
            className="mt-2"
            disabled={!inCompare && isFull}
            onClick={() => inCompare ? remove(vehicle) : add(vehicle)}
          >
            {inCompare ? '✓ Added to Compare' : isFull ? 'Compare full (4/4)' : '+ Add to Compare'}
          </Button>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Safety ratings" loading={ratings.isLoading} value={ratings.data?.length ?? 0} />
        <StatCard label="Recalls" loading={recalls.isLoading} value={recalls.data?.length ?? 0} highlight={!!recalls.data?.length} />
        <StatCard label="Complaints" loading={complaints.isLoading} value={complaints.data?.length ?? 0} />
        <StatCard label="Investigations" loading={investigations.isLoading} value={investigations.data?.length ?? 0} />
      </div>

      <Tabs defaultValue="ratings">
        <TabsList className="flex-wrap">
          <TabsTrigger value="ratings">Ratings</TabsTrigger>
          <TabsTrigger value="recalls">Recalls</TabsTrigger>
          <TabsTrigger value="complaints">Complaints</TabsTrigger>
          <TabsTrigger value="investigations">Investigations</TabsTrigger>
          <TabsTrigger value="tsbs">TSBs</TabsTrigger>
        </TabsList>

        <TabsContent value="ratings">
          <RatingsPanel year={y} make={m} model={mod} />
        </TabsContent>
        <TabsContent value="recalls">
          {recalls.isLoading ? <Skeleton className="h-40 w-full" /> : <RecallsTable recalls={recalls.data ?? []} />}
        </TabsContent>
        <TabsContent value="complaints">
          {complaints.isLoading ? <Skeleton className="h-40 w-full" /> : <ComplaintsTable complaints={complaints.data ?? []} />}
        </TabsContent>
        <TabsContent value="investigations">
          {investigations.isLoading ? (
            <Skeleton className="h-40 w-full" />
          ) : (
            <InvestigationsTable items={investigations.data ?? []} />
          )}
        </TabsContent>
        <TabsContent value="tsbs">
          <Card>
            <CardContent className="p-6 text-sm text-muted-foreground space-y-2">
              <p>
                NHTSA publishes manufacturer communications (Technical Service Bulletins) as
                downloadable datasets rather than a JSON API. Use the official dataset page to
                search by manufacturer/component:
              </p>
              <p>
                <a
                  className="text-primary underline underline-offset-4"
                  href="https://www.nhtsa.gov/nhtsa-datasets-and-apis#manufacturer-communications"
                  target="_blank"
                  rel="noreferrer"
                >
                  Open NHTSA Manufacturer Communications dataset →
                </a>
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatCard({
  label,
  value,
  loading,
  highlight,
}: {
  label: string;
  value: number;
  loading?: boolean;
  highlight?: boolean;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
        <div className="mt-1 flex items-baseline gap-2">
          {loading ? (
            <Skeleton className="h-7 w-12" />
          ) : (
            <>
              <span className="text-2xl font-semibold">{value}</span>
              {highlight && <Badge variant="warning">Attention</Badge>}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
