<template>
  <footer class="footer">
    <div class="waves">
      <div class="wave" id="wave1"></div>
      <div class="wave" id="wave2"></div>
      <div class="wave" id="wave3"></div>
      <div class="wave" id="wave4"></div>
    </div>
    <ul class="social-icon">
      <li class="social-icon__item">
        <a class="social-icon__link" href="#">
          <ion-icon name="logo-facebook"></ion-icon>
        </a>
      </li>
      <li class="social-icon__item">
        <a class="social-icon__link" href="#">
          <ion-icon name="logo-twitter"></ion-icon>
        </a>
      </li>
      <li class="social-icon__item">
        <a class="social-icon__link" href="#">
          <ion-icon name="logo-linkedin"></ion-icon>
        </a>
      </li>
      <li class="social-icon__item">
        <a class="social-icon__link" href="#">
          <ion-icon name="logo-instagram"></ion-icon>
        </a>
      </li>
    </ul>
    <ul class="menu">
      <li class="menu__item"><a class="menu__link" href="#">Home</a></li>
      <li class="menu__item"><a class="menu__link" href="#">About</a></li>
      <li class="menu__item"><a class="menu__link" href="#">Article</a></li>
    </ul>
  </footer>
</template>

<script setup lang="ts">
import { IonIcon } from '@ionic/vue';
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  display: flex;
  background: #333;
  justify-content: flex-end;
  align-items: flex-end;
  min-height: 100vh;
}

.footer {
  position: relative;
  width: 100%;
  background: #3586ff;
  min-height: 60px; /* Reduced min-height */
  padding: 10px 30px; /* Reduced padding */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}

.social-icon,
.menu {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 5px 0; /* Reduced margin */
  flex-wrap: wrap;
}

.social-icon__item,
.menu__item {
  list-style: none;
}

.social-icon__link {
  font-size: 1.5rem; /* Reduced font-size */
  color: #fff;
  margin: 0 8px; /* Reduced margin */
  display: inline-block;
  transition: 0.5s;
}
.social-icon__link:hover {
  transform: translateY(-5px); /* Reduced transform distance */
}

.menu__link {
  font-size: 1rem; /* Reduced font-size */
  color: #fff;
  margin: 0 8px; /* Reduced margin */
  display: inline-block;
  transition: 0.5s;
  text-decoration: none;
  opacity: 0.75;
  font-weight: 300;
}

.menu__link:hover {
  opacity: 1;
}

.footer p {
  color: #fff;
  margin: 10px 0 5px 0; /* Adjusted margins */
  font-size: 0.9rem; /* Reduced font-size */
  font-weight: 300;
}

.wave {
  position: absolute;
  top: -50px; /* Adjusted top position */
  left: 0;
  width: 100%;
  height: 50px; /* Reduced height */
  background: url('https://i.ibb.co/wQZVxxk/wave.png');
  background-size: 1000px 50px; /* Adjusted background-size */
}

.wave#wave1 {
  z-index: 1000;
  opacity: 1;
  bottom: 0;
  animation: animateWaves 4s linear infinite;
}

.wave#wave2 {
  z-index: 999;
  opacity: 0.5;
  bottom: 5px; /* Adjusted bottom position */
  animation: animate 4s linear infinite !important;
}

.wave#wave3 {
  z-index: 1000;
  opacity: 0.2;
  bottom: 10px; /* Adjusted bottom position */
  animation: animateWaves 3s linear infinite;
}

.wave#wave4 {
  z-index: 999;
  opacity: 0.7;
  bottom: 15px; /* Adjusted bottom position */
  animation: animate 3s linear infinite;
}

@keyframes animateWaves {
  0% {
    background-position-x: 1000px;
  }
  100% {
    background-position-x: 0px;
  }
}

@keyframes animate {
  0% {
    background-position-x: -1000px;
  }
  100% {
    background-position-x: 0px;
  }
}
</style>
