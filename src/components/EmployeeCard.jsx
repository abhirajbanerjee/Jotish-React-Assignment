import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';

const STATUS_COLORS = {
    'Active': { bg: '#dcfce7', color: '#16a34a' },
    'On Leave': { bg: '#fef9c3', color: '#ca8a04' },
    'Remote': { bg: '#dbeafe', color: '#2563eb' },
};

export default function EmployeeCard({ employee, index }) {
    const statusStyle = STATUS_COLORS[employee.status] || STATUS_COLORS['Active'];

    return (
        <div
            className="employee-card"
            style={{ animationDelay: `${index * 60}ms` }}
        >
            <div className="card-header">
                <img
                    className="card-avatar"
                    src={employee.avatar}
                    alt={employee.name}
                    onError={e => { e.target.style.display = 'none'; }}
                />
                <span
                    className="status-badge"
                    style={{ background: statusStyle.bg, color: statusStyle.color }}
                >
                    {employee.status}
                </span>
            </div>

            <div className="card-body">
                <h3 className="card-name">{employee.name}</h3>
                <p className="card-role">{employee.role}</p>
                <p className="card-city">
                    <MapPin size={13} strokeWidth={2} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                    {employee.city}
                </p>
                <p className="card-salary">{employee.getDisplaySalary()}</p>
            </div>

            <div className="card-footer">
                <Link to={`/details/${employee.id}`} className="btn btn-primary btn-sm">
                    View Details →
                </Link>
            </div>
        </div>
    );
}
