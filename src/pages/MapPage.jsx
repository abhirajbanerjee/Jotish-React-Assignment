import { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import L from 'leaflet';
import { useEmployees } from '../hooks/useEmployees';
import { useEmployeeStore } from '../store/useEmployeeStore';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function createGroupIcon(count, dominantStatus) {
    const colors = { Active: '#16a34a', 'On Leave': '#ca8a04', Remote: '#2563eb' };
    const fill = colors[dominantStatus] || '#6366f1';
    const size = count > 1 ? 38 : 28;

    return L.divIcon({
        className: '',
        html: `
      <div style="
        position:relative;
        width:${size}px;height:${size}px;
        border-radius:50% 50% 50% 0;
        background:${fill};
        border:3px solid white;
        box-shadow:0 2px 10px rgba(0,0,0,0.4);
        transform:rotate(-45deg);
        display:flex;align-items:center;justify-content:center;
      ">
        ${count > 1 ? `
          <span style="
            transform:rotate(45deg);
            font-size:12px;font-weight:700;
            color:white;line-height:1;
          ">${count}</span>
        ` : ''}
      </div>
    `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
    });
}

const STATUS_DOT = {
    'Active': '#16a34a',
    'On Leave': '#ca8a04',
    'Remote': '#2563eb',
};

export default function MapPage() {
    const { isLoading } = useEmployees();
    const { employees } = useEmployeeStore();

    const cityGroups = useMemo(() => {
        const groups = new Map();
        employees
            .filter(e => e.lat !== 0 || e.lng !== 0)
            .forEach(emp => {
                if (!groups.has(emp.city)) {
                    groups.set(emp.city, { employees: [], lat: emp.lat, lng: emp.lng });
                }
                groups.get(emp.city).employees.push(emp);
            });
        return groups;
    }, [employees]);

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
                    <p className="page-subtitle">
                        {cityGroups.size} cities · {employees.length} employees worldwide
                    </p>
                </div>
                <div className="map-legend">
                    <span style={{ background: '#16a34a' }} className="legend-dot" /> Active
                    <span style={{ background: '#ca8a04' }} className="legend-dot legend-dot-ml" /> On Leave
                    <span style={{ background: '#2563eb' }} className="legend-dot legend-dot-ml" /> Remote
                </div>
            </div>

            <div className="map-container">
                <MapContainer
                    center={[20, 0]}
                    zoom={2}
                    style={{ height: '100%', width: '100%', borderRadius: '12px' }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />

                    {[...cityGroups.entries()].map(([city, group]) => {
                        const statusCount = group.employees.reduce((acc, e) => {
                            acc[e.status] = (acc[e.status] || 0) + 1;
                            return acc;
                        }, {});
                        const dominantStatus = Object.entries(statusCount).sort((a, b) => b[1] - a[1])[0][0];

                        return (
                            <Marker
                                key={city}
                                position={[group.lat, group.lng]}
                                icon={createGroupIcon(group.employees.length, dominantStatus)}
                            >
                                <Popup minWidth={260} maxWidth={320} className="city-popup">
                                    <div className="popup-header">
                                        <MapPin size={18} strokeWidth={2} style={{ color: '#6366f1', flexShrink: 0 }} />
                                        <div>
                                            <strong className="popup-city-name">{city}</strong>
                                            <span className="popup-count">
                                                {group.employees.length} employee{group.employees.length > 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="popup-employee-list">
                                        {group.employees.map(emp => (
                                            <div key={emp.id} className="popup-employee-row">
                                                <img
                                                    className="popup-emp-avatar"
                                                    src={emp.avatar}
                                                    alt={emp.name}
                                                />
                                                <div className="popup-emp-info">
                                                    <p className="popup-emp-name">{emp.name}</p>
                                                    <p className="popup-emp-role">{emp.role}</p>
                                                    <p className="popup-emp-salary">{emp.getDisplaySalary()}</p>
                                                </div>
                                                <span
                                                    className="popup-status-dot"
                                                    style={{ background: STATUS_DOT[emp.status] }}
                                                    title={emp.status}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </div>
        </div>
    );
}
