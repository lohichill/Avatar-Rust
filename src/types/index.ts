export interface User {
  id: string;
  username: string;
  email: string;
  avatar_url: string | null;
  level: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user?: User;
  likes_count?: number;
  comments_count?: number;
}
