import { Link } from 'react-router-dom';
import { GlobalSearch } from '@/components/search/GlobalSearch';
import { RecentSearches } from '@/components/layout/RecentSearches';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Star,
  ShieldAlert,
  MessageSquareWarning,
  FileSearch,
  Baby,
  FileText,
} from 'lucide-react';

const features = [
  { to: '/ratings', icon: Star, title: 'Safety Ratings', desc: 'NCAP 5-star crash & rollover ratings' },
  { to: '/recalls', icon: ShieldAlert, title: 'Recalls', desc: 'Defect & noncompliance campaigns' },
  { to: '/complaints', icon: MessageSquareWarning, title: 'Complaints', desc: 'Consumer reports filed with NHTSA' },
  { to: '/recalls', icon: FileSearch, title: 'Investigations', desc: 'Active and closed ODI investigations' },
  { to: '/car-seat-locator', icon: Baby, title: 'Car Seat Inspection', desc: 'Find a station near a ZIP code' },
  { to: '/about', icon: FileText, title: 'TSBs / Mfr. Comms', desc: 'Technical service bulletins (dataset)' },
];

export function DashboardPage() {
  return (
    <div className="container py-8 space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">NHTSA Automotive Analyzer</h1>
        <p className="text-muted-foreground max-w-2xl">
          Decode a VIN or pick a Year/Make/Model to instantly pull official NHTSA safety ratings,
          recalls, complaints, and investigations. Free, no sign-up, powered by public NHTSA APIs.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <GlobalSearch />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Link key={f.title} to={f.to} className="group">
                <Card className="h-full transition-colors group-hover:border-primary/50 group-hover:bg-accent/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-md bg-primary/10 text-primary">
                        <f.icon className="h-5 w-5" />
                      </span>
                      <CardTitle className="text-base">{f.title}</CardTitle>
                    </div>
                    <CardDescription>{f.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>
        <aside className="space-y-4">
          <RecentSearches />
          <Card>
            <CardContent className="p-4 text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Data source</p>
              <p>
                All data is fetched live from NHTSA public APIs (vPIC, Safety Ratings, Recalls,
                Complaints, Investigations, Car Seat Inspection Locator). NHTSA is not affiliated
                with this site.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
