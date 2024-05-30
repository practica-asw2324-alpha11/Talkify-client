<template>
    <div class="wotitem">
      <el-row>
        <!-- botones upvote/downvote -->
        <el-col class="post-header" :span="3">
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
        </el-col>
        <!-- contenido del post -->
        <el-col :span="18">
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
                <router-link v-if="post && post.magazine" :to="{ name: 'magazine', params: {id: post.magazine.id}}">
                  <strong> {{ post.magazine ? post.magazine.title : 'Unknown Magazine' }}</strong>
                </router-link>
              </p>
            </div>
            <div class="activity">
              <router-link :to="'/post/' + post.id">comments ({{ post.comments_count }})  </router-link>
              <span @click="post.is_boosted ? unboost(post.id) : boost(post.id)">
                {{ post.is_boosted ? 'unboost' : 'boost' }}
              </span>    
            </div>
            <div v-if="focus">
              <span>{{ post.body }}</span>
            </div>
          </div>
        </el-col>
        <!-- Botones acción -->
        <el-col :span="3">
          <div v-if="focus" class="post-actions">
            <el-button v-if="isOwner" class="btn-primary btn-rectangular" @click="toggleEditMode">Editar</el-button>
            <el-button v-if="isOwner" class="btn-danger btn-rectangular" @click="deletePost">Eliminar</el-button>
          </div>
        </el-col>
      </el-row>
        
        <!-- Form edit post -->
      <hr v-if="isEditing" style="margin-top: 20px; border-color: rgba(0, 0, 0, 0.5);" >
      <el-row v-if="isEditing">
        <div  class="edit-form-container">
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
            <el-row>
              <el-col style="display: flex; justify-content: flex-end" >
                <el-button type="submit" class="btn btn-secondary btn-rectangular" @click="updatePost">Guardar Cambios</el-button>
                <el-button type="button" class="btn btn-secondary btn-rectangular" @click="toggleEditMode">Cancelar</el-button>
              </el-col>
            </el-row>
          </form>
        </div>
      </el-row>
    </div>
  </template>
  
  <script setup>
import { onMounted, ref, inject, defineEmits, computed } from 'vue';
  import { ElButton, ElIcon } from 'element-plus';
  import { useRouter, useRoute } from 'vue-router';
  
  const isEditing = ref(false)
  const formData = ref({ title: '', url: '', body: '', magazine_id: null })
  const router = useRouter();
  const api = inject('axios');
  const route = useRoute();
  const emit = defineEmits();

  const magazines = ref([])

  const focus = ref(false)

  const props = defineProps({
    post: {
      type: Object,
      required: false
    }
  })

  const post = ref({})



const isOwner = computed(() => {
  const localStorageUserId = localStorage.getItem('selectedUser');
  const postUser = post.value ? post.value.user : null;
  const userIdFromPost = postUser ? String(postUser.id) : null;
  console.log(localStorageUserId)
  console.log(userIdFromPost)
  return localStorageUserId === userIdFromPost;
});

  
  const upvote = async (postId) => {
    try {
      let response = await api.post(`posts/${postId}/upvote`)
      post.value = response.data.post;
    } catch (error) {
      console.error(error)
    }
  }
  
  const downvote = async (postId) => {
    try {
      let response = await api.post(`posts/${postId}/downvote`)
      post.value = response.data.post;
    } catch (error) {
      console.error(error)
    }
  }
  
  const boost = async (postId) => {
    try {
      let response = await api.post(`posts/${postId}/boost`)
      post.value = response.data.post;

    } catch (error) {
      console.error(error)
    }
  }
  
  const unboost = async (postId) => {
    try {
      let response = await api.delete(`posts/${postId}/boost`)
      post.value = response.data.post;

      if(route.path === '/profile') {
        emit('unboost-post', post.value)
      }

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
      magazine_id: post.value.magazine ? post.value.magazine.id : null,
    }
  }
}





const updatePost = async () => {
  try {
    let payload = {
      title: formData.value.title,
      url: post.value.link ? formData.value.url : null,
      body: formData.value.body,
      magazine_id: formData.value.magazine_id,
    }
    await api.put(`posts/${route.params.id}`, payload)
    await fetchPost()
    isEditing.value = false
    focus.value = true
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

    let res = await api.get(`magazines/`);
    magazines.value = res.data

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
    align-items: start;
  }
  
  .vote-el-buttons .el-button {
    display: flex;
    flex-direction: column;
    align-items: center; 
  }
  
  .icon-container {
    margin: 10px 0; /* Añade un margen en la parte superior e inferior */
  }

  .wotitem {
  border: 2px solid #3d3c3d;
  margin: 20px auto;
  padding: 1em;
  width: 90%;
  background-color: #3d3c3d;
  border-color: #4a4a4a;
  position: relative;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px; /* Espacio entre los botones */
}

.el-button.btn-primary {
  background-color: #000;
  color: #fff;
  border: 1px solid #000;
  padding: 10px 20px;
  border-radius: 0;
}

.el-button.btn-danger {
  background-color: #000;
  color: #fff;
  border: 1px solid #000;
  padding: 10px 20px;
  border-radius: 0;
}

.el-button:hover {
  background-color: #333;
}

.edit-form-container {
  background-color: #2a2929;
  padding: 20px;
  margin: 20px auto;
  width: 90%;
  border: 2px solid #4a4a4a;
  border-radius: 5px;
}

.form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
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
  