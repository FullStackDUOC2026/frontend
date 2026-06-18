import axios from 'axios';

const BASE_URL = process.env.REACT_APP_MS_AUTH_URL;

export const login = async (username, password) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, { username, password });
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('username');
};

export const getToken = () => localStorage.getItem('token');

export const isAuthenticated = () => !!getToken();
