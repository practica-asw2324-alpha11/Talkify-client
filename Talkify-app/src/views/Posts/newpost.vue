<template>
    <div>
      <div class="sub-navbar">
        <div style="font-size: 18px; margin-left: 80px;">
          <a href="#" @click.prevent="selectedPostType = 'link'" :class="{ 'active': selectedPostType === 'link' }">Link</a>
          <a href="#" @click.prevent="selectedPostType = 'thread'" :class="{ 'active': selectedPostType === 'thread' }">Thread</a>
          <a href="#" @click.prevent="goToNewMagazine" :class="{ 'active': selectedPostType === 'magazine' }">Magazine</a>
        </div>
      </div>
      <div class="wotitem">
        <h2>Crear Nueva Publicación</h2>
        <form @submit.prevent="createPost">
          <div class="form-group">
            <label for="title">Título:</label>
            <input type="text" v-model="formData.title" id="title" class="form-control" required />
          </div>
          <div class="form-group" v-if="selectedPostType === 'link'">
            <label for="link-url">URL del Enlace:</label>
            <input type="text" v-model="formData.url" id="link-url" class="form-control" required />
          </div>
          <div class="form-group">
            <label for="thread-body">Contenido:</label>
            <textarea v-model="formData.body" id="thread-body" class="form-control" rows="5" required></textarea>
          </div>
          <div class="form-group">
            <label for="magazine">Magazine:</label>
            <select v-model="formData.magazine_id" id="magazine" class="form-control">
              <option v-for="magazine in magazines" :key="magazine.id" :value="magazine.id">{{ magazine.name }}</option>
            </select>
          </div>
          <div class="form-group text-right">
            <el-button type="submit" class="btn btn-secondary btn-rectangular" @click="createPost">Crear Publicación</el-button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, inject, onMounted } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import { ElButton } from 'element-plus'
  
  const selectedPostType = ref('link')
  const formData = ref({ title: '', url: '', body: '', magazine_id: null })
  const magazines = ref([])
  const api = inject('axios')
  const router = useRouter()
  const route = useRoute()
  
  onMounted(() => {
    const type = route.params.type
    if (type) {
      selectedPostType.value = type
    }
    fetchMagazines()
  })
  
  const fetchMagazines = async () => {
    try {
      let magResponse = await api.get(`magazines`)
      magazines.value = magResponse.data
    } catch (error) {
      console.error(error)
    }
  }
  
  const createPost = async () => {
    try {
      let payload = {
        title: formData.value.title,
        url: selectedPostType.value === 'link' ? formData.value.url : null,
        body: formData.value.body,
        magazine_id: formData.value.magazine_id,
      }
      await api.post(`posts`, payload)
      router.push("/")
    } catch (error) {
      console.error(error)
    }
  }

  const goToNewMagazine = () => {
    router.push('/newmagazine')
  }
  </script>
  
  <style scoped>
  .wotitem {
    border: 2px solid #3d3c3d;
    margin: 20px auto;
    padding: 1em;
    width: 90%;
    background-color: #3d3c3d;
    border-color: #4a4a4a;
    position: relative;
  }
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    background-color: #1c1c1c;
    border: 1px solid #373737;
    color: #cacece;
    font-size: 1rem;
  }
  
  .btn-secondary {
    background-color: #444;
    color: #fff;
    border: 1px solid #444;
  }
  
  .btn-secondary:hover {
    background-color: #666;
  }
  </style>
  