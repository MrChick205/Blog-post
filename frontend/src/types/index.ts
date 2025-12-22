export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  image?: string | null;
  user_id: string;
  username: string;
  email: string;
  user_avatar?: string | null;
  created_at: string;
  updated_at: string;
  comment_count: string;
  like_count: string;
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  username: string;
  user_avatar?: string | null;
  created_at: string;
}
