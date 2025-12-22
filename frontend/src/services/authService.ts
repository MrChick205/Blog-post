import axios from '../config/axios';

export const loginApi = (email: string, password: string) =>
  axios.post('/users/login', { email, password });

export const registerApi = (data: {
  username: string;
  email: string;
  password: string;
}) => axios.post('/users/register', data);

export const getMeApi = () =>
  axios.get('/users/profile/me');
