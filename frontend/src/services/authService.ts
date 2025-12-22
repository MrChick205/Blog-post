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

export const updateProfileApi = (data: { username?: string; email?: string; avatar?: string }) =>
  axios.put('/users/profile/me', data);

export const uploadAvatarApi = (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  return axios.post('/users/upload-avatar', formData);
};