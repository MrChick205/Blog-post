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
  created_at: string;
  updated_at: string;
  // Các field join từ BE
  username?: string;
  email?: string;
  user_avatar?: string | null;
  comment_count?: number;
  like_count?: number;
}

export interface Comment {
  id: string;
  content: string;
  user_id: string;
  post_id: string;
  created_at: string;
  // Các field join từ BE
  username?: string;
  email?: string;
  user_avatar?: string | null;
}


