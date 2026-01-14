import apiService from './ApiServices';

const base = '/api/contact';

export const allContacts = () => {
  return apiService.get(base);
};

export const updateContact = (id: string, Contact: object) => {
  return apiService.put(`${base}/${id}`, Contact);
};

export const getContact = (id: string) => {
  return apiService.get(`${base}/${id}`);
};

export const addContact = (Contact: object) => {
  return apiService.post(base, Contact);
};

export const deleteContact = (id: string) => {
  return apiService.get(`${base}/${id}`);
};
