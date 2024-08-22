<script setup lang="ts">
  import { ref, defineEmits, defineProps } from 'vue';
  
  const props = defineProps({
    message: {
      type: String,
      required: true
    },
    hasConfirm: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['confirm', 'cancel', 'close']);
  
  const visible = ref(true);
  
  const handleConfirm = () => {
    emit('confirm');
    visible.value = false;
  };
  
  const handleCancel = () => {
    emit('cancel');
    visible.value = false;
  };
  
  const handleClose = () => {
    emit('close');
    visible.value = false;
  };
  </script>



<template>
    <div v-if="visible" class="notification-overlay">
      <div class="notification-box">
        <p>{{ message }}</p>
        <button v-if="hasConfirm" @click="handleConfirm" class="btn btn-success">OK</button>
        <button v-if="hasConfirm" @click="handleCancel" class="btn btn-danger">Cancel</button>
        <button v-else @click="handleClose" class="btn btn-success">OK</button>
      </div>
    </div>
  </template>
  
  
  <style scoped>
  .notification-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6); /* Slightly lighter overlay */
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }
  
  .notification-box {
    background: #ffffff; /* White background for the notification */
    color: #333; /* Dark text for readability */
    padding: 30px 40px; /* Increased padding for larger box */
    border-radius: 15px; /* More rounded corners */
    text-align: center;
    border: 3px solid #b0c4de; /* Thicker border matching the theme */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3); /* Subtle shadow */
    max-width: 500px; /* Ensure it doesn’t get too wide */
    width: 100%; /* Full width up to the max-width */
  }
  
  .btn-success {
    background-color: #07358c; /* Dark blue background */
    color: white; /* White text for buttons */
    border: none;
    padding: 12px 24px; /* Increased padding for larger buttons */
    border-radius: 8px; /* Slightly more rounded corners */
    margin-right: 10px;
    cursor: pointer;
    font-size: 16px; /* Larger text */
  }
  
  .btn-success:hover {
    background-color: #a1b8d1; /* Slightly lighter blue on hover */
  }
  
  .btn-danger {
    background-color: #a71616; /* Light grey background for cancel button */
    color: white; /* White text for buttons */
    border: none;
    padding: 12px 24px; /* Increased padding for larger buttons */
    border-radius: 8px; /* Slightly more rounded corners */
    cursor: pointer;
    font-size: 16px; /* Larger text */
  }
  
  .btn-danger:hover {
    background-color: #921313; /* Slightly darker grey on hover */
  }
  </style>
  