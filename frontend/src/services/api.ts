const API_URL = 'https://agri-mitra-backend.onrender.com';

export const apiUrl = (path: string) => {
  return `${API_URL}${path}`;
};