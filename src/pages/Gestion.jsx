import React, { useState, useEffect } from 'react';
import { Plus, RotateCcw, Link, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import {
  asignarEquipo,
  consultarEmpleadosConEquipos,
  registrarDevolucion,
} from '../services/gestionService';

const Gestion = () => {
  const [asignaciones, setAsignaciones] = useState([]);
  const [formAsignar, setFormAsignar] = useState({ empleadoId: '', equipoId: '' });
  const [modalAbierto, setModalAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [asignando, setAsignando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarAsignaciones = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await consultarEmpleadosConEquipos();
      setAsignaciones(Array.isArray(data) ? data : []);
    } catch {
      setError('Error al cargar las asignaciones.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarAsignaciones(); }, []);

  const handleChange = (e) => setFormAsignar({ ...formAsignar, [e.target.name]: e.target.value });

  const abrirModal = () => {
    setFormAsignar({ empleadoId: '', equipoId: '' });
    setModalAbierto(true);
    setMensaje('');
    setError('');
  };

  const handleAsignar = async (e) => {
    e.preventDefault();
    setError('');
    setAsignando(true);
    try {
      await asignarEquipo({
        empleadoId: Number(formAsignar.empleadoId),
        equipoId: Number(formAsignar.equipoId),
      });
      setMensaje('Equipo asignado correctamente.');
      setModalAbierto(false);
      cargarAsignaciones();
    } catch {
      setError('Error al asignar el equipo. Verifique que el equipo esté disponible.');
    } finally {
      setAsignando(false);
    }
  };

  const handleDevolucion = async (asignacionId) => {
    if (!window.confirm('¿Confirma el registro de devolución de este equipo?')) return;
    setError('');
    setMensaje('');
    try {
      await registrarDevolucion(asignacionId);
      setMensaje('Devolución registrada correctamente.');
      cargarAsignaciones();
    } catch {
      setError('Error al registrar la devolución.');
    }
  };

  const activas = asignaciones.filter((a) => a.activo !== false);
  const historico = asignaciones.filter((a) => a.activo === false);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Gestión de Asignaciones</h1>
          <p>Asignación y devolución de equipos tecnológicos</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={abrirModal}>
            <Plus size={15} />
            Asignar Equipo
          </button>
        </div>
      </div>

      {mensaje && (
        <div className="success-message">
          <CheckCircle2 size={15} />
          {mensaje}
        </div>
      )}
      {error && (
        <div className="error-message">
          <AlertCircle size={15} />
          {error}
        </div>
      )}

      <div className="card">
        <h2>Asignaciones Activas {activas.length > 0 && <span style={{ color: '#64748b', fontWeight: 400 }}>({activas.length})</span>}</h2>
        {loading ? (
          <p className="loading-text">Cargando asignaciones...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Empleado</th>
                <th>Equipo</th>
                <th>Fecha Asignación</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {activas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    <Link size={28} style={{ display: 'block', margin: '0 auto 0.5rem', opacity: 0.3 }} />
                    No hay asignaciones activas
                  </td>
                </tr>
              ) : (
                activas.map((a) => (
                  <tr key={a.id}>
                    <td style={{ color: '#64748b', fontWeight: 500 }}>#{a.id}</td>
                    <td style={{ fontWeight: 600 }}>{a.nombreEmpleado || `Empleado #${a.empleadoId}`}</td>
                    <td>{a.nombreEquipo || `Equipo #${a.equipoId}`}</td>
                    <td>{a.fechaAsignacion ? new Date(a.fechaAsignacion).toLocaleDateString('es-CL') : '—'}</td>
                    <td><Badge variant="success">Activa</Badge></td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-sm btn-secondary" onClick={() => handleDevolucion(a.id)}>
                          <RotateCcw size={13} />
                          Registrar Devolución
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {historico.length > 0 && (
        <div className="card">
          <h2>Historial de Devoluciones <span style={{ color: '#64748b', fontWeight: 400 }}>({historico.length})</span></h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Empleado</th>
                <th>Equipo</th>
                <th>Fecha Asignación</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {historico.map((a) => (
                <tr key={a.id}>
                  <td style={{ color: '#64748b', fontWeight: 500 }}>#{a.id}</td>
                  <td>{a.nombreEmpleado || `Empleado #${a.empleadoId}`}</td>
                  <td>{a.nombreEquipo || `Equipo #${a.equipoId}`}</td>
                  <td>{a.fechaAsignacion ? new Date(a.fechaAsignacion).toLocaleDateString('es-CL') : '—'}</td>
                  <td><Badge variant="neutral">Devuelta</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        title="Asignar Equipo a Empleado"
        maxWidth="460px"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setModalAbierto(false)}>
              Cancelar
            </button>
            <button type="submit" form="form-asignar" className="btn btn-primary" disabled={asignando}>
              {asignando ? 'Asignando...' : 'Confirmar asignación'}
            </button>
          </>
        }
      >
        <form id="form-asignar" onSubmit={handleAsignar} className="grid-form">
          <div className="form-group">
            <label>ID del Empleado *</label>
            <input
              name="empleadoId"
              type="number"
              min="1"
              value={formAsignar.empleadoId}
              onChange={handleChange}
              placeholder="Ej: 1"
              required
            />
          </div>
          <div className="form-group">
            <label>ID del Equipo *</label>
            <input
              name="equipoId"
              type="number"
              min="1"
              value={formAsignar.equipoId}
              onChange={handleChange}
              placeholder="Ej: 5"
              required
            />
          </div>
          <div className="form-group--full" style={{ color: '#64748b', fontSize: '0.82rem', marginTop: '-0.25rem' }}>
            Solo se pueden asignar equipos con estado "DISPONIBLE".
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Gestion;
