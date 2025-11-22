import axios from 'axios';

// Use the same API base URL as configured in the environment
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.iwacu250.com';

export const uploadFile = async (file, type = 'image') => {
  const formData = new FormData();
  formData.append('file', file);
  
  const endpoint = type === 'video' 
    ? '/api/admin/files/upload/video' 
    : '/api/admin/files/upload/image';
  
  const response = await axios.post(`${API_BASE_URL}${endpoint}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const fetchAllFiles = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/files/list`);
  return response.data;
};

export const deleteFile = async (filePath) => {
  await axios.delete(`${API_BASE_URL}/api/admin/files`, {
    params: { filePath }
  });
};
