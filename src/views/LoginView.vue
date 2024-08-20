<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import Notification from '@/components/Notification.vue';
import type { Login } from '@/types/type';
import { useRouter } from 'vue-router';
import { isAuthenticated,showAlreadyLogged } from '@/auth';
import router from '@/router';
const VITE_API_URL = 'https://interns-blog.nafistech.com/api';

const emailInput = ref('');
const passwordInput = ref('');
const notificationMessage = ref('');
const showNotification = ref(false);

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};



if(isAuthenticated.value){
  showAlreadyLogged()
}
const submitLoginForm = async (event: Event) => {
  event.preventDefault(); // Prevent form from submitting normally

  if (!emailInput.value || !passwordInput.value) {
    showNotification.value = true;
    notificationMessage.value = 'Please fill in all fields.';
    return;
  }

  if (!validateEmail(emailInput.value)) {
    showNotification.value = true;
    notificationMessage.value = 'Please enter a valid email address.';
    return;
  }

  const user: Login = {
    email: emailInput.value,
    password: passwordInput.value,
  };

  try {
    const response = await axios.post(`${VITE_API_URL}/login`, user);
    const token = response.data.token;

    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      showNotification.value = true;
      notificationMessage.value = 'Login successful!';
      isAuthenticated.value = true;

      // Redirect to the previously saved route or default to home
      // const redirectTo = localStorage.getItem('redirectTo') || '/';
      // localStorage.removeItem('redirectTo');
      // router.push(redirectTo);
    router.push('/');
    } else {
      showNotification.value = true;
      notificationMessage.value = 'Login failed. Check your Credentials';
    }
  } catch (error) {
    showNotification.value = true;
    notificationMessage.value = 'Login failed. Check your Credentials';
  }
};

</script>


<template>
  <Notification v-if="showNotification" :message="notificationMessage" @close="showNotification = false" />

  <div class="container">
    <div class="center">
      <h1>Login</h1>
      <form @submit="submitLoginForm">
        <div class="txt_field">
          <input type="email" v-model="emailInput" />
          <span></span>
          <label>Email</label>
        </div>
        <div class="txt_field">
          <input type="password" v-model="passwordInput" />
          <span></span>
          <label>Password</label>
        </div>
        <button type="submit" class="LogBtn">Login</button>
        <div class="RouteRegister">
          Don’t have an account <router-link to="/RegisterView">Register here</router-link>
        </div>
      </form>
    </div>

    <div class="sideInfo">
      <img src="../assets/images/ToDoListImgUD.png" alt="To-Do List Benefits" class="sideInfo-image" />
      <div class="benefits-list">
        <h2>Why Use Blog</h2>
        <ul>
          <li>Keep Tracking of new information</li>
          <li>Meet new people</li>
          <li>Interact with people from same Community</li>
          <li>Boost productivity</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans:wght@700&family=Poppins:wght@400;500;600&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}

body {
  background: linear-gradient(135deg, #f4f1ea 0%, #d9c8b3 50%, #b0c4de 100%);
  height: 100vh;
  color: #262626; /* Dark charcoal text for contrast */
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 0 20px;
}

.center {
  background: #ffffff; /* White background for the form */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px;
  max-width: 600px;
  width: 100%;
}

.center h1 {
  text-align: center;
  padding: 20px 0;
  border-bottom: 1px solid #20344f; /* Subtle line to match the gradient */
  color: #333;
}

.center form {
  padding: 0 40px;
}

form .txt_field {
  position: relative;
  border-bottom: 2px solid #20344f; /* Light blue border */
  margin: 30px 0;
}

.txt_field input {
  width: 100%;
  padding: 10px 5px;
  height: 40px;
  font-size: 16px;
  border: none;
  background: none;
  color: #232323; /* Dark text for input fields */
  outline: none;
}

.txt_field label {
  position: absolute;
  top: 10px;
  left: 5px;
  color: #333;
  transform: translateY(-50%);
  font-size: 16px;
  pointer-events: none;
  transition: 0.5s;
}

.txt_field span::before {
  content: "";
  position: absolute;
  top: 40px;
  left: 0;
  width: 0%;
  height: 2px;
  background: #20344f; /* Light blue underline */
  transition: 0.5s;
}

.txt_field input:focus ~ label,
.txt_field input:valid ~ label {
  top: -5px;
  color: #20344f;
}

.txt_field input:focus ~ span::before,
.txt_field input:valid ~ span::before {
  width: 100%;
}

.LogBtn {
  width: 100%;
  height: 50px;
  background: #20344f; /* Light blue background */
  border-radius: 25px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  outline: none;
  transition: 0.5s;
  border: none;
  color: white;
}

.LogBtn:hover {
  background: #a1b8d1; /* Slightly darker blue on hover */
}

.RouteRegister {
  margin-top: 20px;
  color: #333;
  margin-bottom: 50px;
}

.RouteRegister a {
  color: #20344f;
  text-decoration: none;
}

.RouteRegister a:hover {
  text-decoration: underline;
}

.sideInfo {
  background: #ffffff; /* White background for side info */
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), inset 0 0 10px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(0, 0, 0, 0.1);
  color: #333;
  max-width: 400px;
  width: 100%;
  padding: 20px;
  text-align: left;
  margin-left: 100px;
  border-radius: 20px;
}

.sideInfo-image {
  width: 100%;
  border-radius: 10px;
}

.benefits-list h2 {
  margin-bottom: 10px;
  color: #333;
}

.benefits-list ul {
  list-style-type: disc;
  padding-left: 20px;
}

.benefits-list li {
  margin-bottom: 10px;
  transition: color 0.3s, background-color 0.3s;
  padding: 5px;
  border-radius: 5px;
}

.benefits-list li:hover {
  color: #07358c;
  background-color: rgba(176, 196, 222, 0.1);
}

</style>