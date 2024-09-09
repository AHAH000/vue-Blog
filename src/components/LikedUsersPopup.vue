<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

const props = defineProps<{
  show: boolean;
  users: Array<{ id: number; name: string }>;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const close = () => {
  emit('close');
};
</script>

<template>
  <transition name="fade">
    <div v-if="show" class="liked-users-popup">
      <div class="popup-content">
<h3>{{ users.length > 0 ? 'Liked by:' : 'Not Liked Yet' }}</h3>
        <ul >
          <li v-for="user in users" :key="user.id">
            {{ user.name }}
          </li>
        </ul>
        <button @click="close" class="close-popup-btn">Close</button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.liked-users-popup {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7); /* Darker overlay for better contrast */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.4s ease-in-out; /* Slightly longer fade-in */
}

.popup-content {
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  max-width: 500px; /* Increased max-width */
  width: 90%; /* More responsive width */
  text-align: center;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3); /* More pronounced shadow */
  animation: slideIn 0.4s ease-in-out; /* Slightly longer slide-in */
}

.popup-content h3 {
  margin: 0 0 15px;
  font-size: 1.8em; /* Larger title font size */
  color: #222; /* Darker text color for better readability */
}

.popup-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-size: 1.2em; /* Slightly larger font size for better readability */
  line-height: 1.6; /* Improved line height */
}

.popup-content li {
  padding: 10px 0; /* Increased padding for better spacing */
  border-bottom: 1px solid #ddd; /* Lighter border color */
}

.popup-content li:last-child {
  border-bottom: none;
}

.close-popup-btn {
  margin-top: 20px;
  padding: 12px 25px;
  background-color: #193bad; 
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease;
}

.close-popup-btn:hover {
  background-color: #1154a1; 
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); 
}

.close-popup-btn:active {
  transform: scale(0.95);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-30px); /* Slightly larger movement */
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}

.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
