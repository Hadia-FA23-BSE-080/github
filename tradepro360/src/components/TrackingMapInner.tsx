"use client";

import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface TrackingData {
  engineer: {
    name: string;
    position: { lat: number; lng: number };
  } | null;
  destination: { lat: number; lng: number; address: string };
}

const engineerIcon = new L.DivIcon({
  html: `<div style="background:#2563eb;width:32px;height:32px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:16px">🚐</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const destinationIcon = new L.DivIcon({
  html: `<div style="background:#dc2626;width:28px;height:28px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;font-size:14px">📍</div>`,
  className: "",
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

export default function TrackingMapInner({ data }: { data: TrackingData }) {
  const center: [number, number] = data.engineer
    ? [
        (data.engineer.position.lat + data.destination.lat) / 2,
        (data.engineer.position.lng + data.destination.lng) / 2,
      ]
    : [data.destination.lat, data.destination.lng];

  const route: [number, number][] = data.engineer
    ? [
        [data.engineer.position.lat, data.engineer.position.lng],
        [data.destination.lat, data.destination.lng],
      ]
    : [];

  return (
    <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {data.engineer && (
        <>
          <Marker
            position={[data.engineer.position.lat, data.engineer.position.lng]}
            icon={engineerIcon}
          >
            <Popup>{data.engineer.name} — En Route</Popup>
          </Marker>
          <Polyline positions={route} color="#2563eb" weight={3} dashArray="8 8" />
        </>
      )}
      <Marker
        position={[data.destination.lat, data.destination.lng]}
        icon={destinationIcon}
      >
        <Popup>{data.destination.address}</Popup>
      </Marker>
    </MapContainer>
  );
}
