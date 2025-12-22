import axios from '../config/axios';

export const getAllPosts = () => axios.get('/posts');

export const getPostById = (id: string) =>
  axios.get(`/posts/${id}`);

export const createPost = (data: {
  title: string;
  content: string;
  image?: string;
}) => axios.post('/posts', data);

export const updatePost = (
  id: string,
  data: {
    title: string;
    content: string;
    image?: string;
  }
) => axios.put(`/posts/${id}`, data);

export const deletePost = (id: string) =>
  axios.delete(`/posts/${id}`);
