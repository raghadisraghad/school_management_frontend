import apiService from './ApiServices';

const base = '/api/user';

export const allUsers = () => {
  return apiService.get(base);
};

export const getUser = (id: string) => {
  return apiService.get(`${base}/${id}`);
};

export const checkUsername = (username: string) => {
  return apiService.get(`${base}/username/${username}`);
};

export const checkUsernameExistsOnce = (username: string, id: string) => {
  return apiService.get(`${base}/username/${username}/${id}`);
};

export const addUser = (User: object) => {
  return apiService.post(base, User);
};

export const updateUser = (id: string, User: object) => {
  return apiService.put(`${base}/${id}`, User);
};

export const resetUserPassword = (id: string, password: object) => {
  return apiService.put(`${base}/password/${id}`, password);
};

export const deleteUser = (id: string, password: string) => {
  return apiService.delete(`${base}/${id}`, { data: { password } });
};
