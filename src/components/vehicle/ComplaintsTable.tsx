import * as React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import type { Complaint } from '@/lib/api/types';
import { formatDate } from '@/lib/utils';

export function ComplaintsTable({ complaints }: { complaints: Complaint[] }) {
  const [selected, setSelected] = React.useState<Complaint | null>(null);

  const byComponent = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const c of complaints) {
      const key = (c.components || 'Unspecified').split(/[,;|]/)[0].trim() || 'Unspecified';
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return Array.from(counts, ([component, count]) => ({ component, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [complaints]);

  if (!complaints.length) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No consumer complaints found for this vehicle.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top components by complaint count</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={byComponent} margin={{ left: 0, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis
                dataKey="component"
                interval={0}
                angle={-20}
                textAnchor="end"
                height={70}
                tick={{ fontSize: 11 }}
              />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  background: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="px-4 py-3">ODI #</th>
                  <th className="px-4 py-3">Component</th>
                  <th className="px-4 py-3">Filed</th>
                  <th className="px-4 py-3">Flags</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {complaints.slice(0, 200).map((c) => (
                  <tr key={c.odiNumber} className="border-t hover:bg-accent/30">
                    <td className="px-4 py-3 font-mono text-xs">{c.odiNumber}</td>
                    <td className="px-4 py-3">{c.components}</td>
                    <td className="px-4 py-3">{formatDate(c.dateComplaintFiled)}</td>
                    <td className="px-4 py-3 space-x-1">
                      {c.crash && <Badge variant="destructive">Crash</Badge>}
                      {c.fire && <Badge variant="destructive">Fire</Badge>}
                      {c.numberOfInjuries > 0 && <Badge variant="warning">{c.numberOfInjuries} inj</Badge>}
                      {c.numberOfDeaths > 0 && <Badge variant="destructive">{c.numberOfDeaths} fatal</Badge>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Button size="sm" variant="outline" onClick={() => setSelected(c)}>
                        Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {complaints.length > 200 && (
              <div className="border-t p-3 text-center text-xs text-muted-foreground">
                Showing first 200 of {complaints.length} complaints
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>Complaint {selected.odiNumber}</DialogTitle>
                <DialogDescription>
                  {selected.components} · Filed {formatDate(selected.dateComplaintFiled)}
                </DialogDescription>
              </DialogHeader>
              <p className="text-sm whitespace-pre-wrap text-muted-foreground">{selected.summary}</p>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
