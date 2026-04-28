import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { GEOFENCE_RADIUS_M } from '../lib/geo';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const userIcon = L.divIcon({
  className: '',
  html: '<div style="width:14px;height:14px;background:#22d3ee;border:2px solid #0b0a12;border-radius:9999px;box-shadow:0 0 0 4px rgba(34,211,238,0.35);"></div>',
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

function Recenter({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

export default function MapView({ stop, userPos }) {
  const center = userPos ? [userPos.lat, userPos.lng] : [stop.lat, stop.lng];
  return (
    <div className="overflow-hidden rounded-2xl border border-fuchsia-900/40 h-64">
      <MapContainer
        center={center}
        zoom={17}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[stop.lat, stop.lng]} />
        <Circle
          center={[stop.lat, stop.lng]}
          radius={GEOFENCE_RADIUS_M}
          pathOptions={{ color: '#a855f7', fillColor: '#a855f7', fillOpacity: 0.15 }}
        />
        {userPos && <Marker position={[userPos.lat, userPos.lng]} icon={userIcon} />}
        <Recenter center={userPos ? [userPos.lat, userPos.lng] : null} />
      </MapContainer>
    </div>
  );
}
