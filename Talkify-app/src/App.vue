<template>
  <div id="app">
    <main>
      <navbar/>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
import navbar from './views/navbar.vue';
import 'element-plus/theme-chalk/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
</script>

<style>
html, body, #app {
  height: 100%;
  width: 100%;
  margin: 0;
  padding: 0;
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh; 
  width: 100%;
}

header, main {
  width: 100%;
}

main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

</style>
