import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Monitor, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';
import Badge from '../components/Badge';
import {
  listarEquipos,
  crearEquipo,
  actualizarEquipo,
  eliminarEquipo,
} from '../services/equipoService';

const emptyForm = { nombre: '', tipo: '', marca: '', modelo: '', numeroSerie: '', estado: 'DISPONIBLE' };

const TIPOS = ['Notebook', 'Monitor', 'Teclado', 'Mouse', 'Impresora', 'Tablet', 'Teléfono', 'Servidor', 'Otro'];
const ESTADOS = ['DISPONIBLE', 'ASIGNADO', 'EN_MANTENIMIENTO', 'DADO_DE_BAJA'];

const estadoBadgeVariant = (estado) => {
  switch (estado) {
    case 'DISPONIBLE':      return 'success';
    case 'ASIGNADO':        return 'info';
    case 'EN_MANTENIMIENTO': return 'warning';
    case 'DADO_DE_BAJA':   return 'danger';
    default:                return 'neutral';
  }
};

const estadoLabel = (estado) => estado?.replace(/_/g, ' ') || '—';

const Equipos = () => {
  const [equipos, setEquipos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editandoId, setEditandoId] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarEquipos = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarEquipos();
      setEquipos(data);
    } catch {
      setError('Error al cargar los equipos.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarEquipos(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const abrirNuevo = () => {
    setForm(emptyForm);
    setEditandoId(null);
    setModalAbierto(true);
    setMensaje('');
    setError('');
  };

  const abrirEditar = (eq) => {
    setForm({
      nombre: eq.nombre || '',
      tipo: eq.tipo || '',
      marca: eq.marca || '',
      modelo: eq.modelo || '',
      numeroSerie: eq.numeroSerie || '',
      estado: eq.estado || 'DISPONIBLE',
    });
    setEditandoId(eq.id);
    setModalAbierto(true);
    setMensaje('');
    setError('');
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setForm(emptyForm);
    setEditandoId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setGuardando(true);
    try {
      if (editandoId) {
        await actualizarEquipo(editandoId, form);
        setMensaje('Equipo actualizado correctamente.');
      } else {
        await crearEquipo(form);
        setMensaje('Equipo registrado correctamente.');
      }
      cerrarModal();
      cargarEquipos();
    } catch {
      setError('Error al guardar el equipo.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar este equipo? Esta acción no se puede deshacer.')) return;
    setError('');
    setMensaje('');
    try {
      await eliminarEquipo(id);
      setMensaje('Equipo eliminado correctamente.');
      cargarEquipos();
    } catch {
      setError('Error al eliminar el equipo.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Equipos Tecnológicos</h1>
          <p>Inventario de activos tecnológicos</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={abrirNuevo}>
            <Plus size={15} />
            Nuevo Equipo
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
          <p className="loading-text">Cargando equipos...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Tipo</th>
                <th>Marca / Modelo</th>
                <th>N° Serie</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {equipos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="empty-row">
                    <Monitor size={32} style={{ display: 'block', margin: '0 auto 0.5rem', opacity: 0.3 }} />
                    No hay equipos registrados
                  </td>
                </tr>
              ) : (
                equipos.map((eq) => (
                  <tr key={eq.id}>
                    <td style={{ color: '#64748b', fontWeight: 500 }}>#{eq.id}</td>
                    <td style={{ fontWeight: 600 }}>{eq.nombre}</td>
                    <td>{eq.tipo || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                    <td>
                      {eq.marca || eq.modelo
                        ? <>{eq.marca}<span style={{ color: '#94a3b8' }}>{eq.marca && eq.modelo ? ' / ' : ''}</span>{eq.modelo}</>
                        : <span style={{ color: '#94a3b8' }}>—</span>
                      }
                    </td>
                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>
                      {eq.numeroSerie || <span style={{ color: '#94a3b8', fontFamily: 'inherit' }}>—</span>}
                    </td>
                    <td>
                      <Badge variant={estadoBadgeVariant(eq.estado)}>
                        {estadoLabel(eq.estado)}
                      </Badge>
                    </td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-sm btn-secondary" onClick={() => abrirEditar(eq)}>
                          <Pencil size={13} />
                          Editar
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(eq.id)}>
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

      <Modal
        isOpen={modalAbierto}
        onClose={cerrarModal}
        title={editandoId ? 'Editar Equipo' : 'Registrar Nuevo Equipo'}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
              Cancelar
            </button>
            <button type="submit" form="form-equipo" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Registrar equipo'}
            </button>
          </>
        }
      >
        <form id="form-equipo" onSubmit={handleSubmit} className="grid-form">
          <div className="form-group">
            <label>Nombre *</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Ej: Laptop Dell Latitude" required />
          </div>
          <div className="form-group">
            <label>Tipo *</label>
            <select name="tipo" value={form.tipo} onChange={handleChange} required>
              <option value="">Seleccione un tipo</option>
              {TIPOS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Marca</label>
            <input name="marca" value={form.marca} onChange={handleChange} placeholder="Ej: Dell, HP, Lenovo" />
          </div>
          <div className="form-group">
            <label>Modelo</label>
            <input name="modelo" value={form.modelo} onChange={handleChange} placeholder="Ej: Latitude 5520" />
          </div>
          <div className="form-group">
            <label>Número de Serie</label>
            <input name="numeroSerie" value={form.numeroSerie} onChange={handleChange} placeholder="Número de serie" />
          </div>
          <div className="form-group">
            <label>Estado</label>
            <select name="estado" value={form.estado} onChange={handleChange}>
              {ESTADOS.map((e) => <option key={e} value={e}>{estadoLabel(e)}</option>)}
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Equipos;
