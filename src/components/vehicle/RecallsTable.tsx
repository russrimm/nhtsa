import * as React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import type { Recall } from '@/lib/api/types';
import { formatDate } from '@/lib/utils';

export function RecallsTable({ recalls }: { recalls: Recall[] }) {
  const [selected, setSelected] = React.useState<Recall | null>(null);
  if (!recalls.length) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No recalls reported for this vehicle. <span className="ml-1">🎉</span>
        </CardContent>
      </Card>
    );
  }
  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">Campaign</th>
                  <th className="px-4 py-3">Component</th>
                  <th className="px-4 py-3">Summary</th>
                  <th className="px-4 py-3 hidden md:table-cell">Reported</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {recalls.map((r) => (
                  <tr key={r.NHTSACampaignNumber} className="border-t hover:bg-accent/30">
                    <td className="px-4 py-3 font-mono text-xs">
                      <Badge variant="warning" className="gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        {r.NHTSACampaignNumber}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">{r.Component}</td>
                    <td className="px-4 py-3 max-w-md truncate" title={r.Summary}>
                      {r.Summary}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {formatDate(r.ReportReceivedDate)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelected(r)}>
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Recall {selected.NHTSACampaignNumber}
                </DialogTitle>
                <DialogDescription>
                  {selected.Component} · Reported {formatDate(selected.ReportReceivedDate)}
                </DialogDescription>
              </DialogHeader>
              <Section title="Summary" body={selected.Summary} />
              <Section title="Consequence" body={selected.Consequence} />
              <Section title="Remedy" body={selected.Remedy} />
              {selected.Notes && <Section title="Notes" body={selected.Notes} />}
              <div className="text-xs text-muted-foreground pt-2">
                Manufacturer: {selected.Manufacturer}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Section({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h4 className="text-sm font-semibold mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground whitespace-pre-wrap">{body}</p>
    </div>
  );
}
