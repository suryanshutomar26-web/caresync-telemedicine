import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// Fix default marker icon paths (Vite + Leaflet quirk)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/**
 * Shows patient location, doctor location, and a straight line between them.
 * For turn-by-turn directions, swap this line for a call to Google Directions API
 * or OSRM (https://project-osrm.org/) — the map/markers pattern stays the same.
 */
export default function MapView({ patient, doctor }) {
  const center = doctor ? [doctor.lat, doctor.lng] : patient ? [patient.lat, patient.lng] : [20.5937, 78.9629];

  return (
    <div className="map-wrap">
      <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {patient && (
          <Marker position={[patient.lat, patient.lng]}>
            <Popup>Your location</Popup>
          </Marker>
        )}
        {doctor && (
          <Marker position={[doctor.lat, doctor.lng]}>
            <Popup>{doctor.name || 'Doctor'}</Popup>
          </Marker>
        )}
        {patient && doctor && (
          <Polyline positions={[[patient.lat, patient.lng], [doctor.lat, doctor.lng]]} color="#2563eb" />
        )}
      </MapContainer>
    </div>
  );
}
