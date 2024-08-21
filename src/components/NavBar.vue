<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
import { isAuthenticated } from '@/auth';  
import Popup from './Popup.vue';
import router from '@/router';
const showPopup = ref(false);
const route = useRoute();
const isAuth = ref(isAuthenticated.value);
const isFolded = ref(false);

watch(() => isAuthenticated.value, (newVal) => {
  isAuth.value = newVal;
});

const logout = () => {
  localStorage.removeItem('token');
  isAuthenticated.value = false;
  router.push('/LoginView');
};

const toggleNavBar = () => {
  isFolded.value = !isFolded.value;
};
</script>

<template>
  <div class="controlBtn">
    <button @click="toggleNavBar">
      
    </button>
  </div>
  <nav>
    <ul class="left">
      <li :class="{ active: route.path === '/' }">
        <router-link to="/">Home</router-link>
      </li>
      <li :class="{ active: route.path === '/about' }">
        <router-link to="/about">About</router-link>
      </li>
      <li :class="{ active: route.path === '/PostList' }">
        <router-link to="/PostList">Articles</router-link>
      </li>
    </ul>
    <ul class="right">
      <li v-if="isAuth" >
        <button @click="showPopup=true" class="logout-btn">
          <i class="fa fa-pen-nib" aria-hidden="true"></i> Write
        </button>
        <Popup v-model:isVisible="showPopup" />
      </li>
      <li v-if="isAuth" :class="{ active: route.path === '/LoginView' }">
        <button @click="logout" class="logout-btn">
          <i class="fa fa-sign-out" aria-hidden="true"></i> Log Out
        </button>
      </li>
      <li v-else :class="{ active: route.path === '/LoginView' }">
        <router-link to="/LoginView">
          <i class="fa fa-sign-in" aria-hidden="true"></i> Log In
        </router-link>
      </li>
      <li v-if="!isAuth" :class="{ active: route.path === '/RegisterView' }">
        <router-link to="/RegisterView">
          <i class="fa fa-user-plus" aria-hidden="true"></i> Register
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css');

nav {
  background: linear-gradient(-45deg, #e4e4ca, #124192, #d7d7c3, #083646);
    background-size: 400% 400%;
  animation: myGradient 12s infinite;
  width: 100vw;
  top: 0;
  left: 0;
  position: fixed;
  padding: 0 2em;
  box-shadow: 3px 3px 20px #031403;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  transition: background-color 0.5s;
}

@keyframes myGradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

ul {
  list-style: none;
  display: flex;
  padding: 0;
  margin: 0;
}

ul.left, ul.right {
  display: flex;
}

ul.right {
  margin-left: auto;
}

li {
  margin: 0 1.5em;
  display: flex;
  align-items: center;
}

a, button {
  color: #fff;
  text-decoration: none;
  font-weight: bold;
  padding: 0.5em 1em;
  display: flex;
  align-items: center;
  transition: color 0.3s, background-color 0.3s;
}

a:hover, button:hover {
  color: #ffffff; /* White text on hover */
    background-color: #6a8caf; /* Muted blue background on hover */
    border-radius: 5px;
}

li.active a, li.active button {
  background-color: #07358c; /* Burnt orange background for active items */
  color: #ffffff; /* White text for active items */
  border-radius: 5px;
}

.logout-btn {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1.2em;
  display: flex;
  align-items: center;
}

.logout-btn:hover {
  background-color: #6a8caf; /* Muted blue on hover */
  color: #ffffff; /* White text on hover */
  border-radius: 5px;
}

@media(max-width: 767px) {
  nav {
    padding: 0;
    height: auto;
  }
  
  ul {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
