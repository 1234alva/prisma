import axios from 'axios';

const jh7Api = axios.create({
  // Esto lee automáticamente el puerto 3000 del archivo .env
  baseURL: import.meta.env.VITE_API_URL, 
});

// El interceptor se encarga de que ninguna función falle por falta de token
jh7Api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.access_token) {
    config.headers.Authorization = `Bearer ${user.access_token}`;
  }
  return config;
});

export default jh7Api;