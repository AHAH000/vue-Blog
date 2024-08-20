<script setup lang="ts">
import NavBar from '@/components/NavBar.vue';
import { isAuthenticated } from '@/auth';
</script>

<template>
  <div class="NavBar">
    <NavBar></NavBar>
  </div>
  

<div class="LandPage">
  <div class="img">
    <h2>Welcome To Blog</h2>
    <!-- <img src="../assets/images/Blog.jpg" alt="Blog"> -->
    <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Libero nemo aut dignissimos consequatur asperiores exercitationem, quibusdam deleniti et, nobis facere ut veritatis, 
      architecto quaerat laboriosam vel provident reprehenderit totam perspiciatis?</p>
      <router-link to="/PostFind" v-if="isAuthenticated">
        <button class="btn">Continue Reading</button>
      </router-link>
      <router-link to="/LoginView" v-if="!isAuthenticated">
        <button class="btn">Start Now</button>
      </router-link>
  </div>
</div>
</template>

<style scoped>
/* Overall container styling */
.NavBar{
  z-index: 100px;
}
.LandPage {
  position: relative;
  min-height: 100vh; /* Ensure the container covers full viewport height */
  background: url('../assets/images/Blog.jpg') no-repeat center center;
  background-size: cover; /* Cover the entire container with the background image */
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff; /* White text color for better contrast against the background */
  text-align: center;
  padding-top: 60px; /* Add padding to account for NavBar height */
}

/* Overlay for text and button to enhance readability */
.LandPage::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Dark overlay with opacity */
  z-index: 1;
}

/* Container for text and button */
.img {
  position: relative;
  z-index: 2;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.3); /* Slightly dark background for better text contrast */
  border-radius: 8px;
  max-width: 90%;
}

.img h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.img p {
  font-size: 1rem;
  margin: 1rem 0;
  line-height: 1.6; /* Increase line height for better readability */
}

.btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  color: #fff;
  background-color: #007bff; /* Bootstrap primary color */
  border: none;
  border-radius: 21px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.btn:hover {
  background-color: #0056b3; /* Darker shade for hover effect */
  transform: scale(1.05); /* Slightly enlarge button on hover */
}

/* Ensure NavBar is visible and on top */
.NavBar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10; /* Higher z-index to ensure it's above the background image */
  background-color: rgba(255, 255, 255, 0.8); /* Slightly transparent background for NavBar */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Light shadow for NavBar */
}
</style>


