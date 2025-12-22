import axios from '../config/axios';

export const getLikeCount = (postId: string) =>
  axios.get(`/likes/post/${postId}/count`);

export const getLikeStatus = (postId: string) =>
  axios.get(`/likes/post/${postId}/status`);

export const toggleLike = (postId: string) =>
  axios.post('/likes/toggle', { post_id: postId });
