import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const severityColors = {
  critical: '#EF4444',
  high: '#F97316',
  medium: '#F59E0B',
  low: '#22C55E',
};

function createColoredIcon(color) {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="background:${color};width:24px;height:24px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12],
  });
}

function LocationMarker({ onLocationFound }) {
  const map = useMap();
  useEffect(() => {
    map.locate({ setView: true, maxZoom: 14 });
    map.on('locationfound', (e) => {
      if (onLocationFound) onLocationFound(e.latlng);
    });
  }, [map, onLocationFound]);
  return null;
}

const mockMarkers = [
  { id: 1, lat: 28.6139, lng: 77.209, type: 'Pothole', severity: 'high', description: 'Large pothole near intersection', report: 'Reported by Ravi', date: '2026-06-28' },
  { id: 2, lat: 28.7041, lng: 77.1025, type: 'Broken Signal', severity: 'critical', description: 'Traffic light not working', report: 'Reported by Priya', date: '2026-06-27' },
  { id: 3, lat: 28.4595, lng: 77.0266, type: 'Road Damage', severity: 'medium', description: 'Cracked road surface', report: 'Reported by Amit', date: '2026-06-26' },
  { id: 4, lat: 28.5355, lng: 77.391, type: 'Waterlogging', severity: 'low', description: 'Water accumulation on road', report: 'Reported by Sunita', date: '2026-06-25' },
];

export default function MapView({ markers = mockMarkers, center, zoom = 12, className, showHeatmap = false }) {
  const [mapCenter, setMapCenter] = useState(center || [28.6139, 77.209]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLocationFound = (latlng) => {
    setMapCenter([latlng.lat, latlng.lng]);
  };

  if (loading) {
    return (
      <div className={cn('glass-card p-6 flex items-center justify-center min-h-[400px]', className)}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn('glass-card overflow-hidden rounded-2xl border border-white/10', className)}
    >
      <MapContainer center={mapCenter} zoom={zoom} className="w-full h-full min-h-[400px] z-0">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker onLocationFound={handleLocationFound} />
        {markers.map((m) => (
          <Marker
            key={m.id}
            position={[m.lat, m.lng]}
            icon={createColoredIcon(severityColors[m.severity] || severityColors.medium)}
          >
            <Popup>
              <div className="text-gray-900 min-w-[200px]">
                <h3 className="font-bold text-lg">{m.type}</h3>
                <p className="text-sm text-gray-600 mt-1">{m.description}</p>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <span className={cn(
                    'px-2 py-0.5 rounded-full font-medium',
                    m.severity === 'critical' && 'bg-red-100 text-red-700',
                    m.severity === 'high' && 'bg-orange-100 text-orange-700',
                    m.severity === 'medium' && 'bg-yellow-100 text-yellow-700',
                    m.severity === 'low' && 'bg-green-100 text-green-700',
                  )}>
                    {m.severity}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1.5">{m.report} &middot; {m.date}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  );
}
