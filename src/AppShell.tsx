import { Outlet } from 'react-router-dom';
import { TopNav } from '@/components/layout/TopNav';
import { CompareBar } from '@/components/compare/CompareBar';

export function AppShell() {
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        Built with public NHTSA APIs · Not affiliated with NHTSA
      </footer>
      <CompareBar />
    </div>
  );
}
