export interface Register{
    email:string;
    name:string;
    password:string;
    password_confirmation:string;
  }
  export interface Login{
    email:string;
    password:string;
  }

  export interface User {
    id: number;
    name: string;
  }
  export interface last_comment{
    id: number;
    content: string;
    created_at: string;
    created_at_readable: string;
    User:User;
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
    comments: any[];
    comments_count:number; // Adjust this type based on the structure of your comments
    image:string;
    image_thumb:string;
    last_comment:last_comment;
  }
  

export interface PostArticle {
  title: string;
  content: string;

}
export interface Comment {
  content:string;
  user:User;
}


export type Post = {
  title: string;
  content: string;
  user: { name: string };
  created_at: string;
  comments: { content: string; user: { name: string }; id: number }[];
};
