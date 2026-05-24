import * as React from 'react';
import { Link } from 'react-router-dom';
import { Clock, X } from 'lucide-react';
import { loadRecent, clearRecent, type RecentItem } from '@/lib/store/recent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function RecentSearches() {
  const [items, setItems] = React.useState<RecentItem[]>([]);
  React.useEffect(() => { setItems(loadRecent()); }, []);

  if (!items.length) return null;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" /> Recent
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => { clearRecent(); setItems([]); }}
          aria-label="Clear recent"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-1">
          {items.map((it) => {
            const href =
              it.kind === 'vin'
                ? `/vin/${encodeURIComponent(it.vin!)}`
                : `/vehicle/${it.ymm!.year}/${encodeURIComponent(it.ymm!.make)}/${encodeURIComponent(it.ymm!.model)}`;
            return (
              <li key={it.label}>
                <Link
                  to={href}
                  className="block rounded-md px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  {it.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
