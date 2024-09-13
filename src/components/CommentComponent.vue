<template>
        <Notification
      v-if="showConfirmation"
      :message="confirmationMessage"
      :hasConfirm="true"
      @confirm="handleConfirmation(true)"
      @cancel="handleConfirmation(false)"
    />
    <div class="comments">
      <!-- Add New Comment -->
      <div v-if="isAuthenticated" class="comment-form">
        <textarea v-model="newComment" class="new-comment" placeholder="Add a comment"></textarea>
        <button @click="addComment" class="comment-button">Add Comment</button>
      </div>
  
      <h3>Comments</h3>
  
      <!-- Display Comments -->
      <div v-for="(comment, index) in post?.comments.slice().reverse()" :key="index" class="comment">
        
        <!-- Edit Comment Form -->
        <div v-if="commentBeingEdited === comment.id">
          <input v-model="editCommentContent" type="text" class="edit-comment-input" />
          <button @click="saveCommentEdit(comment.id)" class="save-button">Save</button>
          <button @click="cancelCommentEdit" class="cancel-button">Cancel</button>
        </div>
  
        <!-- Comment Content -->
        <div v-else>
          <p class="comment-content">{{ comment.content }}</p>
          <small class="comment-author">{{ comment.user.name }}</small>
          <small class="comment-date">{{ comment.created_at_readable }}</small>
  
          <!-- Actions for comment owner -->
          <div v-if="isCommentOwner(comment.user.id)" class="comment-actions">
            <button @click="editComment(comment.id, comment.content)" class="edit-button">
              <i class="fa-solid fa-pen"></i>
            </button>
            <button @click="deleteComment(comment.id)" class="delete-button">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
  
          <!-- Reply Button -->
          <div v-if="isAuthenticated">
            <button @click="toggleReplyForm(comment.id)" class="reply-button">
              <i class="fa-solid fa-reply"></i>
            </button>
          </div>
  
          <!-- Reply Form -->
          <div v-if="isReplyingToComment === comment.id" class="reply-form">
            <textarea v-model="replyContent" class="new-reply" placeholder="Reply to this comment"></textarea>
            <button @click="replyToComment(comment.id)" class="reply-button">Submit Reply</button>
            <button @click="isReplyingToComment = null" class="cancel-button">Cancel</button>
          </div>
  
          <!-- Display Replies -->
          <div v-if="comment.children.length" class="replies">
            <CommentReplyComponent
              v-for="(reply, rIndex) in comment.children"
              :key="rIndex"
              :reply="reply"
              :post="post"
              :fetchPostDetails="fetchPostDetails"
            />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { useRoute } from 'vue-router';
  import { isAuthenticated, user } from '@/auth';
  import type { PostList } from '@/types/type';
  import CommentReplyComponent from './CommentReplyComponent.vue'
  import Notification from './Notification.vue';
  const showConfirmation = ref(false);
const confirmationMessage = ref('');
  const route = useRoute();
  const post = ref<PostList | null>(null);
  const newComment = ref('');
  const replyContent = ref('');
  const editCommentContent = ref('');
  const isReplyingToComment = ref<number | null>(null);
  const commentBeingEdited = ref<number | null>(null);
  const VITE_API_URL = 'https://interns-blog.nafistech.com/api';
const handleConfirmation = (confirmed: boolean) => {
  if (confirmed && onConfirm.value) {
    onConfirm.value();
  }
  showConfirmation.value = false;
};
const onConfirm = ref<(() => void) | null>(null);
const showConfirmDialog = (message: string, onConfirmCallback: () => void) => {
  confirmationMessage.value = message;
  showConfirmation.value = true;
  onConfirm.value = onConfirmCallback;
};

  // Fetch post details
  const fetchPostDetails = async () => {
    try {
      const response = await axios.get(`${VITE_API_URL}/posts/${route.params.slug}`);
      post.value = response.data.data;
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  };
  
  // Add new comment
  const addComment = async () => {
    if (post.value && newComment.value.trim()) {
      try {
        await axios.post(`${VITE_API_URL}/posts/${post.value.slug}/comments`, { content: newComment.value });
        newComment.value = '';
        fetchPostDetails();
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };
  const toggleReplyForm = (commentId: number) => {
  isReplyingToComment.value = isReplyingToComment.value === commentId ? null : commentId;
};
  // Reply to a comment
  const replyToComment = async (parentId: number) => {
    if (post.value && replyContent.value.trim()) {
      try {
        await axios.post(`${VITE_API_URL}/posts/${post.value.slug}/comments`, {
          content: replyContent.value,
          parent_id: parentId
        });
        replyContent.value = '';
        isReplyingToComment.value = null; // Hide the reply form after submitting
        fetchPostDetails(); // Reload post to get updated replies
      } catch (error) {
        console.error('Error adding reply:', error);
      }
    }
  };
  
  // Edit comment
  const editComment = (commentId: number, currentContent: string) => {
    commentBeingEdited.value = commentId;
    editCommentContent.value = currentContent;
  };
  
  // Save edited comment
  const saveCommentEdit = async (commentId: number) => {
    try {
      const postSlug = post.value?.slug;
      if (!postSlug) throw new Error('Post slug is not available');
      await axios.patch(`${VITE_API_URL}/posts/${postSlug}/comments/${commentId}`, {
        content: editCommentContent.value
      });
      if (post.value) {
        const comment = post.value.comments.find(comment => comment.id === commentId);
        if (comment) comment.content = editCommentContent.value;
      }
      commentBeingEdited.value = null;
      editCommentContent.value = '';
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };
  
  // Cancel comment edit
  const cancelCommentEdit = () => {
    commentBeingEdited.value = null;
    editCommentContent.value = '';
  };
  
  // Delete comment
  const deleteComment = async (commentId: number) => {
  showConfirmDialog('Are you sure you want to delete this comment?', async () => {
    try {
      await axios.delete(`${VITE_API_URL}/posts/${post.value?.slug}/comments/${commentId}`);
      if (post.value) post.value.comments = post.value.comments.filter(comment => comment.id !== commentId);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete the comment. Please try again.');
    }
  });
};
  
  // Check if user is the owner of the comment
  const isCommentOwner = (commentUserId: number) => user.value && commentUserId === user.value.id;
  
  onMounted(() => {
    fetchPostDetails();
  });
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