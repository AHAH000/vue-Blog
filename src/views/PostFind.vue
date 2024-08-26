<template>
  <section class="post-details-container">
    <!-- Notification Component for Confirmation -->
    <Notification v-if="showConfirmation" :message="confirmationMessage" :hasConfirm="true" @confirm="handleConfirmation(true)" @cancel="handleConfirmation(false)" />
    <div class="arrowBack" @click="goBack"> <i class="fa-solid fa-arrow-left" aria-hidden="true"></i> 
    </div>
    <div v-if="post" class="post-details">
      <h1 v-if="!isEditing" class="post-title">{{ post.title }}</h1>
      <div class="post-image" v-if="post.image">
        <img :src="post.image" alt="Post Image" />
      </div>
      <!-- Edit form -->
      <div v-if="isEditing" class="edit-form">
        <input v-model="post.title" type="text" class="edit-title" />
        <textarea v-model="post.content" class="edit-content"></textarea>
        <button @click="editPost" class="save-button">Save</button>
        <button @click="isEditing = false" class="cancel-button">Cancel</button>
      </div>
      
      <!-- Display post details when not editing -->
      <div v-else>
        <div class="post-content">{{ post.content }}</div>
        <div class="post-meta">
          <span class="author">Author: {{ post.user.name }}</span>
          <span class="date">Date: {{ new Date(post.created_at).toLocaleDateString() }}</span>
        </div>

        <!-- Show edit button if the user is the post owner -->
        <div v-if="isPostOwner" class="post-actions">
          <button @click="isEditing = true" class="edit-post-button">Edit Post</button>
          <button @click="deletePost" class="delete-post-button">Delete Post</button>
        </div>
        
        <!-- Comment form -->
        <div v-if="isAuthenticated" class="comment-form">
          <textarea v-model="newComment" class="new-comment" placeholder="Add a comment"></textarea>
          <button @click="addComment" class="comment-button">Add Comment</button>
        </div>

        <div class="comments">
          <h3>Comments</h3>
          <div v-for="(comment, index) in post.comments" :key="index" class="comment">
            <!-- Edit Comment Form -->
            <div v-if="commentBeingEdited === comment.id">
              <input v-model="editCommentContent" type="text" class="edit-comment-input" />
              <button @click="saveCommentEdit(comment.id)" class="save-button">Save</button>
              <button @click="cancelCommentEdit" class="cancel-button">Cancel</button>
            </div>
            <div v-else>
              <p class="comment-content">{{ comment.content }}</p>
              <small class="comment-author">{{ comment.user.name }}</small>
              <!-- Allow editing and deleting if the comment belongs to the current user -->
              <div v-if="isCommentOwner(comment.user.id)" class="comment-actions">
                <button @click="editComment(comment.id, comment.content)" class="edit-button">Edit</button>
                <button @click="deleteComment(comment.id)" class="delete-button">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

  
  
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { isAuthenticated, user, getUser } from '@/auth';
import type { PostList } from '@/types/type';
import Notification from '@/components/Notification.vue';

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

const fetchPostDetails = async () => {
  try {
    console.log('Fetching post details for slug:', route.params.slug);
    const response = await axios.get(`${VITE_API_URL}/posts/${route.params.slug}`);
    console.log('Post response:', response.data);
    post.value = response.data.data;
  } catch (error) {
    console.error('Error fetching post details:', error);
  }
};

const refreshPage = () => {
  location.reload(); 
};

