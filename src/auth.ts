import axios from 'axios';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
// import Notification from '@/components/Notification.vue';
import router from '@/router';
// const showNotification = ref(false);
// const notificationMessage = ref('');
export const isAuthenticated = ref<boolean>(false);

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  isAuthenticated.value = true;
}

export const showAlreadyLogged = () => {
//   notificationMessage.value = 'You are already logged';
//   showNotification.value = true;
  router.push('/');
};