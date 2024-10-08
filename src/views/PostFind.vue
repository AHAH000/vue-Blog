<template>
  <section class="post-details-container">
    <!-- Notification Component for Confirmation -->
    <Notification
      v-if="showConfirmation"
      :message="confirmationMessage"
      :hasConfirm="true"
      @confirm="handleConfirmation(true)"
      @cancel="handleConfirmation(false)"
    />

    <div class="arrowBack" @click="goBack">
      <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
    </div>

    <div v-if="post" class="post-details">
      <div class="post-header">
        <h1 v-if="!isEditing" class="post-title">{{ post.title }}</h1>

        <!-- Likes Section -->
        <div class="likes-section" v-if="!isEditing">
          <button
            @click="toggleLike"
            :class="{ 'liked': post.liked_by_user }"
            class="like-btn"
          >
            <i class="fa-solid fa-heart" aria-hidden="true"></i>
          </button>
          <button @click="showLikedUsersPopup = true" class="likes-count-btn">
            {{ post.likes_count }} Likes
          </button>
          <LikedUsersPopup
            :show="showLikedUsersPopup"
            :users="post.likes"
            @close="showLikedUsersPopup = false"
          />
        </div>
      </div>

      <div class="post-image" v-if="post.image && !isEditing">
        <img :src="post.image" alt="Post Image" />
      </div>

      <div v-if="isEditing" class="edit-form">
        <input v-model="post.title" type="text" class="edit-title" />
        <textarea v-model="post.content" class="edit-content"></textarea>

        <div class="image-upload">
          <label for="imageUpload">Upload New Image:</label>
          <input type="file" id="imageUpload" @change="onFileChange" />
          <div v-if="imagePreview" class="image-preview">
            <img :src="imagePreview" alt="Image Preview" />
            <button @click="removeImage" class="remove-image-button">Remove Image</button>
          </div>
        </div>

        <button @click="editPost" class="save-button">Save</button>
        <button @click="isEditing = false" class="cancel-button">Cancel</button>
      </div>

      <div v-else>
        <div class="post-content">{{ post.content }}</div>
        <div class="post-meta">
          <span class="author">Author: {{ post.user.name }}</span>
          <span class="date">Date: {{ new Date(post.created_at).toLocaleDateString() }}</span>
        </div>

        <div v-if="isPostOwner" class="post-actions">
          <button @click="isEditing = true" class="edit-post-button">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button @click="deletePost" class="delete-post-button">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
        <CommentComponent 
        v-if="post" 
        :comments="post.comments"
        @addComment="addComment"
        @editComment="editComment"
        @deleteComment="deleteComment"
        @replyToComment="replyToComment"
      />

        
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { isAuthenticated, user } from '@/auth';
import type { PostList } from '@/types/type';
import Notification from '@/components/Notification.vue';
import LikedUsersPopup from '@/components/LikedUsersPopup.vue'; // Import the new component
import CommentComponent from '@/components/CommentComponent.vue';
const route = useRoute();
const router = useRouter();
const VITE_API_URL = 'https://interns-blog.nafistech.com/api';
const post = ref<PostList | null>(null);

const isEditing = ref(false);
const newComment = ref('');
const showNotification = ref(false);
const notificationMessage = ref('');
const showConfirmation = ref(false);
const confirmationMessage = ref('');
const replyContent = ref('');
const editReplyContent = ref('');
const replyBeingEdited = ref<number | null>(null);
const isReplyingToComment = ref<number | null>(null);
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
const commentBeingEdited = ref<number | null>(null);
const editCommentContent = ref('');

const imageFile = ref<File | null>(null);
const imagePreview = ref<string | null>(null);

