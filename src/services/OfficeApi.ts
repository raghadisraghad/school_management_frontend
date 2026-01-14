import apiService from './ApiServices';

const base = '/api/office';

export const allOffices = () => {
  return apiService.get(base);
};

export const getOffice = (id: string) => {
  return apiService.get(`${base}/${id}`);
};

export const checkOfficeName = (name: string) => {
  return apiService.get(`${base}/name/${name}`);
};

export const addOffice = (office: object) => {
  return apiService.post(base, office);
};

export const updateOffice = (id: string, office: object) => {
  return apiService.put(`${base}/${id}`, office);
};

export const resetOfficePassword = (id: string, password: object) => {
  return apiService.put(`${base}/password/${id}`, password);
};

export const deleteOffice = (id: string) => {
  return apiService.delete(`${base}/${id}`);
};
