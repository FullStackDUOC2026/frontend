import axios from 'axios';
import { getToken } from './authService';

const BASE_URL = process.env.REACT_APP_MS_GESTION_URL;

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const asignarEquipo = async (asignacion) => {
  // asignacion: { empleadoId, equipoId }
  const response = await axios.post(`${BASE_URL}/gestion/asignar`, asignacion, authHeaders());
  return response.data;
};

export const consultarEmpleadosConEquipos = async () => {
  const response = await axios.get(`${BASE_URL}/gestion/asignaciones`, authHeaders());
  return response.data;
};

export const consultarEquiposPorEmpleado = async (empleadoId) => {
  const response = await axios.get(`${BASE_URL}/gestion/asignaciones/empleado/${empleadoId}`, authHeaders());
  return response.data;
};

export const registrarDevolucion = async (asignacionId) => {
  const response = await axios.put(`${BASE_URL}/gestion/devolucion/${asignacionId}`, {}, authHeaders());
  return response.data;
};
