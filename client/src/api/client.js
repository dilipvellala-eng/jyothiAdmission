import axios from 'axios';

const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const baseURL = apiBaseUrl.endsWith('/api') ? apiBaseUrl : `${apiBaseUrl}/api`;

export const api = axios.create({
  baseURL
});

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('admission_token') || localStorage.getItem('admission_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      sessionStorage.removeItem('admission_token');
      sessionStorage.removeItem('admission_user');
      localStorage.removeItem('admission_token');
      localStorage.removeItem('admission_user');
    }
    return Promise.reject(error);
  }
);

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });

  return { ...response.data.file, signedUrl: response.data.signedUrl };
};
