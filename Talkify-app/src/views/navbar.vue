<template>
    <div>
      <header>
        <div class="top-nav">
          <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div>
              <router-link to="/">
                <img src="../assets/Talkify_logo-transformed.png" alt="Talkify" width="100">
              </router-link>
            </div>
            <menu class="head-nav__menu">
              <li><router-link to="/">Threads</router-link></li>
              <li><router-link to="/magazines">Magazines</router-link></li>
            </menu>
            <div class="navbar-icons">
                <el-input v-model="searchQuery" placeholder="Buscar..." :prefix-icon="searchIcon" @keyup.enter="handleSearch" :class="['dark-mode']" style="margin-right: 60px;"> </el-input>              
                <el-select v-model="selectedOption" placeholder="New" suffix-icon= "Plus" @change="handleNewPost" :class="['dark-mode']">
                <el-option value="link">Add new link</el-option>
                <el-option value="thread">Add new thread</el-option>
                <el-option value="magazine">Add new magazine</el-option>
              </el-select>
              <div class="dropdown">
                <!-- Aquí va el contenido del user dropdown -->
              </div>
            </div>
          </nav>
        </div>
      </header>
  
      <router-view></router-view>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { ElSelect, ElOption, ElIcon, ElInput} from 'element-plus';
  import { Search } from '@element-plus/icons-vue'


  const searchIcon = Search 


  const searchQuery = ref('');
  const selectedOption = ref('');
  const router = useRouter();

  const handleNewPost = (type) => {
  router.push({ name: 'newpost', params: { type } });
};

  const handleSearch = () => {
  router.push({ name: 'search', query: { query: searchQuery.value } });
};
  </script>
  
  <style scoped>

.el-select-dropdown__item.selected {
  font-weight: normal;
  color: #000;
}

.el-select-dropdown__item.selected.hover,
.el-select-dropdown__item.selected:hover {
  background-color: #6a9c7a;
  color: #000;
}
</style>
  