<!-- <template>
    <div class="comment-container">
      <!-- Main Comment -->
      <div class="comment">
        <!-- Edit Comment Form -->
        <div v-if="commentBeingEdited === comment.id">
          <input v-model="editCommentContent" type="text" class="edit-comment-input" />
          <button @click="saveCommentEdit(comment.id)" class="save-button">Save</button>
          <button @click="cancelCommentEdit" class="cancel-button">Cancel</button>
        </div>
        <div v-else>
          <p>{{ comment.content }}</p>
          <small>{{ comment.user.name }} - {{ comment.created_at_readable }}</small>
  
          <!-- Comment Actions: Edit/Delete -->
          <div class="comment-actions" v-if="isCommentOwner(comment.user.id)">
            <button @click="editComment(comment.id, comment.content)">Edit</button>
            <button @click="deleteComment(comment.id)">Delete</button>
          </div>
  
          <!-- Reply Button -->
          <div v-if="isAuthenticated">
            <button @click="toggleReplyForm(comment.id)">Reply</button>
          </div>
  
          <!-- Reply Form -->
          <div v-if="isReplyingToComment === comment.id" class="reply-form">
            <textarea v-model="replyContent" placeholder="Reply to this comment"></textarea>
            <button @click="replyToComment(comment.id)">Submit</button>
            <button @click="isReplyingToComment = null">Cancel</button>
          </div>
  
          <!-- Recursive Replies -->
          <div class="replies" v-if="comment.children.length">
            <RecursiveComment
            v-for="(reply, index) in comment.children"
            :key="index"
            :comment="reply"
            :post="post"
          />
          
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
 import axios from 'axios';
  import { user,isAuthenticated } from '@/auth';
import type { PostList } from '@/types/type';
const post = ref<PostList | null>(null);

  const VITE_API_URL = 'https://interns-blog.nafistech.com/api';
  
  const commentBeingEdited = ref<number | null>(null);
  const editCommentContent = ref('');
  const isReplyingToComment = ref<number | null>(null);
  const replyContent = ref('');
  
