import * as React from 'react';
import maplibregl from 'maplibre-gl';
import type { CarSeatStation } from '@/lib/api/types';

interface Props {
  stations: CarSeatStation[];
  center?: { lat: number; lng: number };
}

export function StationMap({ stations, center }: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const mapRef = React.useRef<maplibregl.Map | null>(null);
  const markersRef = React.useRef<maplibregl.Marker[]>([]);

  React.useEffect(() => {
    if (!ref.current || mapRef.current) return;
    mapRef.current = new maplibregl.Map({
      container: ref.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
          },
        },
        layers: [{ id: 'osm', type: 'raster', source: 'osm' }],
      },
      center: [center?.lng ?? -98.5, center?.lat ?? 39.5],
      zoom: center ? 9 : 3.2,
    });
    mapRef.current.addControl(new maplibregl.NavigationControl(), 'top-right');
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [center]);

  React.useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    // Clear old markers
    for (const m of markersRef.current) m.remove();
    markersRef.current = [];

    const bounds = new maplibregl.LngLatBounds();
    let added = 0;
    for (const s of stations) {
      if (s.lat == null || s.lng == null) continue;
      const el = document.createElement('div');
      el.style.cssText =
        'width:14px;height:14px;border-radius:50%;background:hsl(221,83%,53%);border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,.2);';
      const popup = new maplibregl.Popup({ offset: 12 }).setHTML(
        `<div style="font:13px system-ui;padding:4px 2px;max-width:240px"><strong>${escapeHtml(s.name)}</strong>` +
          (s.address1 ? `<br/>${escapeHtml(s.address1)}` : '') +
          (s.city ? `<br/>${escapeHtml([s.city, s.state, s.zip].filter(Boolean).join(', '))}` : '') +
          (s.phone ? `<br/>${escapeHtml(s.phone)}` : '') +
          '</div>',
      );
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([s.lng, s.lat])
        .setPopup(popup)
        .addTo(map);
      markersRef.current.push(marker);
      bounds.extend([s.lng, s.lat]);
      added++;
    }
    if (added > 1) {
      map.fitBounds(bounds, { padding: 60, maxZoom: 12, duration: 600 });
    } else if (added === 1 && center) {
      map.flyTo({ center: [center.lng, center.lat], zoom: 10, duration: 600 });
    }
  }, [stations, center]);

  return <div ref={ref} className="h-[480px] w-full overflow-hidden rounded-lg border" />;
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!,
  );
}
