// pages/DetailsPage.jsx — Employee detail view + camera capture.
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, DollarSign, Mail, Phone, Building2, Hash, Camera, Circle, X, UserX } from 'lucide-react';
import { useEmployeeStore } from '../store/useEmployeeStore';
import { useCamera } from '../hooks/useCamera';
import { useEmployees } from '../hooks/useEmployees';

export default function DetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { service, status } = useEmployeeStore();
    const { isLoading } = useEmployees();
    const { videoRef, startCamera, capture, stopCamera } = useCamera();

    const [employee, setEmployee] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraError, setCameraError] = useState('');

    useEffect(() => {
        if (status === 'success') {
            const emp = service.findById(id);
            setEmployee(emp);
        }
    }, [status, id, service]);

    // Stop camera when leaving
    useEffect(() => () => stopCamera(), [stopCamera]);

    if (isLoading) {
        return (
            <div className="page-content">
                <div className="loading-state">
                    <div className="spinner" />
                    <p>Loading employee data…</p>
                </div>
            </div>
        );
    }

    if (!employee) {
        return (
            <div className="page-content">
                <div className="error-state">
                    <UserX size={48} strokeWidth={2} color="#475569" />
                    <h2>Employee not found</h2>
                    <button className="btn btn-primary" onClick={() => navigate('/list')}>Back to List</button>
                </div>
            </div>
        );
    }

    async function handleOpenCamera() {
        setCameraError('');
        const ok = await startCamera();
        if (ok) {
            setCameraActive(true);
        } else {
            setCameraError('Camera access denied. Please allow camera permissions and use HTTPS or localhost.');
        }
    }

    function handleCapture() {
        const photoUrl = capture();
        if (!photoUrl) return;
        stopCamera();
        setCameraActive(false);
        navigate('/photo', { state: { photoUrl, employee } });
    }

    function handleStopCamera() {
        stopCamera();
        setCameraActive(false);
    }

    const STATUS_COLORS = {
        'Active': { bg: '#dcfce7', color: '#16a34a' },
        'On Leave': { bg: '#fef9c3', color: '#ca8a04' },
        'Remote': { bg: '#dbeafe', color: '#2563eb' },
    };
    const statusStyle = STATUS_COLORS[employee.status] || STATUS_COLORS['Active'];

    return (
        <div className="page-content">
            <button className="btn btn-ghost back-btn" onClick={() => navigate(-1)}>
                <ArrowLeft size={16} strokeWidth={2} />
                Back
            </button>

            <div className="details-layout">
                {/* Employee Profile Card */}
                <div className="details-card">
                    <img
                        className="details-avatar"
                        src={employee.avatar}
                        alt={employee.name}
                    />
                    <h1 className="details-name">{employee.name}</h1>
                    <p className="details-role">{employee.role}</p>
                    <span
                        className="status-badge status-badge-lg"
                        style={{ background: statusStyle.bg, color: statusStyle.color }}
                    >
                        {employee.status}
                    </span>

                    <div className="details-info-grid">
                        <div className="info-item">
                            <span className="info-label">
                                <MapPin size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                City
                            </span>
                            <span className="info-value">{employee.city}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">
                                <DollarSign size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                Salary
                            </span>
                            <span className="info-value salary-highlight">{employee.getDisplaySalary()}</span>
                        </div>
                        {employee.email && (
                            <div className="info-item">
                                <span className="info-label">
                                    <Mail size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                    Email
                                </span>
                                <span className="info-value">{employee.email}</span>
                            </div>
                        )}
                        {employee.phone && (
                            <div className="info-item">
                                <span className="info-label">
                                    <Phone size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                    Phone
                                </span>
                                <span className="info-value">{employee.phone}</span>
                            </div>
                        )}
                        {employee.department && (
                            <div className="info-item">
                                <span className="info-label">
                                    <Building2 size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                    Dept
                                </span>
                                <span className="info-value">{employee.department}</span>
                            </div>
                        )}
                        <div className="info-item">
                            <span className="info-label">
                                <Hash size={12} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                                ID
                            </span>
                            <span className="info-value">#{employee.id}</span>
                        </div>
                    </div>
                </div>

                {/* Camera Section */}
                <div className="camera-card">
                    <h2 className="camera-title">Photo Capture</h2>
                    <p className="camera-subtitle">Take a quick photo of {employee.name.split(' ')[0]}</p>

                    {cameraActive ? (
                        <div className="camera-active">
                            <video
                                ref={videoRef}
                                data-camera-video
                                autoPlay
                                playsInline
                                muted
                                className="camera-video"
                                onLoadedMetadata={e => e.target.play()}
                            />
                            <div className="camera-controls">
                                <button className="btn btn-primary" onClick={handleCapture}>
                                    <Circle size={15} strokeWidth={2} />
                                    Capture
                                </button>
                                <button className="btn btn-ghost" onClick={handleStopCamera}>
                                    <X size={15} strokeWidth={2} />
                                    Cancel
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="camera-idle">
                            <div className="camera-placeholder">
                                <Camera size={40} strokeWidth={1.5} color="#475569" />
                            </div>
                            {cameraError && <p className="error-message camera-err">{cameraError}</p>}
                            <button className="btn btn-primary btn-lg" onClick={handleOpenCamera}>
                                <Camera size={16} strokeWidth={2} />
                                Open Camera
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
