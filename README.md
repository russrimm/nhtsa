# NHTSA Automotive Analyzer

A modern, free, single-page web app that surfaces all major **NHTSA public APIs**
in one user-friendly UI — VIN decoding, safety ratings, recalls, complaints,
investigations, and the car seat inspection locator.

Built with **Vite + React + TypeScript**, **Tailwind CSS**, **Radix UI**,
**TanStack Query**, **Recharts**, and **MapLibre GL**.

## Features

- **VIN decoder** — paste a 17-char VIN to see decoded specs (vPIC), with a one-click jump to its vehicle hub.
- **Vehicle hub** — tabs for Safety Ratings (NCAP), Recalls, Complaints, Investigations, and TSBs (dataset link).
- **Standalone browsers** — `/ratings`, `/recalls`, `/complaints` with cascading Year → Make → Model filters.
- **Car Seat Inspection Locator** — search by ZIP, results on an OpenStreetMap-powered map.
- **Charts** — top complaint components per vehicle (Recharts).
- **Dark / light theme** with system-preference detection.
- **Recent searches** persisted in `localStorage`.

## NHTSA APIs used

| Capability | Endpoint |
|---|---|
| vPIC vehicles | `https://vpic.nhtsa.dot.gov/api/vehicles/...` |
| Safety Ratings (NCAP) | `https://api.nhtsa.gov/SafetyRatings/...` |
| Recalls | `https://api.nhtsa.gov/recalls/recallsByVehicle` |
| Complaints | `https://api.nhtsa.gov/complaints/complaintsByVehicle` |
| Investigations | `https://api.nhtsa.gov/investigations/investigationsByVehicle` |
| Car Seat Locator | `https://api.nhtsa.gov/cscRpt/searchByZip` |
| TSBs (Manufacturer Communications) | dataset download (no JSON API) |

All endpoints are public and require no API key.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

```bash
npm run build    # Production build
npm run preview  # Preview production build
```

## Project structure

```
src/
  components/
    layout/       TopNav, ThemeProvider, RecentSearches
    search/       GlobalSearch (VIN + YMM)
    ui/           Button, Card, Tabs, Dialog, Select, Badge, Skeleton, Input
    vehicle/      SpecGrid, RecallsTable, ComplaintsTable, RatingsPanel, InvestigationsTable
    map/          StationMap (MapLibre)
  hooks/          useNhtsa.ts (React Query hooks for every endpoint)
  lib/
    api/          http.ts + one module per service + types.ts
    store/        recent.ts (localStorage)
    utils.ts
  pages/          DashboardPage, VinResultPage, VehicleHubPage, RecallsPage,
                  ComplaintsPage, RatingsPage, CarSeatLocatorPage, AboutPage, NotFoundPage
  AppShell.tsx    Layout shell with <Outlet/>
  App.tsx         Providers (Query, Router, Theme)
  main.tsx        Entry
  router.tsx      Routes
  index.css       Tailwind + theme tokens
```

## CORS fallback

If the browser ever blocks a NHTSA endpoint via CORS, `vite.config.ts` includes a
dev-only proxy:

- `/nhtsa-api/*` → `https://api.nhtsa.gov/*`
- `/vpic-api/*` → `https://vpic.nhtsa.dot.gov/api/*`

Flip the relevant `BASE` constant in `src/lib/api/*.ts` to use the proxy path.

## Disclaimer

Not affiliated with NHTSA. Data is presented as returned by the NHTSA APIs and
may be incomplete or delayed.
