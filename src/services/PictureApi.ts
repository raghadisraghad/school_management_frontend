import apiService from './ApiServices';

const base = '/api/picture';

export const uploadAvatar = (id: string, formData: FormData) => {
  return apiService.post(`${base}/upload-avatar/${id}`, formData);
};

export const uploadOfficeBackground = (id: string, formData: FormData) => {
  return apiService.post(`${base}/upload-office/${id}`, formData);
};

export const uploadOfficeImage = (id: string, formData: FormData) => {
  return apiService.post(`${base}/upload-office-image/${id}`, formData);
};

export const uploadPvOffice = (id: string, formData: FormData) => {
  return apiService.post(`${base}/upload-office-pv/${id}`, formData);
};

export const uploadPvAdmin = (id: string, formData: FormData) => {
  return apiService.post(`${base}/upload-pv/${id}`, formData);
};
