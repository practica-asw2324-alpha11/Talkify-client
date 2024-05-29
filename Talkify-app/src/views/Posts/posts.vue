<template>
  <div class="container">

    <div>
      <el-row class="sub-navbar wotitem">
        <el-col :span="10" style="display:flex;">
          <el-button class="btn btn-secondary btn-rectangular" @click.prevent="fetchPosts('top', 'all')">Top</el-button>
          <el-button class="btn btn-secondary btn-rectangular" @click.prevent="fetchPosts('newest', 'all')">Newest</el-button>
          <el-button class="btn btn-secondary btn-rectangular" @click.prevent="fetchPosts('commented', 'all')">Commented</el-button>
        </el-col>
        <el-col :span="5" style="display: flex; justify-content: flex-end;">
          <div class="dropdown" >
            <el-select v-model="selectedOption" placeholder="Select an option"   suffix-icon= "Filter" @change="handleDropdownChange" color="rgb(0,0,0)"  >
              <el-option label="All" value=""></el-option>
              <el-option label="Links" value="links"></el-option>
              <el-option label="Threads" value="threads"></el-option>
            </el-select> 
          </div>
        </el-col>
      </el-row>
    </div>
      
    <div v-for="post in posts" :key="post.id">
      <postbox :post="post"/>
    </div>
  </div>
</template>

<script setup>

import { onMounted, ref, inject } from 'vue'
import { ElSelect, ElOption, ElIcon, ElInput} from 'element-plus';
import postbox from '../../components/Posts/postbox.vue'; 

const selectedOption = ref('all');

const handleSortChange = (sortBy) => {
  fetchPosts(sortBy, 'all');
}

const handleDropdownChange = async (value) => {
  await fetchPosts(currentSort, value); 
};

const posts = ref([])
const api = inject('axios')

onMounted(async () => {
    await fetchPosts("newest", "all"); 
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

let currentSort = 'newest';

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
  margin: 10px ; /* Añade un margen en la parte superior e inferior */
}

.el-select-dropdown__item:hover {
  background-color:#6a9c7a;
  color-scheme: rgb(0, 0, 0);
  color-scheme: rgb(0,0,0);
}
.btn-secondary {
  background-color: #444;
  color: #fff;
  border: 1px solid #444;
}

.btn-secondary:hover {
  background-color: #666;
}
.sub-navbar button {
    color: #fff;
    text-decoration: none;
    padding: 8px 12px;
    transition: background-color 0.3s ease;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .sub-navbar button:hover {
    background-color: #555;
  }
</style>
