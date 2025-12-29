import axios from '../config/axios';
import { User } from '../types';
export const loginApi = (email: string, password: string) =>
  axios.post('/users/login', { email, password });

export const registerApi = (data: {
  username: string;
  email: string;
  password: string;
}) => axios.post('/users/register', data);

export const getMeApi = () =>
  axios.get('/users/profile/me');

export const updateProfileApi = (data: FormData) =>
  axios.put('/users/profile/me', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

