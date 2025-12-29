import axios from '../config/axios';

export const getAllPosts = () => axios.get('/posts');

export const getPostById = (id: string) =>
  axios.get(`/posts/${id}`);

export const createPost = (data: FormData) =>
  axios.post('/posts', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const updatePost = (id: string, data: FormData) =>
  axios.put(`/posts/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

export const deletePost = (id: string) =>
  axios.delete(`/posts/${id}`);
