import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Users, CheckCircle2, AlertCircle } from 'lucide-react';
import Modal from '../components/Modal';
import {
  listarEmpleados,
  crearEmpleado,
  actualizarEmpleado,
  eliminarEmpleado,
} from '../services/empleadoService';

const emptyForm = { nombre: '', apellido: '', cargo: '', departamento: '', email: '' };

const Empleados = () => {
  const [empleados, setEmpleados] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editandoId, setEditandoId] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');

  const cargarEmpleados = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listarEmpleados();
      setEmpleados(data);
    } catch {
      setError('Error al cargar los empleados.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarEmpleados(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const abrirNuevo = () => {
    setForm(emptyForm);
    setEditandoId(null);
    setModalAbierto(true);
    setMensaje('');
    setError('');
  };

  const abrirEditar = (emp) => {
    setForm({
      nombre: emp.nombre || '',
      apellido: emp.apellido || '',
      cargo: emp.cargo || '',
      departamento: emp.departamento || '',
      email: emp.email || '',
    });
    setEditandoId(emp.id);
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
        await actualizarEmpleado(editandoId, form);
        setMensaje('Empleado actualizado correctamente.');
      } else {
        await crearEmpleado(form);
        setMensaje('Empleado registrado correctamente.');
      }
      cerrarModal();
      cargarEmpleados();
    } catch {
      setError('Error al guardar el empleado. Verifique los datos e intente nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Está seguro que desea eliminar este empleado? Esta acción no se puede deshacer.')) return;
    setError('');
    setMensaje('');
    try {
      await eliminarEmpleado(id);
      setMensaje('Empleado eliminado correctamente.');
      cargarEmpleados();
    } catch {
      setError('Error al eliminar el empleado.');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header-left">
          <h1>Empleados</h1>
          <p>Gestión del personal de la empresa</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={abrirNuevo}>
            <Plus size={15} />
            Nuevo Empleado
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
          <p className="loading-text">Cargando empleados...</p>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre completo</th>
                <th>Cargo</th>
                <th>Departamento</th>
                <th>Email</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {empleados.length === 0 ? (
                <tr>
                  <td colSpan="6" className="empty-row">
                    <Users size={32} style={{ display: 'block', margin: '0 auto 0.5rem', opacity: 0.3 }} />
                    No hay empleados registrados
                  </td>
                </tr>
              ) : (
                empleados.map((emp) => (
                  <tr key={emp.id}>
                    <td style={{ color: '#64748b', fontWeight: 500 }}>#{emp.id}</td>
                    <td style={{ fontWeight: 600 }}>{emp.nombre} {emp.apellido}</td>
                    <td>{emp.cargo || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                    <td>{emp.departamento || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                    <td style={{ color: '#2563eb' }}>{emp.email || <span style={{ color: '#94a3b8' }}>—</span>}</td>
                    <td>
                      <div className="actions-cell">
                        <button className="btn btn-sm btn-secondary" onClick={() => abrirEditar(emp)} title="Editar">
                          <Pencil size={13} />
                          Editar
                        </button>
                        <button className="btn btn-sm btn-danger" onClick={() => handleEliminar(emp.id)} title="Eliminar">
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
        title={editandoId ? 'Editar Empleado' : 'Registrar Nuevo Empleado'}
        footer={
          <>
            <button type="button" className="btn btn-secondary" onClick={cerrarModal}>
              Cancelar
            </button>
            <button type="submit" form="form-empleado" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : editandoId ? 'Guardar cambios' : 'Registrar empleado'}
            </button>
          </>
        }
      >
        <form id="form-empleado" onSubmit={handleSubmit} className="grid-form">
          <div className="form-group">
            <label>Nombre *</label>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
          </div>
          <div className="form-group">
            <label>Apellido *</label>
            <input name="apellido" value={form.apellido} onChange={handleChange} placeholder="Apellido" required />
          </div>
          <div className="form-group">
            <label>Cargo</label>
            <input name="cargo" value={form.cargo} onChange={handleChange} placeholder="Ej: Desarrollador Senior" />
          </div>
          <div className="form-group">
            <label>Departamento</label>
            <input name="departamento" value={form.departamento} onChange={handleChange} placeholder="Ej: Tecnología" />
          </div>
          <div className="form-group form-group--full">
            <label>Correo electrónico</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="correo@empresa.cl" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Empleados;
