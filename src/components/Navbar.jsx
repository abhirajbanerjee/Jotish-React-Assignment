// components/Navbar.jsx — Dark sidebar navigation with icons.
import { NavLink, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
    { to: '/list', label: 'Employees', icon: '👥' },
    { to: '/chart', label: 'Chart', icon: '📊' },
    { to: '/map', label: 'Map', icon: '🗺️' },
];

export default function Navbar() {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem('auth');
        navigate('/login');
    }

    return (
        <nav className="sidebar">
            <div className="sidebar-brand">
                <span className="brand-icon">💼</span>
                <span className="brand-name">EmpDir</span>
            </div>

            <ul className="sidebar-nav">
                {NAV_ITEMS.map(({ to, label, icon }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                        >
                            <span className="nav-icon">{icon}</span>
                            <span className="nav-label">{label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>

            <button className="logout-btn" onClick={handleLogout}>
                <span>🚪</span>
                <span>Logout</span>
            </button>
        </nav>
    );
}
