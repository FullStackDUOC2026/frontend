import axios from 'axios';
import { getToken } from './authService';

const BASE_URL = process.env.REACT_APP_MS_HISTORIAL_URL;

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const historialPorEmpleado = async (empleadoId) => {
  const response = await axios.get(`${BASE_URL}/historial/empleado/${empleadoId}`, authHeaders());
  return response.data;
};

export const historialPorEquipo = async (equipoId) => {
  const response = await axios.get(`${BASE_URL}/historial/equipo/${equipoId}`, authHeaders());
  return response.data;
};
