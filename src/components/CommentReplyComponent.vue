<template>
    <Notification
      v-if="showConfirmation"
      :message="confirmationMessage"
      :hasConfirm="true"
      @confirm="handleConfirmation(true)"
      @cancel="handleConfirmation(false)"
    />
    <div class="replies">
      <!-- Toggle Button to Show/Hide Replies -->
      
  
      <!-- Reply Content -->
      <div v-if="replyBeingEdited === reply.id">
        <input v-model="editReplyContent" type="text" class="edit-reply-input" />
        <button @click="saveReplyEdit(reply.id)" class="save-button">Save</button>
        <button @click="cancelReplyEdit" class="cancel-button">Cancel</button>
      </div>
  
      <div v-else>
        <p class="reply-content">{{ reply.content }}</p>
        <small class="reply-author">{{ reply.user.name }}</small>
        <small class="reply-date">{{ reply.created_at_readable }}</small>
  
        <!-- Actions for reply owner -->
        <div v-if="isReplyOwner(reply.user.id)" class="reply-actions">
          <button @click="editReply(reply.id, reply.content)" class="edit-button">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button @click="deleteReply(reply.id)" class="delete-button">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
       
  
        <!-- Reply Button -->
        <button v-if="!showReplyForm" @click="toggleReplyForm" class="reply-button">
          <i class="fa-solid fa-reply"></i>
        </button>
        <br>
        <button @click="toggleReplies" class="toggle-replies-button" v-if="reply.children.length">
            {{ showReplies ? 'Hide Replies' : 'Show Replies' }} ({{ reply.children.length }})
          </button>
  
        <!-- Reply Form -->
        <div v-if="showReplyForm">
          <textarea v-model="newReplyContent" placeholder="Write your reply..." rows="2" class="reply-input"></textarea>
          <button @click="postReply" class="post-reply-button">Post Reply</button>
          <button @click="toggleReplyForm" class="cancel-reply-button">Cancel</button>
        </div>
  
        <!-- Nested Replies (if any) -->
        <div v-if="reply.children.length && showReplies" class="nested-replies">
          <CommentReplyComponent
            v-for="(nestedReply, nIndex) in reply.children"
            :key="nIndex"
            :reply="nestedReply"
            :post="post"
            :fetchPostDetails="fetchPostDetails"
          />
        </div>
      </div>
    </div>
  </template>
  
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import axios from 'axios';
  import { isAuthenticated, user } from '@/auth';
  import type { Comment, PostList } from '@/types/type';
  import Notification from '@/components/Notification.vue';
  const showConfirmation = ref(false);
  const showReplies = ref(true); 
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
const confirmationMessage = ref('');
  interface Props {
    reply: Comment;
    post: PostList;
    fetchPostDetails: () => void;
  }
  
  const props = defineProps<Props>();
  const editReplyContent = ref('');
  const replyBeingEdited = ref<number | null>(null);
  const showReplyForm = ref(false);
  const newReplyContent = ref('');
  const VITE_API_URL = 'https://interns-blog.nafistech.com/api';
  
  // Edit Reply
  const editReply = (replyId: number, currentContent: string) => {
    replyBeingEdited.value = replyId;
    editReplyContent.value = currentContent;
  };
  
  // Save edited reply
  const saveReplyEdit = async (replyId: number) => {
    try {
      const postSlug = props.post.slug;
      await axios.patch(`${VITE_API_URL}/posts/${postSlug}/comments/${replyId}`, {
        content: editReplyContent.value,
      });
      replyBeingEdited.value = null;
      editReplyContent.value = '';
      props.fetchPostDetails();
    } catch (error) {
      console.error('Error editing reply:', error);
    }
  };
  
  // Cancel reply edit
  const cancelReplyEdit = () => {
    replyBeingEdited.value = null;
    editReplyContent.value = '';
  };
  
  // Delete reply
  const deleteReply = async (replyId: number) => {
  showConfirmDialog("Are you sure you want to delete this reply?", async () => {
    try {
      await axios.delete(`${VITE_API_URL}/posts/${props.post.slug}/comments/${replyId}`);
      props.fetchPostDetails(); // Assuming this is used to refresh post details
    } catch (error) {
      console.error('Error deleting reply:', error);
    }
  });
};

  
  // Check if user is the owner of the reply
  const isReplyOwner = (replyUserId: number) => user.value && replyUserId === user.value.id;
  
  // Toggle the reply form
  const toggleReplyForm = () => {
    showReplyForm.value = !showReplyForm.value;
    newReplyContent.value = '';
  };
  
  // Post a reply
  const postReply = async () => {
    if (newReplyContent.value.trim()) {
      try {
        await axios.post(`${VITE_API_URL}/posts/${props.post.slug}/comments`, {
          content: newReplyContent.value.trim(),
          parent_id: props.reply.id,
        });
        props.fetchPostDetails();
        toggleReplyForm();
      } catch (error) {
        console.error('Error posting reply:', error);
      }
    }
  };
  // Toggle replies visibility
const toggleReplies = () => {
  showReplies.value = !showReplies.value;
};
  </script>
  
<style scoped>
/* Container for the entire post details page */
.replies {
    border-left: 2px solid #ddd;
    margin-left: 20px;
    padding-left: 15px;
  }
  
  .reply-content {
    font-size: 14px;
    color: #333;
    margin-bottom: 5px;
  }
  
  .reply-author {
    font-size: 12px;
    color: #666;
    margin-right: 10px;
  }
  
  .reply-date {
    font-size: 12px;
    color: #999;
  }
  
  .reply-actions {
    margin-top: 5px;
  }
  
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
  
  .reply-input {
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 10px;
    font-size: 14px;
    resize: vertical;
  }
  
  .edit-reply-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #007bff;
    border-radius: 5px;
    font-size: 14px;
    margin-bottom: 10px;
  }
  
  .save-button, .cancel-button, .post-reply-button, .cancel-reply-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    margin-right: 5px;
  }
  
  .save-button:hover, .cancel-button:hover, .post-reply-button:hover, .cancel-reply-button:hover {
    background-color: #0056b3;
  }
  .reply-button{
  margin-top: 10px;
  }
  
  .nested-replies {
    margin-top: 10px;
    padding-left: 15px;
    border-left: 1px solid #ccc;
  }
  .reply-button {
  background-color: #007bff; /* Blue color for the reply button */
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.reply-button:hover {
  background-color: #0056b3; /* Darker shade for reply button hover */
}
/*Toggle Replies */
.toggle-replies-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 5px;
    margin-bottom: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
    margin-top: 5px;
  }
  
  .toggle-replies-button:hover {
    background-color: #0056b3;
  }
  
</style>
  