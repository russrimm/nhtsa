import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from 'react-router-dom';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import { CompareProvider } from '@/components/compare/CompareContext';
import { router } from '@/router';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 2,
    },
  },
});

export function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <CompareProvider>
          <RouterProvider router={router} />
        </CompareProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
