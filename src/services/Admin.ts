import apiService from './ApiServices';

const base = '/api/admin';

export const analysis = () => {
  return apiService.get(`${base}/analysis`);
};
