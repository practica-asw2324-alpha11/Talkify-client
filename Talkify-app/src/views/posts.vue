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
        <div class="vote-buttons">
          <button @click="upvote(post.id)" :class="{ 'upvoted': post.upvoted }" class="vote">
            <span>{{ post.upvotes_count }} &nbsp;</span>
            <i class="fas fa-arrow-up"></i>
          </button>
          <button @click="downvote(post.id)" :class="{ 'downvoted': post.downvoted }" class="vote">
            <span>{{ post.downvotes_count }} &nbsp;</span>
            <i class="fas fa-arrow-down"></i>
          </button>
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
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped>

</style>
