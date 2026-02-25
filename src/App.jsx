// App.jsx — Router setup. Wraps authenticated pages in ProtectedRoute + Navbar layout.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

import LoginPage from './pages/LoginPage';
import ListPage from './pages/ListPage';
import DetailsPage from './pages/DetailsPage';
import PhotoResultPage from './pages/PhotoResultPage';
import ChartPage from './pages/ChartPage';
import MapPage from './pages/MapPage';

function AuthenticatedLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '10px',
          },
        }}
      />
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/list"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout><ListPage /></AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/details/:id"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout><DetailsPage /></AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/photo"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout><PhotoResultPage /></AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/chart"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout><ChartPage /></AuthenticatedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute>
              <AuthenticatedLayout><MapPage /></AuthenticatedLayout>
            </ProtectedRoute>
          }
        />

        {/* Redirect root to list (ProtectedRoute will send to login if not authed) */}
        <Route path="/" element={<Navigate to="/list" replace />} />
        <Route path="*" element={<Navigate to="/list" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
