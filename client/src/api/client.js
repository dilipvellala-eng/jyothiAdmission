import axios from 'axios';

export const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:5000/api')+'/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admission_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
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

  return response.data.fileUrl;
};
