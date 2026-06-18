import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Wrench, ToggleLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import {
  listarMantenimientos,
  crearMantenimiento,
  actualizarMantenimiento,
  eliminarMantenimiento,
  modificarDisponibilidad,
} from '../services/mantenimientoService';

const emptyForm = {
  descripcion: '',
  equipoId: '',
  tecnico: '',
  fechaInicio: '',
  fechaFin: '',
  estado: 'PENDIENTE',
};

const ESTADOS_MANT = ['PENDIENTE', 'EN_PROCESO', 'COMPLETADO', 'CANCELADO'];

const estadoBadgeVariant = (estado) => {
  switch (estado) {
    case 'PENDIENTE':   return 'warning';
    case 'EN_PROCESO':  return 'info';
    case 'COMPLETADO':  return 'success';
    case 'CANCELADO':   return 'danger';
    default:            return 'neutral';
  }
};

const formatFecha = (f) =>
  f ? new Date(f).toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '—';

const Mantenimiento = () => {
  const [mantenimientos, setMantenimientos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editandoId, setEditandoId] = useState(null);
  const [modalMant, setModalMant] = useState(false);
  const [modalDisp, setModalDisp] = useState(false);
  const [disponibilidadForm, setDisponibilidadForm] = useState({ equipoId: '', disponible: 'true' });
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarMantenimientos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarMantenimientos();
      setMantenimientos(Array.isArray(data) ? data : []);
    } catch {
      setError('Error al cargar los mantenimientos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarMantenimientos(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const abrirNuevo = () => {
    setForm(emptyForm);
    setEditandoId(null);
    setModalMant(true);
    setMensaje('');
    setError('');
  };

  const abrirEditar = (m) => {
    setForm({
      descripcion: m.descripcion || '',
      equipoId: m.equipoId || '',
      tecnico: m.tecnico || '',
      fechaInicio: m.fechaInicio ? m.fechaInicio.substring(0, 10) : '',
      fechaFin: m.fechaFin ? m.fechaFin.substring(0, 10) : '',
      estado: m.estado || 'PENDIENTE',
    });
    setEditandoId(m.id);
    setModalMant(true);
    setMensaje('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      const payload = { ...form, equipoId: Number(form.equipoId) };
      if (editandoId) {
        await actualizarMantenimiento(editandoId, payload);
        setMensaje('Mantenimiento actualizado correctamente.');
      } else {
        await crearMantenimiento(payload);
        setMensaje('Mantenimiento registrado correctamente.');
      }
      setModalMant(false);
      cargarMantenimientos();
    } catch {
      setError('Error al guardar el mantenimiento.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar este registro de mantenimiento?')) return;
    setError('');
    setMensaje('');
    try {
      await eliminarMantenimiento(id);
      setMensaje('Registro eliminado correctamente.');
      cargarMantenimientos();
    } catch {
      setError('Error al eliminar el registro.');
    }
  };

  const handleDisponibilidad = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      const disponible = disponibilidadForm.disponible === 'true' || disponibilidadForm.disponible === true;
      await modificarDisponibilidad(Number(disponibilidadForm.equipoId), disponible);
      setMensaje(`Disponibilidad del equipo #${disponibilidadForm.equipoId} actualizada correctamente.`);
      setModalDisp(false);
      setDisponibilidadForm({ equipoId: '', disponible: 'true' });
    } catch {
      setError('Error al modificar la disponibilidad del equipo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Mantenimiento</h1>
          <p>Gestión de mantenimientos y disponibilidad de equipos</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary" onClick={() => { setModalDisp(true); setMensaje(''); setError(''); }}>
            <ToggleLeft size={15} />
            Disponibilidad
          </button>
          <button className="btn btn-primary" onClick={abrirNuevo}>
            <Plus size={15} />
            Nuevo Mantenimiento
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
        {loading ? (
          <p className="loading-text">Cargando mantenimientos...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Equipo</th>
                <th>Descripción</th>
                <th>Técnico</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mantenimientos.length === 0 ? (
                <tr>
                  <td colSpan="8" className="empty-row">
                    <Wrench size={32} style={{ display: 'block', margin: '0 auto 0.5rem', opacity: 0.3 }} />
                    No hay registros de mantenimiento
                  </td>
                </tr>
              ) : (
                mantenimientos.map((m) => (
                  <tr key={m.id}>
                    <td style={{ color: '#64748b', fontWeight: 500 }}>#{m.id}</td>
                    <td style={{ fontWeight: 600 }}>#{m.equipoId}</td>
                    <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.descripcion}
                    </td>
                    <td>{m.tecnico || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                    <td>{formatFecha(m.fechaInicio)}</td>
                    <td>{formatFecha(m.fechaFin)}</td>
                    <td>
                      <Badge variant={estadoBadgeVariant(m.estado)}>
                        {m.estado?.replace(/_/g, ' ') || '—'}
                      </Badge>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-sm btn-secondary" onClick={() => abrirEditar(m)}>
                          <Pencil size={13} />
                          Editar
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(m.id)}>
                          <Trash2 size={13} />
                          Eliminar
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

      {/* Modal Mantenimiento */}
      <Modal
        isOpen={modalMant}
        onClose={() => setModalMant(false)}
        title={editandoId ? 'Editar Registro de Mantenimiento' : 'Nuevo Mantenimiento'}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setModalMant(false)}>
              Cancelar
            </button>
            <button type="submit" form="form-mant" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Registrar mantenimiento'}
            </button>
          </>
        }
      >
        <form id="form-mant" onSubmit={handleSubmit} className="grid-form">
          <div className="form-group">
            <label>ID del Equipo *</label>
            <input name="equipoId" type="number" min="1" value={form.equipoId} onChange={handleChange} placeholder="Ej: 3" required />
          </div>
          <div className="form-group">
            <label>Técnico Responsable</label>
            <input name="tecnico" value={form.tecnico} onChange={handleChange} placeholder="Nombre del técnico" />
          </div>
          <div className="form-group form-group--full">
            <label>Descripción *</label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción del mantenimiento realizado o a realizar..."
              rows={3}
              required
            />
          </div>
          <div className="form-group">
            <label>Fecha de Inicio</label>
            <input name="fechaInicio" type="date" value={form.fechaInicio} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Fecha de Fin</label>
            <input name="fechaFin" type="date" value={form.fechaFin} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange}>
              {ESTADOS_MANT.map((e) => <option key={e} value={e}>{e.replace(/_/g, ' ')}</option>)}
            </select>
          </div>
        </form>
      </Modal>

      {/* Modal Disponibilidad */}
      <Modal
        isOpen={modalDisp}
        onClose={() => setModalDisp(false)}
        title="Modificar Disponibilidad de Equipo"
        maxWidth="420px"
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={() => setModalDisp(false)}>
              Cancelar
            </button>
            <button type="submit" form="form-disp" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Actualizando...' : 'Actualizar disponibilidad'}
            </button>
          </>
        }
      >
        <form id="form-disp" onSubmit={handleDisponibilidad} className="grid-form">
          <div className="form-group">
            <label>ID del Equipo *</label>
            <input
              type="number"
              min="1"
              value={disponibilidadForm.equipoId}
              onChange={(e) => setDisponibilidadForm({ ...disponibilidadForm, equipoId: e.target.value })}
              placeholder="Ej: 5"
              required
            />
          </div>
          <div className="form-group">
            <label>Nueva Disponibilidad</label>
            <select
              value={disponibilidadForm.disponible}
              onChange={(e) => setDisponibilidadForm({ ...disponibilidadForm, disponible: e.target.value })}
            >
              <option value="true">Disponible</option>
              <option value="false">No Disponible</option>
            </select>
          </div>
          <div className="form-group--full" style={{ color: '#64748b', fontSize: '0.82rem' }}>
            Esta acción actualizará el estado de disponibilidad del equipo en el microservicio de equipos.
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Mantenimiento;
