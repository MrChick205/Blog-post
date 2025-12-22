import axios from '../config/axios';

export const getCommentsByPost = (postId: string) =>
  axios.get(`/comments/post/${postId}`);

export const createComment = (data: {
  post_id: string;
  content: string;
}) => axios.post('/comments', data);
