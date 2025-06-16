import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  }
});

export default api;
