import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Monitor,
  Users,
  Link,
  Clock,
  Wrench,
  LogOut,
  Building2,
} from 'lucide-react';
import { logout } from '../services/authService';

const navItems = [
  { path: '/empleados',    label: 'Empleados',    icon: Users },
  { path: '/equipos',      label: 'Equipos',       icon: Monitor },
  { path: '/gestion',      label: 'Gestión',       icon: Link },
  { path: '/historial',    label: 'Historial',     icon: Clock },
  { path: '/mantenimiento',label: 'Mantenimiento', icon: Wrench },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || 'Usuario';
  const initials = username.slice(0, 2).toUpperCase();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Building2 size={16} />
          </div>
          <h2>Activos TI</h2>
        </div>
        <p className="sidebar-subtitle">Gestión Tecnológica</p>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-nav-label">Módulos</div>
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive ? 'sidebar-link sidebar-link--active' : 'sidebar-link'
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user-info">
          <div className="sidebar-user-avatar">{initials}</div>
          <div>
            <div className="sidebar-user-name">{username}</div>
            <div className="sidebar-user-role">Administrador</div>
          </div>
        </div>
        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={14} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
