// utils/likeUtils.ts
import axios from 'axios';

const VITE_API_URL = import.meta.env.VITE_API_URL;

export const toggleLike = async (post: { slug: string; liked_by_user: boolean; likes_count: number }) => {
  if (post) {
    try {
      await axios.post(`${VITE_API_URL}/posts/like/${post.slug}`);
      // Toggle liked_by_user and update likes_count based on the current state
      if (post.liked_by_user) {
        post.liked_by_user = false;
        post.likes_count -= 1;
      } else {
        post.liked_by_user = true;
        post.likes_count += 1;
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }
};
