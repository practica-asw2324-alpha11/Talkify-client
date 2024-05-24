<template>
    <div class="search-results-container">
      <navbar></navbar>
      <div class="wotbody">
        <div v-for="post in posts" :key="post.id">
            <postbox :post="post" />
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, inject } from 'vue'
  import { useRoute } from 'vue-router'
  import postbox from './postbox.vue'
  import navbar from './navbar.vue'; 


  
  const route = useRoute()
  const query = ref(route.query.query || '') 
  const posts = ref([])
  const api = inject('axios')
  const loading = ref(false)
  const error = ref(null)
  
  const searchPosts = async () => {
  try {
    loading.value = true
    const response = await api.get('posts/search', { params: { query: query.value } })
    console.log(response)
    posts.value = response.data // Asignando directamente response.data
    console.log(posts.value)
  } catch (err) {
    console.error('Error fetching posts:', err)
    error.value = true
  } finally {
    loading.value = false
  }
}
  
  // Realizar búsqueda cada vez que se monta el componente o cambia la consulta
  onMounted(() => {
    if (query.value) {
      searchPosts()
    }
  })
  </script>
  
  <style scoped>
  /* Estilos específicos para la página de resultados de búsqueda */
  .loader {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 30px;
    height: 30px;
    animation: spin 2s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  </style>
  