const props = defineProps<{ comment: Comment, post: PostList }>();
const emit = defineEmits(['edit-comment', 'delete-comment', 'reply-to-comment', 'toggle-reply-form']);

  interface Comment {
    id: number;
    content: string;
    user: { id: number; name: string };
    created_at_readable: string;
    children: Comment[];
  }
  
  
  const toggleReplyForm = (commentId: number) => {
    isReplyingToComment.value = isReplyingToComment.value === commentId ? null : commentId;
  };
  
  const replyToComment = async (parentId: number) => {
    if (post.value && replyContent.value.trim()) {
      try {
        await axios.post(`${VITE_API_URL}/posts/${post.value.slug}/comments`, {
          content: replyContent.value,
          parent_id: parentId,
        });
        replyContent.value = '';
        isReplyingToComment.value = null;
      } catch (error) {
        console.error('Error adding reply:', error);
      }
    }
  };
  
  const editComment = (commentId: number, currentContent: string) => {
    commentBeingEdited.value = commentId;
    editCommentContent.value = currentContent;
  };
  
  const saveCommentEdit = async (commentId: number) => {
    if (editCommentContent.value.trim()) {
      try {
        await axios.patch(`${VITE_API_URL}/posts/${post.value?.slug}/comments/${commentId}`, {
          content: editCommentContent.value,
        });
        commentBeingEdited.value = null;
        editCommentContent.value = ''; // Reset after editing
      } catch (error) {
        console.error('Error editing comment:', error);
      }
    }
  };
  
  const cancelCommentEdit = () => {
    commentBeingEdited.value = null;
    editCommentContent.value = '';
  };
  
  const deleteComment = async (commentId: number) => {
    try {
      await axios.delete(`${VITE_API_URL}/posts/${post.value?.slug}/comments/${commentId}`);
      if (post.value) post.value.comments = post.value.comments.filter((comment) => comment.id !== commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete the comment. Please try again.');
    }
  };
  
  const isCommentOwner = (commentUserId: number) => {
    return user.value && commentUserId === user.value.id;
  };
  const emitEditComment = (commentId: number, currentContent: string) => {
  emit('edit-comment', commentId, currentContent);
};

const emitDeleteComment = (commentId: number) => {
  emit('delete-comment', commentId);
};

const emitReplyToComment = (parentId: number) => {
  if (replyContent.value.trim()) {
    emit('reply-to-comment', parentId, replyContent.value);
    replyContent.value = '';
    isReplyingToComment.value = null;
  }
};

const emitToggleReplyForm = (commentId: number) => {
  emit('toggle-reply-form', commentId);
};
const findCommentById = (comments: Comment[], commentId: number): Comment | undefined => {
  for (const comment of comments) {
    if (comment.id === commentId) return comment;
    const found = findCommentById(comment.children, commentId);
    if (found) return found;
  }
  return undefined;
};


  </script>
  
  <style scoped>
  /* Container for the entire post details page */
  .post-details-container {
    margin-top: 50px;
    padding: 20px;
    background: linear-gradient(135deg, #f4f1ea 0%, #d9c8b3 50%, #b0c4de 100%);
  }
  
  /* Container for the individual post details */
  .post-details {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 100px;
  }
  
  /* Title of the post */
  .post-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }
  
  /* Image associated with the post */
  .post-image img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  /* Content of the post */
  .post-content {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 20px;
    color: #555;
  }
  
  /* Metadata about the post (e.g., author, date) */
  .post-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    font-size: 0.9rem;
    color: #888;
  }
  
  /* Section for comments */
  .comments {
    margin-top: 30px;
  }
  
  /* Individual comment styling */
  .comment {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
  }
  
  /* Content of a comment */
  .comment-content {
    font-size: 1.3rem;
    color: #333;
    margin-bottom: 5px;
  }
  
  /* Author of the comment */
  .comment-author {
    font-size: 0.9rem;
    color: #666;
  }
  
  /* Date of the comment */
  .comment-date {
    font-size: 0.9rem;
    color: black;
    margin-left: 550px;
  }
  
  /* Comment actions (e.g., edit, delete) */
  .comment-actions {
    margin-top: 10px;
  }
  
  /* Buttons styling */
  button {
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  /* Delete button styling */
  .delete-button {
    background-color: #ff4d4d;
    color: white;
    margin-left: 10px;
  }
  
  .delete-button:hover {
    background-color: #cc0000;
    transform: scale(1.05);
  }
  
  /* Edit button styling */
  .edit-button {
    background-color: #007bff;
    color: white;
  }
  
  .edit-button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
  
  /* FontAwesome icon styling */
  .fa-solid {
    font-size: 1.2em;
  }
  
  /* Post actions (e.g., delete post) */
  .post-actions {
    margin-top: 20px;
  }
  
  /* Delete post button styling */
  .delete-post-button {
    background-color: #ff4d4d;
    color: white;
    margin-left: 10px;
  }
  
  .delete-post-button:hover {
    background-color: #cc0000;
  }
  
  /* Edit form styling */
  .edit-form {
    display: flex;
    flex-direction: column;
    margin-top: 20px;
  }
  
  .edit-title,
  .edit-content {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
  }
  
  .edit-title {
    font-size: 1.2rem;
    margin-bottom: 10px;
  }
  
  .edit-content {
    height: 200px;
    resize: vertical;
  }
  
  /* Image upload styling */
  .image-upload {
    margin-top: 1rem;
    padding: 1.5rem;
    border: 2px dashed #007bff;
    border-radius: 12px;
    background-color: #f9f9f9;
    text-align: center;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    transition: border-color 0.3s ease, background-color 0.3s ease;
  }
  
  .image-upload:hover {
    border-color: #0056b3;
    background-color: #e6f0ff;
  }
  
  .image-preview {
    margin-top: 1rem;
    position: relative;
  }
  
  .image-preview img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
  
  .remove-image-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: #ff4d4d;
    color: white;
    border-radius: 50%;
    cursor: pointer;
  }
  
  .remove-image-button:hover {
    background-color: #cc0000;
    transform: scale(1.1);
  }
  
  /* Save and cancel buttons styling */
  .save-button {
    background-color: #4caf50;
    color: white;
    margin-top: 1rem;
  }
  
  .save-button:hover {
    background-color: #45a049;
  }
  
  .cancel-button {
    background-color: #f44336;
    color: white;
    margin-left: 10px;
  }
  
  .cancel-button:hover {
    background-color: #e53935;
  }
  
  /* Button to edit the post */
  .edit-post-button {
    background-color: #007bff;
    color: white;
  }
  
  .edit-post-button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
  
  /* Comment form styling */
  .comment-form {
    margin-top: 20px;
  }
  
  .new-comment,
  .new-reply {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    height: 80px;
    resize: vertical;
    font-size: 1.2rem;
  }
  
  /* Comment button styling */
  .comment-button {
    padding: 10px 20px;
    border-radius: 5px;
    background-color: #007bff;
    color: white;
  }
  
  .comment-button:hover {
    background-color: #0056b3;
  }
  
  /* Reply form styling */
  .reply-form {
    margin-top: 10px;
  }
  
  .reply-button {
    background-color: #007bff;
    color: white;
    border-radius: 5px;
    margin-top: 10px;
  }
  
  .reply-button:hover {
    background-color: #0056b3;
  }
  
  /* Nested replies */
  .replies {
    padding-left: 20px;
    border-left: 2px solid #ddd;
  }
  
  .reply {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
  }
  
  .reply-content {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 5px;
  }
  
  .reply-actions button {
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    margin-right: 10px;
    font-size: 1rem;
  }
  .reply-date{
  margin-left: 550px;
  }
  /* Arrow indicators for replies */
  .reply-arrow {
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-top: 10px solid #ddd;
    display: inline-block;
    margin-right: 10px;
    vertical-align: middle;
  }
  
  .reply-indicator {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .reply-indicator span {
    font-size: 0.9rem;
    color: #666;
    margin-left: 5px;
  }
  
  /* Styling for nested replies */
  .replies {
    padding-left: 30px; /* Increase padding for nested replies */
    border-left: 2px solid #ddd;
  }
  
  /* Ensure that nested replies align well */
  .reply {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
    margin-left: 20px; /* Add margin for better readability */
  }
  
  .reply-content {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 5px;
  }
  
  
  /* Arrow back button styling */
  .arrowBack {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #f0f0f0;
    border-radius: 50%;
    cursor: pointer;
    position: absolute;
    top: 12%;
    left: 25%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .arrowBack i {
    font-size: 20px;
    color: #007bff;
  }
  
  .arrowBack:hover {
    background-color: #e0e0e0;
  }
  
  /* Likes section */
  .likes-section {
    display: flex;
    align-items: center;
    position: relative;
  }
  
  .likes-section button {
    background-color: transparent;
    border: none;
    color: #333;
    font-size: 1.5rem;
    cursor: pointer;
    transition: color 0.3s ease;
  }
  
  .likes-section button.liked {
    color: #ff4d4d;
  }
  
  .likes-section button:hover {
    color: #ff4d4d;
  }
  
  .like-btn button {
    position: relative;
    background-color: transparent;
    border: none;
    color: transparent;
    border-color: #e74c3c;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: 5px;
    transition: background-color 0.3s ease, color 0.3s ease;
  }
  
  .like-btn button.liked {
    color: #e74c3c;
  }
  
  .like-btn button:hover {
    background-color: #f2f2f2;
  }
  
  .like-btn button .fa-heart {
    margin-right: 6px;
    transition: transform 0.3s ease;
  }
  
  .like-btn button:hover .fa-heart {
    transform: scale(1.2);
  }
  
  /* Liked users box */
  .liked-users-box {
    display: none;
    position: absolute;
    top: 120%;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 20px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    padding: 12px 16px;
    width: 220px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 1000;
  }
  
  .likes-section:hover .liked-users-box {
    display: block;
    opacity: 1;
    visibility: visible;
  }
  
  .liked-users-box h3 {
    margin: 0 0 10px;
    font-size: 14px;
    color: #666;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  
  .liked-users-box ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  
  .liked-users-box ul li {
    margin: 6px 0;
    font-size: 14px;
    color: #444;
    transition: color 0.3s ease;
  }
  
  .liked-users-box ul li:hover {
    color: #e74c3c;
  }
  </style>
   -->