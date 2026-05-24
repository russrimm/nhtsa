import React, { Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '@/AppShell';

const DashboardPage     = React.lazy(() => import('@/pages/DashboardPage').then(m => ({ default: m.DashboardPage })));
const VinResultPage     = React.lazy(() => import('@/pages/VinResultPage').then(m => ({ default: m.VinResultPage })));
const VehicleHubPage    = React.lazy(() => import('@/pages/VehicleHubPage').then(m => ({ default: m.VehicleHubPage })));
const RecallsPage       = React.lazy(() => import('@/pages/RecallsPage').then(m => ({ default: m.RecallsPage })));
const ComplaintsPage    = React.lazy(() => import('@/pages/ComplaintsPage').then(m => ({ default: m.ComplaintsPage })));
const RatingsPage       = React.lazy(() => import('@/pages/RatingsPage').then(m => ({ default: m.RatingsPage })));
const CarSeatLocatorPage = React.lazy(() => import('@/pages/CarSeatLocatorPage').then(m => ({ default: m.CarSeatLocatorPage })));
const ComparePage        = React.lazy(() => import('@/pages/ComparePage').then(m => ({ default: m.ComparePage })));
const AboutPage         = React.lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const NotFoundPage      = React.lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[40vh] text-muted-foreground text-sm">
    Loading…
  </div>
);

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      { path: '/',                          element: <Suspense fallback={<PageLoader />}><DashboardPage /></Suspense> },
      { path: '/vin/:vin',                  element: <Suspense fallback={<PageLoader />}><VinResultPage /></Suspense> },
      { path: '/vehicle/:year/:make/:model',element: <Suspense fallback={<PageLoader />}><VehicleHubPage /></Suspense> },
      { path: '/recalls',                   element: <Suspense fallback={<PageLoader />}><RecallsPage /></Suspense> },
      { path: '/complaints',                element: <Suspense fallback={<PageLoader />}><ComplaintsPage /></Suspense> },
      { path: '/ratings',                   element: <Suspense fallback={<PageLoader />}><RatingsPage /></Suspense> },
      { path: '/car-seat-locator',          element: <Suspense fallback={<PageLoader />}><CarSeatLocatorPage /></Suspense> },
      { path: '/compare',                   element: <Suspense fallback={<PageLoader />}><ComparePage /></Suspense> },
      { path: '/about',                     element: <Suspense fallback={<PageLoader />}><AboutPage /></Suspense> },
      { path: '*',                          element: <Suspense fallback={<PageLoader />}><NotFoundPage /></Suspense> },
    ],
  },
]);
