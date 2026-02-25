// pages/MapPage.jsx — Interactive map with employee markers.
// Requires leaflet CSS to be imported in main entry point.
import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeStore } from '../store/useEmployeeStore';

// Fix leaflet's default icon path issue in Vite
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createCustomIcon(status) {
    const colors = { Active: '#16a34a', 'On Leave': '#ca8a04', Remote: '#2563eb' };
    const fill = colors[status] || '#6366f1';
    return L.divIcon({
        className: '',
        html: `<div style="
      width:28px;height:28px;border-radius:50% 50% 50% 0;
      background:${fill};border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.4);
      transform:rotate(-45deg);
    "></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
    });
}

export default function MapPage() {
    const { isLoading } = useEmployees();
    const { employees } = useEmployeeStore();

    const validEmployees = useMemo(
        () => employees.filter(e => e.lat !== 0 && e.lng !== 0),
        [employees]
    );

    if (isLoading) {
        return (
            <div className="page-content">
                <div className="loading-state">
                    <div className="spinner" />
                    <p>Loading map data…</p>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content map-page">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Employee Map</h1>
                    <p className="page-subtitle">{validEmployees.length} locations across India</p>
                </div>
                <div className="map-legend">
                    <span style={{ background: '#16a34a' }} className="legend-dot" /> Active
                    <span style={{ background: '#ca8a04' }} className="legend-dot legend-dot-ml" /> On Leave
                    <span style={{ background: '#2563eb' }} className="legend-dot legend-dot-ml" /> Remote
                </div>
            </div>

            <div className="map-container">
                <MapContainer
                    center={[20.5937, 78.9629]}
                    zoom={5}
                    style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    {validEmployees.map(emp => (
                        <Marker
                            key={emp.id}
                            position={[emp.lat, emp.lng]}
                            icon={createCustomIcon(emp.status)}
                        >
                            <Popup>
                                <div className="map-popup">
                                    <img className="popup-avatar" src={emp.avatar} alt={emp.name} />
                                    <div>
                                        <strong>{emp.name}</strong>
                                        <p>{emp.role}</p>
                                        <p>📍 {emp.city}</p>
                                        <p style={{ color: '#6366f1', fontWeight: '600' }}>{emp.getDisplaySalary()}</p>
                                    </div>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
}
