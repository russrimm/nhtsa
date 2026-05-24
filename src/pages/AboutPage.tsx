import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const apis = [
  { name: 'vPIC (Vehicle API)', url: 'https://vpic.nhtsa.dot.gov/api/' },
  { name: 'Safety Ratings (NCAP)', url: 'https://api.nhtsa.gov/SafetyRatings' },
  { name: 'Recalls', url: 'https://api.nhtsa.gov/recalls/recallsByVehicle' },
  { name: 'Complaints', url: 'https://api.nhtsa.gov/complaints/complaintsByVehicle' },
  { name: 'Investigations', url: 'https://api.nhtsa.gov/investigations/investigationsByVehicle' },
  { name: 'Car Seat Inspection Locator', url: 'https://api.nhtsa.gov/cscRpt/searchByZip' },
  { name: 'Manufacturer Communications (TSBs) — dataset only', url: 'https://www.nhtsa.gov/nhtsa-datasets-and-apis' },
];

export function AboutPage() {
  return (
    <div className="container py-8 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">About</h1>
      <Card>
        <CardHeader><CardTitle className="text-base">Data sources</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            This app is a community-built front-end for the public APIs published by the U.S.
            National Highway Traffic Safety Administration (NHTSA). It is not affiliated with or
            endorsed by NHTSA.
          </p>
          <ul className="list-disc pl-6 space-y-1">
            {apis.map((a) => (
              <li key={a.name}>
                <a className="text-primary underline-offset-4 hover:underline" href={a.url} target="_blank" rel="noreferrer">
                  {a.name}
                </a>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Disclaimer</CardTitle></CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Data is presented as-returned by NHTSA and may be incomplete or delayed. For the most
          authoritative information, visit{' '}
          <a className="text-primary underline-offset-4 hover:underline" href="https://www.nhtsa.gov" target="_blank" rel="noreferrer">
            nhtsa.gov
          </a>
          .
        </CardContent>
      </Card>
    </div>
  );
}
