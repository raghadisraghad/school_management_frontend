import apiService from './ApiServices';

const base = '/api/auth';

export const login = (credentials: object) => {
  return apiService.post(`${base}/login`, credentials);
};

export const register = (register: object) => {
  return apiService.post(`${base}/register`, register)
};

export const logout = () => {
  return apiService.post(`${base}/logout`)
    .then(() => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    })
    .catch((error) => {
      console.error('Error during logout:', error);
    });
};

export const verifyEmail = (token: string) => {
  return apiService.post(`${base}/verifyEmail/${token}`);
};

export const verifyOffice = (id: string) => {
  return apiService.post(`${base}/verifyOffice/${id}`);
};

export const forgotPassword = (email: string) => {
  return apiService.post(`${base}/resetPassword`, {email});
};
