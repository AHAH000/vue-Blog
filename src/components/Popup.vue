<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';
import Notification from './Notification.vue';
const VITE_API_URL = 'https://interns-blog.nafistech.com/api';

export default defineComponent({
  name: 'Popup',
  props: {
    isVisible: Boolean,
  },
  emits: ['update:isVisible'],
  setup(props, { emit }) {
    const showNotification = ref(false);
    const notificationMessage = ref('');
    const showConfirmation = ref(false);
    const confirmationMessage = ref('');
    const titleInput = ref('');
    const contentInput = ref('');

    const handleArticleSubmit = async (event: Event) => {
      event.preventDefault();
      if (!titleInput.value || !contentInput.value) {
        showNotification.value = true;
        notificationMessage.value = 'Please fill in all fields.';
        return;
      }
      const article = {
        title: titleInput.value,
        content: contentInput.value,
      };
      try {
        await axios.post(`${VITE_API_URL}/posts`, article);
        showNotification.value = true;
        notificationMessage.value = 'Article submitted successfully!';
        confirmationMessage.value = 'Your article has been submitted successfully!';
        showConfirmation.value = true;
        titleInput.value = '';
        contentInput.value = '';
        closePopup();
      } catch (error) {
        showNotification.value = true;
        notificationMessage.value = 'An error occurred while submitting the article. Please try again.';
        console.error('Error submitting article:', error);
      }
    };

    const closePopup = () => {
      emit('update:isVisible', false);
    };

    return {
      showNotification,
      notificationMessage,
      showConfirmation,
      confirmationMessage,
      titleInput,
      contentInput,
      handleArticleSubmit,
      closePopup,
    };
  },
});
</script>

<template>
  <div class="popup-overlay" v-if="isVisible" @click.self="closePopup">
    <Notification v-if="showNotification" :message="notificationMessage" @close="showNotification = false" />

    <div class="popup-content">
      <button class="close-btn" @click="closePopup">X</button>
      <h3>Add Your Own Story</h3>
      <p>Here you Can add your Own article.</p>
      <form @submit="handleArticleSubmit" class="form">
        <div class="form-group">
          <label for="Title" class="form__label">Title</label>
          <input type="text" placeholder="Title" class="form__input" id="Title" v-model="titleInput"/>
        </div>
        <div class="form-group">
          <label for="Content" class="form__label">Content</label>
          <textarea placeholder="Content" class="form__input" id="Content" v-model="contentInput"></textarea>
        </div>
        <button type="submit" class="form__submit-btn">Submit</button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.popup-content {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  position: relative;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #f44336;
  border: none;
  color: #fff;
  border-radius: 50%;
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
}

h3 {
  margin-top: 0;
}

.form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 15px;
}

.form__label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

.form__input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form__input:focus {
  border-color: #007bff;
  outline: none;
}

.form__submit-btn {
  background: #007bff;
  color: #fff;
  border: none;
  padding: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.form__submit-btn:hover {
  background: #0056b3;
}
</style>
