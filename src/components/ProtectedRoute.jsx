// components/ProtectedRoute.jsx — HOC: Decorator pattern. Wraps any route with auth-checking.
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
    const isAuthenticated = localStorage.getItem('auth') === 'true';
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}
