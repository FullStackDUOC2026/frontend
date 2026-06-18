import axios from 'axios';
import { getToken } from './authService';

const BASE_URL = process.env.REACT_APP_MS_EMPLEADO_URL;

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const listarEmpleados = async () => {
  const response = await axios.get(`${BASE_URL}/empleados`, authHeaders());
  return response.data;
};

export const obtenerEmpleadoPorId = async (id) => {
  const response = await axios.get(`${BASE_URL}/empleados/${id}`, authHeaders());
  return response.data;
};

export const crearEmpleado = async (empleado) => {
  const response = await axios.post(`${BASE_URL}/empleados`, empleado, authHeaders());
  return response.data;
};

export const actualizarEmpleado = async (id, empleado) => {
  const response = await axios.put(`${BASE_URL}/empleados/${id}`, empleado, authHeaders());
  return response.data;
};

export const eliminarEmpleado = async (id) => {
  const response = await axios.delete(`${BASE_URL}/empleados/${id}`, authHeaders());
  return response.data;
};
