<template>
    <div class="wotitem">
      <div class="post-header">
        <div class="vote-el-buttons">
          <el-button type="primary" @click="upvote(post.id)" class="vote" :style="{ color: post.is_upvoted ? 'green' : '' }">
            <span>{{ post.upvotes_count }} &nbsp;</span>
            <el-icon><Top /></el-icon>
          </el-button>
          <br>
          <el-button type="primary" @click="downvote(post.id)" class="vote" :style="{ color: post.is_downvoted ? 'red' : '' }">
            <span>{{ post.downvotes_count }} &nbsp;</span>
            <el-icon><Bottom /></el-icon>
          </el-button>
        </div>
      </div>
      <div class="post-content">
        <span class="first-part">
          <h2>
            <router-link :to="'/post/' + post.id" style="color: white;">{{ post.title }}</router-link>
            <span v-if="post.link" style="font-size: 14px;">
              (<a href="#" style="color: white;" @click.prevent="openExternalLink(post.url)">{{ post.url }}</a>)
            </span>
          </h2>
        </span>
        <div class="text-container" style="color:#cecece; font-size: 14px;">
          <p>
            <router-link v-if="post && post.user" :to="{ name: 'user', params: { id: post.user.id }}">
              <strong>{{ post.user ? post.user.full_name : 'Anonymous' }}</strong>
            </router-link>
            {{ timeAgo(post.created_at) }} ago to magazine 
            <strong>
              {{ post.magazine ? post.magazine.title : 'Unknown Magazine' }}
            </strong>
          </p>
        </div>
        <div class="activity">
          <router-link :to="'/post/' + post.id">comments ({{ post.comments_count }})  </router-link>
          <span @click="post.is_boosted ? unboost(post.id) : boost(post.id)">
            {{ post.is_boosted ? 'boost(1)' : 'boost' }}
          </span>    
        </div>
        <div v-if="focus">
          <span>{{ post.body }}</span>
        </div>
      </div>
      <div v-if="focus" class="post-actions">
        <el-button class="btn-primary btn-rectangular" @click="toggleEditMode">Editar</el-button>
        <el-button class="btn-danger btn-rectangular" @click="deletePost">Eliminar</el-button>
      </div>


    <div v-if="isEditing" class="edit-form-container">
      <h2>Editar Publicación</h2>
      <form @submit.prevent="updatePost">
        <div class="form-group">
          <label for="title">Title:</label>
          <input type="text" v-model="formData.title" id="title" class="form-control" required />
        </div>
        <div v-if="post.link" class="form-group">
          <label for="link-url">URL del Enlace:</label>
          <input type="text" v-model="formData.url" id="link-url" class="form-control" required />
        </div>
        <div class="form-group">
          <label for="thread-body">Contenido del Thread:</label>
          <textarea v-model="formData.body" id="thread-body" class="form-control" rows="5" required></textarea>
        </div>
        <div class="form-group">
          <label for="magazine">Magazine:</label>
          <select v-model="formData.magazine_id" id="magazine" class="form-control">
            <option v-for="magazine in magazines" :key="magazine.id" :value="magazine.id">{{ magazine.name }}</option>
          </select>
        </div>
        <div class="form-group text-right">
          <el-button type="submit" class="btn btn-secondary btn-rectangular">Guardar Cambios</el-button>
          <el-button type="button" class="btn btn-secondary btn-rectangular" @click="toggleEditMode">Cancelar</el-button>
        </div>
      </form>
    </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, inject } from 'vue';
  import { ElButton, ElIcon } from 'element-plus';
  import { useRouter, useRoute } from 'vue-router';
  
  const isEditing = ref(false)
  const formData = ref({ title: '', url: '', body: '', magazine_id: null })
  const router = useRouter();
  const api = inject('axios');
  const route = useRoute();

  const focus = ref(false)

  const props = defineProps({
    post: {
      type: Object,
      required: false
    }
  })

  const post = ref({})
  
  const upvote = async (postId) => {
    try {
      await api.post(`posts/${postId}/upvote`)
      router.go(0);
    } catch (error) {
      console.error(error)
    }
  }
  
  const downvote = async (postId) => {
    try {
      await api.post(`posts/${postId}/downvote`)
      router.go(0);
    } catch (error) {
      console.error(error)
    }
  }
  
  const boost = async (postId) => {
    try {
      await api.post(`posts/${postId}/boost`)
      router.go(0);
    } catch (error) {
      console.error(error)
    }
  }
  
  const unboost = async (postId) => {
    try {
      await api.delete(`posts/${postId}/boost`)
      router.go(0);
    } catch (error) {
      console.error(error)
    }
  }
  
  const openExternalLink = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  }
  
  const timeAgo = (time) => {
    const date = new Date(time)
    const now = new Date()
    const secondsPast = (now.getTime() - date.getTime()) / 1000
  
    if (secondsPast < 60) {
      return `${Math.round(secondsPast)} seconds`
    }
    if (secondsPast < 3600) {
      return `${Math.round(secondsPast / 60)} minutes`
    }
    if (secondsPast < 86400) {
      return `${Math.round(secondsPast / 3600)} hours`
    }
    return `${Math.round(secondsPast / 86400)} days`
  }

  const toggleEditMode = () => {
  isEditing.value = !isEditing.value
  if (isEditing.value) {
    formData.value = {
      title: post.value.title,
      url: post.value.link ? post.value.url : '',
      body: !post.value.link ? post.value.body : '',
      magazine_id: post.value.magazine_id || null,
    }
  }
}

const updatePost = async () => {
  try {
    let payload = {
      title: formData.value.title,
      url: post.value.link ? formData.value.url : null,
      body: !post.value.link ? formData.value.body : null,
      magazine_id: formData.value.magazine_id,
    }
    await api.put(`posts/${route.params.id}`, payload)
    await fetchPost()
    isEditing.value = false
  } catch (error) {
    console.error(error)
  }
}

const deletePost = async () => {
  try {
    await api.delete(`posts/${route.params.id}`)
    router.push("/")
  } catch (error) {
    console.error(error)
  }
}

const fetchPost = async () => {
  try {
    let response = await api.get(`posts/${route.params.id}`);
    post.value = response.data.post;
    console.log(post.value)
    console.log(post.value.user.id)

  } catch(error){
    console.error(error)
  }
}

onMounted(async () => {
  
  if(props.post) post.value = props.post
  else{
    await fetchPost()
    focus.value = true
  }


})
  </script>
  
  <style scoped>
  .wotitem {
    background-color: #333; /* Fondo oscuro */
    color: #fff; /* Texto blanco */
    display: flex;
    align-items: start;
  }
  
  .vote-el-buttons .el-button {
    display: flex;
    flex-direction: column;
    align-items: center; /* Centra los elementos horizontalmente */
    border-radius: 0;
    background-color: #111;
    border-color: #444;
    
  }
  
  .icon-container {
    margin: 10px 0; /* Añade un margen en la parte superior e inferior */
  }
  </style>
  