import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, User, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { login } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await login(form.username, form.password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', form.username);
      navigate('/empleados');
    } catch {
      setError('Credenciales incorrectas. Verifique su usuario y contraseña.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-brand">
          <div className="login-brand-icon">
            <Building2 size={26} />
          </div>
          <h1 className="login-title">Gestión de Activos Tecnológicos</h1>
          <p className="login-subtitle">Ingrese sus credenciales para continuar</p>
        </div>

        <div className="login-divider" />

        <form onSubmit={handleSubmit} className="login-form" style={{ marginTop: '1.25rem' }}>
          <div className="form-group">
            <label htmlFor="username">Usuario</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '10px', top: '50%',
                transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none'
              }}>
                <User size={15} />
              </span>
              <input
                id="username"
                name="username"
                type="text"
                value={form.username}
                onChange={handleChange}
                placeholder="Nombre de usuario"
                required
                autoFocus
                autoComplete="username"
                style={{ paddingLeft: '2rem' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: '10px', top: '50%',
                transform: 'translateY(-50%)', color: '#94a3b8', pointerEvents: 'none'
              }}>
                <Lock size={15} />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Contraseña"
                required
                autoComplete="current-password"
                style={{ paddingLeft: '2rem' }}
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <AlertCircle size={15} />
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary btn-block" disabled={loading} style={{ marginTop: '0.25rem' }}>
            {loading ? (
              <>
                <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} />
                Autenticando...
              </>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: '#94a3b8' }}>
          Sistema de Gestión de Activos Tecnológicos v1.0
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default Login;
