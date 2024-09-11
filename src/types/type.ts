export interface Register {
  email: string;
  name: string;
  password: string;
  password_confirmation: string;
}

export interface Login {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
}

export interface LastComment {
  id: number;
  content: string;
  created_at: string;
  created_at_readable: string;
  user: User;
}

export interface Like {
  id: number;
  name: string;
}

export interface PostList {
  id: number;
  title: string;
  slug: string;
  content: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  user: User; // Associated user (author) of the post
  comments: Comment[];
  comments_count: number;
  image: string;
  image_thumb: string;
  last_comment: LastComment;
  likes_count: number;
  liked_by_user: boolean;
  likes: Like[];
}

export interface PostArticle {
  title: string;
  content: string;
}
export interface children{
id:number;
content:string;
created_at:string;
created_at_readable: string;
user:User;
children:children[];
}

export interface Comment {
  id: number;
  content: string;
  user: User;
  created_at: string;
  created_at_readable: string;
  children:Comment[];
}

export type Post = {
  title: string;
  content: string;
  user: { name: string };
  created_at: string;
  comments: { content: string; user: { name: string }; id: number }[];
};
