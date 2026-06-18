import axios from 'axios';
import { getToken } from './authService';

const BASE_URL = process.env.REACT_APP_MS_MANTENIMIENTO_URL;

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const listarMantenimientos = async () => {
  const response = await axios.get(`${BASE_URL}/mantenimientos`, authHeaders());
  return response.data;
};

export const obtenerMantenimientoPorId = async (id) => {
  const response = await axios.get(`${BASE_URL}/mantenimientos/${id}`, authHeaders());
  return response.data;
};

export const crearMantenimiento = async (mantenimiento) => {
  const response = await axios.post(`${BASE_URL}/mantenimientos`, mantenimiento, authHeaders());
  return response.data;
};

export const actualizarMantenimiento = async (id, mantenimiento) => {
  const response = await axios.put(`${BASE_URL}/mantenimientos/${id}`, mantenimiento, authHeaders());
  return response.data;
};

export const eliminarMantenimiento = async (id) => {
  const response = await axios.delete(`${BASE_URL}/mantenimientos/${id}`, authHeaders());
  return response.data;
};

export const modificarDisponibilidad = async (equipoId, disponible) => {
  const response = await axios.patch(
    `${BASE_URL}/mantenimientos/disponibilidad/${equipoId}`,
    { disponible },
    authHeaders()
  );
  return response.data;
};
