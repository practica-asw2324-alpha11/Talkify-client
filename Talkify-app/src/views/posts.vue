<template>
  <div class="container">
    <h1>Talkify</h1>

    <div class="sub-navbar">
      <div>
        <router-link @click.prevent="fetchPosts('top')">Top</router-link>
        <router-link @click.prevent="fetchPosts('newest')">Newest</router-link>
        <router-link @click.prevent="fetchPosts('commented')">Commented</router-link>
      </div>
      <div class="dropdown">
    <el-select v-model="selectedOption" placeholder="Select an option" size="mini" @change="handleDropdownChange">
      <el-option label="All" value=""></el-option>
      <el-option label="Links" value="links"></el-option>
      <el-option label="Threads" value="threads"></el-option>
    </el-select>
  </div>
    </div>
      
    <div v-for="post in posts" :key="post.id">
      <postbox :post="post" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { ElSelect, ElOption } from 'element-plus';
import postbox from './postbox.vue'; 



const selectedOption = ref('all');





const handleDropdownChange = async (value) => {
  await fetchPosts(currentSort, value); 
};

const posts = ref([])
const api = inject('axios')

onMounted(async () => {
    await fetchPosts("top", "all"); 
})



const fetchPosts = async (sortBy, filter) => {
  try {
    currentSort = sortBy;
    const response = await api.get('posts', {
      params: {
        sort_by: sortBy,
        filter: filter
      }
    });
    posts.value = response.data.posts;
    console.log(posts.value)
  } catch (error) {
    console.error(error);
  }
}

let currentSort = 'top';

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

.dropdown .el-select .el-input {
  background-color: hsla(160, 100%, 37%, 1);
  color: rgb(21, 3, 108);
}
</style>