const fetchPostDetails = async () => {
  try {
    const response = await axios.get(`${VITE_API_URL}/posts/${route.params.slug}`);
    post.value = response.data.data;
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
};

const toggleLike = async () => {
  if (post.value) {
    try {
      await axios.post(`${VITE_API_URL}/posts/like/${post.value.slug}`);
      if (post.value.liked_by_user) {
        post.value.liked_by_user = false;
        post.value.likes_count -= 1;
      } else {
        post.value.liked_by_user = true;
        post.value.likes_count += 1;
      }
      await fetchPostDetails();
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  }
};

const addComment = async () => {
  if (post.value && newComment.value.trim()) {
    try {
      await axios.post(`${VITE_API_URL}/posts/${post.value.slug}/comments`, {
        content: newComment.value
      });
      newComment.value = '';
      fetchPostDetails();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }
};
const replyToComment = async (parentId: number) => {
  if (post.value && replyContent.value.trim()) {
    try {
      await axios.post(`${VITE_API_URL}/posts/${post.value.slug}/comments`, {
        content: replyContent.value,
        parent_id: parentId
      });
      replyContent.value = '';
      isReplyingToComment.value = null; // Hide the reply form after submitting
      fetchPostDetails(); // Reload the post details to get the updated replies
    } catch (error) {
      console.error('Error adding reply:', error);
    }
  }
};
const toggleReplyForm = (commentId: number) => {
  isReplyingToComment.value = isReplyingToComment.value === commentId ? null : commentId;
};
const editReply = (replyId: number, currentContent: string) => {
  replyBeingEdited.value = replyId;
  editReplyContent.value = currentContent;
};

const saveReplyEdit = async (replyId: number) => {
  try {
    const postSlug = post.value?.slug;
    if (!postSlug) throw new Error('Post slug is not available');
    await axios.patch(`${VITE_API_URL}/posts/${postSlug}/comments/${replyId}`, {
      content: editReplyContent.value
    });
    if (post.value) {
      const comment = post.value.comments.find(comment => 
        comment.children.some(reply => reply.id === replyId)
      );
      if (comment) {
        const reply = comment.children.find(reply => reply.id === replyId);
        if (reply) reply.content = editReplyContent.value;
      }
    }
    replyBeingEdited.value = null;
    editReplyContent.value = '';
  } catch (error) {
    console.error('Error editing reply:', error);
    alert('Failed to edit the reply. Please try again.');
  }
};

const deleteReply = async (replyId: number) => {
  showConfirmDialog('Are you sure you want to delete this reply?', async () => {
    try {
      const postSlug = post.value?.slug;
      if (!postSlug) throw new Error('Post slug is not available');
      await axios.delete(`${VITE_API_URL}/posts/${postSlug}/comments/${replyId}`);
      fetchPostDetails();
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  });
};

const editComment = (commentId: number, currentContent: string) => {
  commentBeingEdited.value = commentId;
  editCommentContent.value = currentContent;
};

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
    alert('Failed to edit the comment. Please try again.');
  }
};

const cancelCommentEdit = () => {
  commentBeingEdited.value = null;
  editCommentContent.value = '';
};

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

const deletePost = async () => {
  if (post.value) {
    showConfirmDialog('Are you sure you want to delete this post?', async () => {
      try {
        await axios.delete(`${VITE_API_URL}/posts/${post.value?.slug}`);
        router.push('/PostList');
      } catch (error) {
        console.error('Error deleting post:', error);
      }
    });
  }
};

// Handle file input change and preview
const onFileChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0] || null;
  if (file) {
    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

// Remove the selected image
const removeImage = () => {
  imageFile.value = null;
  imagePreview.value = null;
};

// Edit post and upload new image
const editPost = async () => {
  if (post.value) {
    try {
      const formData = new FormData();
      formData.append('title', post.value.title);
      formData.append('content', post.value.content);
      if (imageFile.value) {
        formData.append('image', imageFile.value);
      }
      await axios.patch(`${VITE_API_URL}/posts/${post.value.slug}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      isEditing.value = false;
      fetchPostDetails();
    } catch (error) {
      console.error('Error editing post:', error);
    }
  }
};

// Check if the current user is the post owner
const isPostOwner = computed(() => {
  return post.value && user.value && post.value.user.id === user.value.id;
});

const isCommentOwner = (commentUserId: number) => {
  return user.value && commentUserId === user.value.id;
};
onMounted(() => {
  fetchPostDetails();
});

// Navigate back to the previous page
const goBack = () => {
  router.back();
};

const showLikedUsersPopup = ref(false);

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