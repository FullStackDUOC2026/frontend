import axios from 'axios';
import { getToken } from './authService';

const BASE_URL = process.env.REACT_APP_MS_EQUIPO_URL;

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

export const listarEquipos = async () => {
  const response = await axios.get(`${BASE_URL}/equipos`, authHeaders());
  return response.data;
};

export const obtenerEquipoPorId = async (id) => {
  const response = await axios.get(`${BASE_URL}/equipos/${id}`, authHeaders());
  return response.data;
};

export const crearEquipo = async (equipo) => {
  const response = await axios.post(`${BASE_URL}/equipos`, equipo, authHeaders());
  return response.data;
};

export const actualizarEquipo = async (id, equipo) => {
  const response = await axios.put(`${BASE_URL}/equipos/${id}`, equipo, authHeaders());
  return response.data;
};

export const eliminarEquipo = async (id) => {
  const response = await axios.delete(`${BASE_URL}/equipos/${id}`, authHeaders());
  return response.data;
};
