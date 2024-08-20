  
  <script setup lang="ts">
  import { useRoute } from 'vue-router';
  import { ref, watch } from 'vue';
  import { isAuthenticated } from '@/auth';  
  import router from '@/router';
  
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

  <nav v-if="!isFolded">
    <ul class="left">
      <li :class="{ active: route.path === '/' }">
        <router-link to="/">Home</router-link>
      </li>
      <li :class="{ active: route.path === '/about' }">
        <router-link to="/about">About</router-link>
      </li>
      <li :class="{ active: route.path === '/PostFind' }">
        <router-link to="/PostFind">Articles</router-link>
      </li>
    </ul>
    <ul class="right">
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
    background: #f4f1ea; /* Soft beige background */
    width: 100vw;
    top: 0;
    left: 0;
    position: fixed;
    padding: 0 2em;
    box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
    border-bottom: 2px solid #07358c; /* Burnt orange accent */
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 60px;
  }
  
  ul {
    list-style: none;
    display: flex;
    padding: 0;
    margin: 0;
  }
  
  ul.left, ul.right {
    display: flex;
    margin: 0;
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
    color: #333333; /* Dark charcoal text */
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
    color: #333333;
    cursor: pointer;
    font-size: 1.2em;
    display: flex;
    align-items: center;
    transition: color 0.3s, background-color 0.3s;
  }
  
  .logout-btn:hover {
    background-color: #6a8caf; /* Muted blue on hover */
    color: #ffffff; /* White text on hover */
    border-radius: 5px;
  }
  
  
</style>