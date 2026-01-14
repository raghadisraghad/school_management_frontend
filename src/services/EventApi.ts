import apiService from './ApiServices';

const base = '/api/event';

export const allEvents = () => {
  return apiService.get(base);
};

export const allOfficeEvents = (id: string) => {
  return apiService.get(`${base}/office/${id}`);
};

export const getEvent = (id: string) => {
  return apiService.get(`${base}/${id}`);
};

export const addEvent = (Event: object) => {
  return apiService.post(base, Event);
};

export const updateEvent = (id: string, Event: object) => {
  return apiService.put(`${base}/${id}`, Event);
};

export const deleteEvent = (id: string) => {
  return apiService.delete(`${base}/${id}`);
};
