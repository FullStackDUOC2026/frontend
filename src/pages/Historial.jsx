import React, { useState } from 'react';
import { Search, Users, Monitor, Clock, AlertCircle } from 'lucide-react';
import Badge from '../components/Badge';
import { historialPorEmpleado, historialPorEquipo } from '../services/historialService';

const formatFecha = (fecha) =>
  fecha ? new Date(fecha).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

const Historial = () => {
  const [modo, setModo] = useState('empleado');
  const [busquedaId, setBusquedaId] = useState('');
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [buscado, setBuscado] = useState(false);
  const [idConsultado, setIdConsultado] = useState('');

  const handleBuscar = async (e) => {
    e.preventDefault();
    if (!busquedaId) return;
    setLoading(true);
    setError('');
    setResultados([]);
    setBuscado(false);
    try {
      const data = modo === 'empleado'
        ? await historialPorEmpleado(busquedaId)
        : await historialPorEquipo(busquedaId);
      setResultados(data);
      setIdConsultado(busquedaId);
      setBuscado(true);
    } catch {
      setError('Error al consultar el historial. Verifique que el ID sea válido.');
    } finally {
      setLoading(false);
    }
  };

  const cambiarModo = (nuevoModo) => {
    setModo(nuevoModo);
    setBusquedaId('');
    setResultados([]);
    setBuscado(false);
    setError('');
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Historial</h1>
          <p>Consulta el historial de asignaciones de equipos</p>
        </div>
      </div>

      <div className="card form-card">
        <div className="toggle-group">
          <button
            className={`btn ${modo === 'empleado' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => cambiarModo('empleado')}
          >
            <Users size={14} />
            Por Empleado
          </button>
          <button
            className={`btn ${modo === 'equipo' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => cambiarModo('equipo')}
          >
            <Monitor size={14} />
            Por Equipo
          </button>
        </div>

        <form onSubmit={handleBuscar} className="search-form">
          <div className="form-group">
            <label>{modo === 'empleado' ? 'ID del Empleado' : 'ID del Equipo'}</label>
            <input
              type="number"
              min="1"
              value={busquedaId}
              onChange={(e) => setBusquedaId(e.target.value)}
              placeholder={modo === 'empleado' ? 'Ej: 3' : 'Ej: 7'}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            <Search size={14} />
            {loading ? 'Consultando...' : 'Consultar'}
          </button>
        </form>
      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      {loading && <p className="loading-text">Cargando historial...</p>}

      {buscado && !loading && (
        <div className="card">
          <h2>
            {modo === 'empleado'
              ? `Historial de asignaciones — Empleado #${idConsultado}`
              : `Historial de asignaciones — Equipo #${idConsultado}`}
          </h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>{modo === 'empleado' ? 'Equipo' : 'Empleado'}</th>
                <th>Fecha Asignación</th>
                <th>Fecha Devolución</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {resultados.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-row">
                    <Clock size={28} style={{ display: 'block', margin: '0 auto 0.5rem', opacity: 0.3 }} />
                    No se encontraron registros para este ID
                  </td>
                </tr>
              ) : (
                resultados.map((r) => (
                  <tr key={r.id}>
                    <td style={{ color: '#64748b', fontWeight: 500 }}>#{r.id}</td>
                    <td style={{ fontWeight: 600 }}>
                      {modo === 'empleado'
                        ? (r.nombreEquipo || `Equipo #${r.equipoId}`)
                        : (r.nombreEmpleado || `Empleado #${r.empleadoId}`)}
                    </td>
                    <td>{formatFecha(r.fechaAsignacion)}</td>
                    <td>
                      {r.fechaDevolucion
                        ? formatFecha(r.fechaDevolucion)
                        : <span style={{ color: '#2563eb', fontWeight: 500 }}>Aún asignado</span>}
                    </td>
                    <td>
                      <Badge variant={r.activo ? 'success' : 'neutral'}>
                        {r.activo ? 'Activa' : 'Devuelta'}
                      </Badge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {resultados.length > 0 && (
            <p style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: '0.75rem' }}>
              {resultados.length} registro{resultados.length !== 1 ? 's' : ''} encontrado{resultados.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Historial;
