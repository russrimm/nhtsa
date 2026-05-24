import { Link } from 'react-router-dom';
import { X, BarChart2, ArrowRight } from 'lucide-react';
import { useCompare } from './CompareContext';
import { Button } from '@/components/ui/button';

export function CompareBar() {
  const { list, remove, clear } = useCompare();
  if (list.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t bg-background/95 backdrop-blur shadow-2xl">
      <div className="container flex items-center gap-3 py-3 flex-wrap">
        <BarChart2 className="h-4 w-4 shrink-0 text-primary" />
        <span className="text-sm font-semibold shrink-0">
          Compare&nbsp;({list.length}/{4}):
        </span>

        <div className="flex flex-wrap gap-2 flex-1 min-w-0">
          {list.map((v) => (
            <span
              key={`${v.year}-${v.make}-${v.model}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium"
            >
              {v.year} {v.make} {v.model}
              <button
                onClick={() => remove(v)}
                className="rounded-full p-0.5 hover:bg-destructive/20 transition-colors"
                aria-label={`Remove ${v.make} ${v.model} from comparison`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" onClick={clear}>
            Clear
          </Button>
          <Button asChild size="sm" disabled={list.length < 2}>
            <Link to="/compare">
              Compare <ArrowRight className="ml-1 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
