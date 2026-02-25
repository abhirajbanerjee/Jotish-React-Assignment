// pages/PhotoResultPage.jsx — Displays captured photo from DetailsPage.
import { useLocation, useNavigate } from 'react-router-dom';

export default function PhotoResultPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { photoUrl, employee } = location.state || {};

    if (!photoUrl || !employee) {
        return (
            <div className="page-content">
                <div className="error-state">
                    <span className="error-icon">📷</span>
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
            <div className="photo-page">
                <h1 className="page-title">📸 Captured Photo</h1>

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

                    <div className="photo-actions">
                        <h2 className="photo-emp-title">{employee.name}</h2>
                        <p className="photo-detail">📍 {employee.city}</p>
                        <p className="photo-detail">💰 {employee.getDisplaySalary()}</p>
                        <p className="photo-detail">🏷️ {employee.status}</p>

                        <div className="photo-btn-group">
                            <button
                                className="btn btn-ghost"
                                onClick={() => navigate(`/details/${employee.id}`)}
                            >
                                🔄 Retake Photo
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/list')}
                            >
                                ← Back to List
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
