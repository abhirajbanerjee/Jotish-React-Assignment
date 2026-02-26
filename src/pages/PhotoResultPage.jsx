import { useLocation, useNavigate } from 'react-router-dom';
import { MapPin, DollarSign, Tag, RefreshCw, ArrowLeft, CameraOff } from 'lucide-react';

export default function PhotoResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { photoUrl, employee } = location.state || {};

    const salary = typeof employee?.getDisplaySalary === 'function'
        ? employee.getDisplaySalary()
        : employee?.salary
            ? `$${Number(employee.salary).toLocaleString('en-US')}`
            : '—';

    if (!photoUrl || !employee) {
        return (
            <div className="page-content">
                <div className="error-state">
                    <CameraOff size={48} strokeWidth={2} color="#475569" />
                    <h2>No photo found</h2>
                    <p>Please capture a photo from the employee details page.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/list')}>
                        Go to Employee List
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="page-content">
            <h1 className="page-title">Captured Photo</h1>
            <p className="page-subtitle">{employee.name} · {employee.role}</p>

            <div className="photo-layout">
                <div className="photo-frame">
                    <img
                        src={photoUrl}
                        alt={`Photo of ${employee.name}`}
                        className="captured-photo"
                    />
                    <div className="photo-badge">
                        <img className="photo-avatar-sm" src={employee.avatar} alt="" />
                        <div>
                            <p className="photo-emp-name">{employee.name}</p>
                            <p className="photo-emp-role">{employee.role}</p>
                        </div>
                    </div>
                </div>

                <div className="photo-info-panel">
                    <h2 className="photo-emp-title">{employee.name}</h2>

                    <div className="photo-details-list">
                        <div className="photo-detail-row">
                            <MapPin size={15} strokeWidth={2} />
                            <span>{employee.city}</span>
                        </div>
                        <div className="photo-detail-row">
                            <DollarSign size={15} strokeWidth={2} />
                            <span>{salary}</span>
                        </div>
                        <div className="photo-detail-row">
                            <Tag size={15} strokeWidth={2} />
                            <span>{employee.status}</span>
                        </div>
                    </div>

                    <div className="photo-btn-group">
                        <button
                            className="btn btn-ghost"
                            onClick={() => navigate(`/details/${employee.id}`)}
                        >
                            <RefreshCw size={15} strokeWidth={2} />
                            Retake Photo
                        </button>
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/list')}
                        >
                            <ArrowLeft size={15} strokeWidth={2} />
                            Back to List
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
