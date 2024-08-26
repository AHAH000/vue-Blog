<!-- <template>
    <div class="comment">
      <div v-if="isEditing">
        <input v-model="editContent" type="text" class="edit-comment-input" />
        <button @click="saveEdit" class="save-button">Save</button>
        <button @click="cancelEdit" class="cancel-button">Cancel</button>
      </div>
      <div v-else>
        <p class="comment-content">{{ comment.content }}</p>
        <small class="comment-author">{{ comment.user.name }}</small>
        <div v-if="isCommentOwner" class="comment-actions">
          <button @click="startEdit" class="edit-button">Edit</button>
          <button @click="deleteComment" class="delete-button">Delete</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, type PropType } from 'vue';
  import axios from 'axios';
  
  const props = defineProps({
    comment: {
      type: Object as PropType<{ id: number; content: string; user: { id: number; name: string } }>,
      required: true,
    },
    postSlug: {
      type: String,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  });
  
  const emit = defineEmits(['refreshComments']);
  
  const isEditing = ref(false);
  const editContent = ref(props.comment.content);
  
  const isCommentOwner = computed(() => props.comment.user.id === props.userId);
  
  const startEdit = () => {
    isEditing.value = true;
  };
  
  const cancelEdit = () => {
    isEditing.value = false;
    editContent.value = props.comment.content;
  };
  
  const saveEdit = async () => {
    try {
      await axios.patch(`${import.meta.env.VITE_API_URL}/posts/${props.postSlug}/comments/${props.comment.id}`, {
        content: editContent.value,
      });
      isEditing.value = false;
      emit('refreshComments');
    } catch (error) {
      console.error('Error editing comment:', error);
      alert('Failed to edit the comment. Please try again.');
    }
  };
  
  const deleteComment = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${props.postSlug}/comments/${props.comment.id}`);
      emit('refreshComments');
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete the comment. Please try again.');
    }
  };
  </script>
  
  <style scoped>
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
  </style>
   -->