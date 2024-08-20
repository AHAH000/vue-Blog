import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { isAuthenticated } from './auth'
import App from './App.vue'
import router from './router'
import axios from 'axios'

const app = createApp(App)

app.use(createPinia())
app.use(router)

const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  isAuthenticated.value = true; // Set the auth state to true
}

app.mount('#app')