const addComment = async () => {
  if (post.value && newComment.value.trim()) {
    try {
      const response = await axios.post(`${VITE_API_URL}/posts/${post.value.slug}/comments`, {
        content: newComment.value
      });
      // Add the new comment to the local state
      newComment.value = ''; // To Clear the input after editing
      fetchPostDetails();
      
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }
};

const editComment = (commentId: number, currentContent: string) => {
  commentBeingEdited.value = commentId;
  editCommentContent.value = currentContent;
};

// Save Comment Edit
const saveCommentEdit = async (commentId: number) => {
  try {
    const postSlug = post.value?.slug;
    if (!postSlug) {
      throw new Error('Post slug is not available');
    }
    await axios.patch(`${VITE_API_URL}/posts/${postSlug}/comments/${commentId}`, {
      content: editCommentContent.value
    });
    if (post.value) {
      const comment = post.value.comments.find(comment => comment.id === commentId);
      if (comment) {
        comment.content = editCommentContent.value;
      }
    }
    commentBeingEdited.value = null;
    editCommentContent.value = '';
  } catch (error) {
    console.error('Error editing comment:', error);
    alert('Failed to edit the comment. Please try again.');
  }
};

// Cancel Comment Edit
const cancelCommentEdit = () => {
  commentBeingEdited.value = null;
  editCommentContent.value = '';
};

const deleteComment = async (commentId: number) => {
  showConfirmDialog('Are you sure you want to delete this comment?', async () => {
    try {
      await axios.delete(`${VITE_API_URL}/posts/${post.value?.slug}/comments/${commentId}`);    
      // To Remove the deleted comment from the local state
      if (post.value) {
        post.value.comments = post.value.comments.filter(comment => comment.id !== commentId);
      }
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

const editPost = async () => {
  if (post.value) {
    try {
      await axios.patch(`${VITE_API_URL}/posts/${post.value.slug}`, {
        title: post.value.title,
        content: post.value.content
      });
      isEditing.value = false;
    } catch (error) {
      console.error('Error updating post:', error);
    }
  }
};

// Go to postList View
const goBack = () => {
  router.push('/PostList');
};

onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/LoginView');
  } else {
    await getUser(); 
    await fetchPostDetails();
  }
});

const isPostOwner = computed(() => {
  return post.value && user.value && post.value.user.id === user.value.id;
});

const isCommentOwner = (commentUserId: number) => {
  return user.value && commentUserId === user.value.id;
};
</script>

  

<style scoped>
.post-details-container {
    margin-top: 50px;
  padding: 20px;
  background: linear-gradient(135deg, #f4f1ea 0%, #d9c8b3 50%, #b0c4de 100%);
}

.post-details {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 100px;
}

.post-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.post-content {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 20px;
    color: #555;
}

.post-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #888;
}

.comments {
  margin-top: 30px;
}

.comment {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.comment-content {
  font-size: 1rem;
  color: #333;
  margin-bottom: 5px;
}

.comment-author {
  font-size: 0.9rem;
  color: #666;
}

.comment-actions {
  margin-top: 10px;
}

button {
  padding: 5px 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.delete-button {
  background-color: #ff4d4d;
  color: white;
  margin-right: 10px;
}

.delete-button:hover {
  background-color: #cc0000;
}

.edit-button {
  background-color: #007bff;
  color: white;
}

.edit-button:hover {
  background-color: #0056b3;
}
.post-actions {
    margin-top: 20px;
  }
  
  .delete-post-button {
    background-color: #ff4d4d;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .delete-post-button:hover {
    background-color: #cc0000;
  }.edit-form {
    margin-top: 20px;
  }
  
  .edit-title {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    font-size: 16px; 
  }
  .edit-content{
    width: 100%; /* Adjust width to fill the container */
  min-height: 400px; /* Set a minimum height */
  padding: 10px; /* Add some padding for better appearance */
  font-size: 16px; /* Increase font size for readability */
  border-radius: 5px; /* Add rounded corners */
  border: 1px solid #ccc; /* Add a border */
  box-sizing: border-box; /* Ensure padding is included in the width and height */
  margin-bottom: 10px;
  }
  
  .save-button, .cancel-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .save-button {
    background-color: #4caf50;
    color: white;
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
  .edit-post-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
  }
  
  .edit-post-button:hover {
    background-color: #0056b3;
  }.edit-form {
    margin-top: 20px;
  }

  .comment-form {
    margin-top: 20px;
  }
  
  .new-comment {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
    height: 80px;
    resize: vertical;
  }
  
  .comment-button {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    background-color: #007bff;
    color: white;
    transition: background-color 0.3s ease;
  }
  
  .comment-button:hover {
    background-color: #0056b3;
  }
  .edit-comment-content {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
  }
  
  .edit-button {
    background-color: #007bff;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
  }
  
  .edit-button:hover {
    background-color: #0056b3;
  }
  .arrowBack {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background-color: #f0f0f0;
    border-radius: 50%;
    cursor: pointer;
    position:absolute;
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
  .post-details-container {
    margin-top: 50px;
    padding: 20px;
    background: linear-gradient(135deg, #f4f1ea 0%, #d9c8b3 50%, #b0c4de 100%);
  }
  
  .post-details {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 100px;
  }
  
  .post-title {
    font-size: 2.5rem;
    font-weight: bold;
    margin-bottom: 10px;
    color: #333;
  }
  
  .post-image img {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .post-content {
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 20px;
    color: #555;
  }
  
  .post-meta {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    font-size: 0.9rem;
    color: #888;
  }
</style>
