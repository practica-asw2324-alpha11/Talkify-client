<template>
  <div>
    <navbar></navbar>
    <div id="post" class="wotitem">
      <postbox :post="post" />
      <div class="post-body">
        {{ post.body }}
      </div>
      <div class="post-actions">
        <el-button class="btn-primary btn-rectangular" @click="toggleEditMode">Editar</el-button>
        <el-button class="btn-danger btn-rectangular" @click="deletePost">Eliminar</el-button>
      </div>
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

    <div id="comments">
      <Comment v-for="comment in comments" :key="comment.id" :comment="comment" />
    </div>

    
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Comment from './comment.vue'
import postbox from './postbox.vue'
import navbar from './navbar.vue'
import { ElButton } from 'element-plus'

const post = ref({})
const comments = ref([])
const isEditing = ref(false)
const formData = ref({ title: '', url: '', body: '', magazine_id: null })
const magazines = ref([])
const api = inject('axios')
const route = useRoute()
const router = useRouter()


const fetchPost = async () => {
  try {
    let response = await api.get(`posts/${route.params.id}`)
    post.value = response.data.post

    let res = await api.get(`posts/${route.params.id}/comments`)
    comments.value = res.data

    let magResponse = await api.get(`magazines`)
    magazines.value = magResponse.data
  } catch (error) {
    console.error(error)
  }
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

onMounted(async () => {
  await fetchPost()
})
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
