import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import ErrorBoundary from './components/ErrorBoundary';

import Login from './pages/Login';
import Empleados from './pages/Empleados';
import Equipos from './pages/Equipos';
import Gestion from './pages/Gestion';
import Historial from './pages/Historial';
import Mantenimiento from './pages/Mantenimiento';

const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <div className="main-content">
      {children}
    </div>
  </div>
);

const ProtectedLayout = ({ children }) => (
  <ProtectedRoute>
    <AppLayout>
      <ErrorBoundary>{children}</ErrorBoundary>
    </AppLayout>
  </ProtectedRoute>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/empleados"    element={<ProtectedLayout><Empleados /></ProtectedLayout>} />
        <Route path="/equipos"      element={<ProtectedLayout><Equipos /></ProtectedLayout>} />
        <Route path="/gestion"      element={<ProtectedLayout><Gestion /></ProtectedLayout>} />
        <Route path="/historial"    element={<ProtectedLayout><Historial /></ProtectedLayout>} />
        <Route path="/mantenimiento" element={<ProtectedLayout><Mantenimiento /></ProtectedLayout>} />
        <Route path="/" element={<Navigate to="/empleados" replace />} />
        <Route path="*" element={<Navigate to="/empleados" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
