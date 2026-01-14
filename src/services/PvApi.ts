import apiService from './ApiServices';

const base = '/api/pv';

export const allPvs = () => {
  return apiService.get(base);
};

export const getPv = (id: string) => {
  return apiService.get(`${base}/${id}`);
};

export const addPv = (office: object) => {
  return apiService.post(base, office);
};

export const updatePv = (id: string, office: object) => {
  return apiService.put(`${base}/${id}`, office);
};

export const deletePv = (id: string) => {
  return apiService.delete(`${base}/${id}`);
};
