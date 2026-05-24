import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const apis = [
  { name: 'vPIC (Vehicle API)', url: 'https://vpic.nhtsa.dot.gov/api/' },
  { name: 'Safety Ratings (NCAP)', url: 'https://api.nhtsa.gov/SafetyRatings' },
  { name: 'Recalls', url: 'https://api.nhtsa.gov/recalls/recallsByVehicle' },
  { name: 'Complaints', url: 'https://api.nhtsa.gov/complaints/complaintsByVehicle' },
  { name: 'Investigations', url: 'https://api.nhtsa.gov/investigations/investigationsByVehicle' },
  { name: 'Car Seat Inspection Locator', url: 'https://api.nhtsa.gov/cscRpt/searchByZip' },
  { name: 'Manufacturer Communications (TSBs) — dataset only', url: 'https://www.nhtsa.gov/nhtsa-datasets-and-apis' },
];

const skills = [
  'Azure & Cloud Architecture',
  'AI / LLM Integration',
  'Agentic Coding (Vibe Coding)',
  'TypeScript & React',
  'Node.js & Python',
  'DevOps & CI/CD',
  'Sales Engineering',
  'Solution Architecture',
];

export function AboutPage() {
  return (
    <div className="container py-8 space-y-6 max-w-3xl">
      <h1 className="text-2xl font-semibold">About</h1>

      {/* Builder card */}
      <Card>
        <CardHeader><CardTitle className="text-base">Built by Russ Rimmer</CardTitle></CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p>
            This app was built by{' '}
            <a
              className="text-primary underline-offset-4 hover:underline font-medium"
              href="https://www.linkedin.com/in/russrimm/"
              target="_blank"
              rel="noreferrer"
            >
              Russ Rimmerman
            </a>
            , a Microsoft Azure specialist with a background spanning cloud architecture, AI
            integration, and sales engineering. Russ works with enterprise customers to help them
            adopt Azure services at scale, with a particular focus on AI-powered solutions and
            developer tooling.
          </p>
          <p>
            One of his newest areas of expertise is <strong>Agentic Coding</strong> — also known as{' '}
            <strong>Vibe Coding</strong> — a modern development approach where AI coding agents
            (such as GitHub Copilot in agent mode) drive large portions of the implementation.
            Rather than writing every line by hand, the developer guides the agent with natural
            language intent, reviews the output, and iterates rapidly. This project was itself built
            using that workflow.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {skills.map((s) => (
              <Badge key={s} variant="secondary">{s}</Badge>
            ))}
          </div>
          <p className="text-muted-foreground">
            Connect on{' '}
            <a
              className="text-primary underline-offset-4 hover:underline"
              href="https://www.linkedin.com/in/russrimm/"
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn ↗
            </a>
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Data sources</CardTitle></CardHeader>
        <CardContent className="space-y-2 text-sm">
          <p>
            This app is a front-end for the public APIs published by the U.S.
            National Highway Traffic Safety Administration (NHTSA). It is not affiliated with or
            endorsed by NHTSA, and was instead built to demonstrate the capabilities of modern web
            development and AI integration.
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
