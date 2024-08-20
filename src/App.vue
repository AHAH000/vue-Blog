<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import FooterBar from './components/Footer.vue'
</script>

<template>
  <div class="layout">
    <header>
      <NavBar/>
    </header>

    <main>
      <RouterView/>
    </main>

    <footer>
      <FooterBar/>
    </footer>
  </div>
</template>

<style scoped>
/* Ensure full height of the page and proper positioning */
html, body, #app {
  height: 100%;
  margin: 0;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

main {
  flex: 1;
}
</style>
