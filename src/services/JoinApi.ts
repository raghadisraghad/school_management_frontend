import apiService from './ApiServices';

const base = '/api/join';

export const allJoins = () => {
  return apiService.get(base);
};

export const getJoin = (id: string) => {
  return apiService.get(`${base}/${id}`);
};

export const getJoinsOffice = (id: string) => {
  return apiService.get(`${base}/office/${id}`);
};

export const addJoin = (Join: object) => {
  return apiService.post(base, Join);
};

export const updateJoin = (id: string, Join: object) => {
  return apiService.put(`${base}/${id}`, Join);
};

export const deleteJoin = (id: string) => {
  return apiService.delete(`${base}/${id}`);
};
