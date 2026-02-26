import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutList, BarChart2, Map, LogOut } from 'lucide-react';

const NAV_ITEMS = [
    { to: '/list', label: 'Employees', Icon: LayoutList },
    { to: '/chart', label: 'Chart', Icon: BarChart2 },
    { to: '/map', label: 'Map', Icon: Map },
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
                <div className="brand-wordmark">
                    <span className="brand-name">Jotish</span>
                    <span className="brand-sub">Employee System</span>
                </div>
            </div>

            <ul className="sidebar-nav">
                {NAV_ITEMS.map(({ to, label, Icon }) => (
                    <li key={to}>
                        <NavLink
                            to={to}
                            className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
                        >
                            <Icon size={18} strokeWidth={2} className="nav-icon" />
                            <span className="nav-label">{label}</span>
                        </NavLink>
                    </li>
                ))}
            </ul>

            <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={17} strokeWidth={2} />
                <span>Logout</span>
            </button>
        </nav>
    );
}
