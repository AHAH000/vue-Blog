<!-- <template>
      <!-- Notification Component for Confirmation -->
      <Notification v-if="showConfirmation" :message="confirmationMessage" :hasConfirm="true" @confirm="handleConfirmation(true)" @cancel="handleConfirmation(false)" />
      <div v-for="(comment, index) in post?.comments.slice().reverse()" :key="index" class="comment">
        
              <div v-if="commentBeingEdited === comment.id">
                <input v-model="editCommentContent" type="text" class="edit-comment-input" />
                <button @click="saveCommentEdit(comment.id)" class="save-button">Save</button>
                <button @click="cancelCommentEdit" class="cancel-button">Cancel</button>
              </div>
              <div v-else>
                <p class="comment-content">{{ comment.content }}</p>
                <small class="comment-author">{{ comment.user.name }}</small>
                <small class="comment-date">{{ comment.created_at_readable }}</small>
  
                <div v-if="isCommentOwner(comment.user.id)" class="comment-actions">
                  <button @click="editComment(comment.id, comment.content)" class="edit-button"> 
                    <i class="fa-solid fa-pen"></i>
                  </button>
                  <button @click="deleteComment(comment.id)" class="delete-button">
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
  
                <div v-if="isAuthenticated">
                  <button @click="toggleReplyForm(comment.id)" class="reply-button">
                    <i class="fa-solid fa-reply"></i>
                  </button>
                </div>
  
                <div v-if="isReplyingToComment === comment.id" class="reply-form">
                  <textarea v-model="replyContent" class="new-reply" placeholder="Reply to this comment"></textarea>
                  <button @click="replyToComment(comment.id)" class="reply-button">Submit Reply</button>
                  <button @click="isReplyingToComment = null" class="cancel-button">Cancel</button>
                </div>
  
                <div v-if="comment.children.length" class="replies">
                  <div v-for="(reply, rIndex) in comment.children" :key="rIndex" class="reply">
                    <div v-if="replyBeingEdited === reply.id">
                      <input v-model="editReplyContent" type="text" class="edit-reply-input" />
                      <button @click="saveReplyEdit(reply.id)" class="save-button">Save</button>
                      <button @click="replyBeingEdited = null" class="cancel-button">Cancel</button>
                    </div>
                    <div v-else>
                      <p class="reply-content">{{ reply.content }}</p>
                      <small class="reply-author">{{ reply.user.name }}</small>
                      <small class="reply-date">{{ reply.created_at_readable }}</small>
  
                      <div v-if="isCommentOwner(reply.user.id)" class="reply-actions">
                        <button @click="editReply(reply.id, reply.content)" class="edit-button">
                          <i class="fa-solid fa-pen"></i>
                        </button>
                        <button @click="deleteReply(reply.id)" class="delete-button">
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
  
                      <div v-if="isAuthenticated">
                        <button @click="toggleReplyForm(reply.id)" class="reply-button">
                          <i class="fa-solid fa-reply"></i>
                        </button>
                      </div>
  
                      <div v-if="isReplyingToComment === reply.id" class="reply-form">
                        <textarea v-model="replyContent" class="new-reply" placeholder="Reply to this reply"></textarea>
                        <button @click="replyToComment(reply.id)" class="reply-button">Submit Reply</button>
                        <button @click="isReplyingToComment = null" class="cancel-button">Cancel</button>
                      </div>
  
                      <div v-if="reply.children.length" class="replies">
                        <div v-for="(nestedReply, nrIndex) in reply.children" :key="nrIndex" class="reply">
                          <div v-if="replyBeingEdited === nestedReply.id">
                            <input v-model="editReplyContent" type="text" class="edit-reply-input" />
                            <button @click="saveReplyEdit(nestedReply.id)" class="save-button">Save</button>
                            <button @click="replyBeingEdited = null" class="cancel-button">Cancel</button>
                          </div>
                          <div v-else>
                            <p class="reply-content">{{ nestedReply.content }}</p>
                            <small class="reply-author">{{ nestedReply.user.name }}</small>
                            <small class="reply-date">{{ nestedReply.created_at_readable }}</small>
  
                            <div v-if="isCommentOwner(nestedReply.user.id)" class="reply-actions">
                              <button @click="editReply(nestedReply.id, nestedReply.content)" class="edit-button">
                                <i class="fa-solid fa-pen"></i>
                              </button>
                              <button @click="deleteReply(nestedReply.id)" class="delete-button">
                                <i class="fa-solid fa-trash"></i>
                              </button>
                            </div>
  
                            <div v-if="isAuthenticated">
                              <button @click="toggleReplyForm(nestedReply.id)" class="reply-button">
                                <i class="fa-solid fa-reply"></i>
                              </button>
                            </div>
  
                            <div v-if="isReplyingToComment === nestedReply.id" class="reply-form">
                              <textarea v-model="replyContent" class="new-reply" placeholder="Reply to this reply"></textarea>
                              <button @click="replyToComment(nestedReply.id)" class="reply-button">Submit Reply</button>
                              <button @click="isReplyingToComment = null" class="cancel-button">Cancel</button>
                            </div>
                          </div>
                        </div>
                      </div>
  
                    </div>
                  </div>
                </div>
  
              </div>
            </div>
          
  </template>
  
    
  <script setup lang="ts">
  import { ref, onMounted, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import axios from 'axios';
  import { isAuthenticated, user } from '@/auth';
  import type { PostList } from '@/types/type';
  import Notification from '@/components/Notification.vue';
  import LikedUsersPopup from '@/components/LikedUsersPopup.vue'; // Import the new component
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
    margin-left: 605px;
  }
  
  /* Comment actions (e.g., edit, delete) */
  .comment-actions {
    margin-top: 10px;
  }
  
  /* Buttons styling */
  button {
    padding: 5px 5px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s ease;
  }
  
  /* Delete button styling */
  .delete-button {
    background-color: #ff4d4d;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, transform 0.3s ease;
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
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, transform 0.3s ease;
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
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease;
    margin-left: 10px;
  }
  
  .delete-post-button:hover {
    background-color: #cc0000;
  }

  
  /* Edit content styling */
  .edit-content {
    width: 100%; /* Adjust width as needed */
    height: 200px; /* Adjust height as needed */
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    line-height: 1.5;
    resize: vertical; /* Allows users to resize the textarea vertically */
  }
  
  
  
  /* Save and cancel buttons styling */
  .save-button, .cancel-button {
    margin-top: 1rem;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .save-button {
    background-color: #4caf50;
    color: white;
  }
  
  .save-button:hover {
    background-color: #45a049;
    transform: scale(1.05);
  }
  
  .cancel-button {
    background-color: #f44336;
    color: white;
    margin-left: 10px;
  }
  
  .cancel-button:hover {
    background-color: #e53935;
    transform: scale(1.05);
  }
  
  /* Button to edit the post */
  .edit-post-button {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.3s ease, transform 0.3s ease;
  }
  
  .edit-post-button:hover {
    background-color: #0056b3;
    transform: scale(1.05);
  }
  
  /* Comment form styling */
  .comment-form {
    margin-top: 20px;
  }
  
  /* New comment textarea */
  .new-comment {
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
  
  /* Styling for editing comment content */
  .edit-comment-content {
    width: 100%;
    padding: 10px;
    border-radius: 5px;
    border: 1px solid #ddd;
    margin-bottom: 10px;
  }
  
  /* Edit comment input */
  .edit-comment-input {
    margin-right: 10px;
    padding: 10px;
    width: 200px;
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
  /*likes*/
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
  
  .likes-section {
    position: relative;
    display: inline-block;
  }
  
  .like-btn button {
    position: relative;
    background-color: transparent;
    border: none;
    color:transparent;
    border-color:#e74c3c ;
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
  /* Button for liking posts */
  
  .liked-users-box {
    display: none;
    position: absolute;
    top: 120%; /* Adjusted to avoid overlapping */
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
    padding: 12px 16px;
    width: 220px;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
    z-index: 1000;
    border-radius: 20px;
  }
  
   button:hover .liked-users-box {
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
  /* Reply form styling */
  .reply-form {
    margin-top: 10px;
  }
  
  .new-reply {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    margin-bottom: 10px;
  }
  
  .reply-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  .reply-button:hover {
    background-color: #0056b3;
  }
  .reply-date{
  margin-left: 550px;
  }
  
  /* Nested replies */
  .replies {
    padding-left: 20px;
    border-left: 2px solid #ddd;
  }
  
  /* Individual reply styling */
  .reply {
    border-bottom: 1px solid #eee;
    padding: 10px 0;
  }
  
  /* Content of a reply */
  .reply-content {
    font-size: 1.2rem;
    color: #333;
    margin-bottom: 5px;
  }
  
  /* Actions for replies */
  .reply-actions button {
    background: none;
    border: none;
    color: #333;
    cursor: pointer;
    margin-right: 10px;
    font-size: 1rem;
  }
  
  </style>
  
  
  
   -->