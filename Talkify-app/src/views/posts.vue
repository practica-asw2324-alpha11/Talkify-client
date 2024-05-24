<template>
  <div class="container">
    <h1>Talkify</h1>

    <div class="sub-navbar">
      <div>
        <router-link @click="fetchPosts('top')">Top</router-link>
        <router-link  @click="fetchPosts('newest')">Newest</router-link>
        <router-link  @click="fetchPosts('commented')">Commented</router-link>
      </div>
      <div class="navbar-icons">
          

        
      </div>
    </div>

    <div v-for="post in posts" :key="post.id" class="wotitem">
      <div class="post-header">
        <div class="vote-el-buttons">
          <el-button type="primary" @click="upvote(post.id)" class="vote">
            <span>{{ post.upvotes_count }} &nbsp;</span>
            <el-icon><Top /></el-icon>
          </el-button :style="{ color: post.upvoted ? 'green' : '' }">
          <br>
          <el-button type="primary" @click="downvote(post.id)" class="vote">
            <span>{{ post.downvotes_count }} &nbsp;</span>
            <el-icon :style="{ color: post.downvoted ? 'red' : '' }"><Bottom /></el-icon>
          </el-button>
        </div>
      </div>
      <div class="post-content">
        <span class="first-part">
          <h2>
            <a :href="'/posts/' + post.id" style="color: white;">{{ post.title }}</a>
            <span v-if="post.link" style="font-size: 14px;">
              (<a :href="post.url" target="_blank" style="color: white;">{{ post.url }}</a>)
            </span>
          </h2>
        </span>
        <div>
          {{ post.body }}
        </div>
        <div class="activity">
          <a :href="`/post/${post.id}`"> comments ({{ post.comments_count }})</a>
          <span> boosts ({{ post.boosts }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'

const posts = ref([])
const api = inject('axios')

onMounted(async () => {
    await fetchPosts("top"); 
})

const upvote = async (postId) => {
  try {
    await api.post(`posts/${postId}/upvote`)
    await fetchPosts(); 
  } catch (error) {
    console.error(error)
  }
}

const downvote = async (postId) => {
  try {
    await api.post(`posts/${postId}/downvote`)
    await fetchPosts(); 


  } catch (error) {
    console.error(error)
  }
}

const fetchPosts = async (sortBy) => {
  try {
    const response = await api.get('posts', {
      params: {
        sort_by: sortBy
      }
    });
    posts.value = response.data;
    console.log(posts.value)
  } catch (error) {
    console.error(error);
  }
}
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
