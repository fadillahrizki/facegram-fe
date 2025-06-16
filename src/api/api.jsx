import axios from 'axios';

const token = localStorage.getItem('token');

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    Authorization: token ? `Bearer ${token}` : ''
  }
});

export default api;
