import { Card, CardContent } from '@/components/ui/card';
import type { Investigation } from '@/lib/api/types';
import { formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function InvestigationsTable({ items }: { items: Investigation[] }) {
  if (!items.length) {
    return (
      <Card>
        <CardContent className="p-6 text-sm text-muted-foreground">
          No NHTSA investigations on file for this vehicle.
        </CardContent>
      </Card>
    );
  }
  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Action #</th>
              <th className="px-4 py-3">Subject / Component</th>
              <th className="px-4 py-3">Opened</th>
              <th className="px-4 py-3">Closed</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.nhtsaActionNumber} className="border-t">
                <td className="px-4 py-3 font-mono text-xs">{it.nhtsaActionNumber}</td>
                <td className="px-4 py-3">{it.subject || it.component || '—'}</td>
                <td className="px-4 py-3">{formatDate(it.openDate)}</td>
                <td className="px-4 py-3">{formatDate(it.closeDate)}</td>
                <td className="px-4 py-3">
                  {it.closeDate ? <Badge variant="secondary">Closed</Badge> : <Badge variant="warning">Open</Badge>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
