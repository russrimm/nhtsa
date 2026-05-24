import { Link, NavLink } from 'react-router-dom';
import { Car, Moon, Sun, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/ratings', label: 'Ratings' },
  { to: '/recalls', label: 'Recalls' },
  { to: '/complaints', label: 'Complaints' },
  { to: '/compare', label: 'Compare' },
  { to: '/car-seat-locator', label: 'Car Seats' },
  { to: '/about', label: 'About' },
];

export function TopNav() {
  const { theme, toggle } = useTheme();
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center gap-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground">
            <Car className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">NHTSA Analyzer</span>
        </Link>
        <nav className="hidden md:flex items-center gap-1 ml-4">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button asChild variant="ghost" size="icon" aria-label="NHTSA">
            <a href="https://www.nhtsa.gov/nhtsa-datasets-and-apis" target="_blank" rel="noreferrer">
              <Github className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
      {/* Mobile nav */}
      <div className="md:hidden border-t">
        <div className="container flex gap-1 overflow-x-auto py-2 text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'whitespace-nowrap rounded-md px-3 py-1.5',
                  isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:bg-accent',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
