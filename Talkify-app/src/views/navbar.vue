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
                <el-select v-model="selectedOption" placeholder="New" suffix-icon= "Plus" @change="handleNewPost" :class="['dark-mode']"style="margin-right: 60px;">
                <el-option value="link">Add new link</el-option>
                <el-option value="thread">Add new thread</el-option>
                <el-option value="magazine">Add new magazine</el-option>
            </el-select>
              <div class="dropdown">
                <el-select v-model="selectedUser" placeholder="User" suffix-icon="User" :class="['dark-mode']" @change="handleUserChange" style="margin-right: 60px;">
                    <el-option value='2'>Miguel Goñi Fusté</el-option>
                    <el-option value='1'>Ivan López Buira</el-option>
                    <el-option value='4'>Sara Chillón Domínguez</el-option>
                    <el-option value='3'>Ferran Martínez Vives</el-option>
                </el-select>
              </div>
              <div class="dropdown" style="margin-left: 60px;">

              <el-dropdown trigger="click" placement="bottom-end" @command="handleCommand">
                <span class="el-dropdown-link">
                    <el-icon class="setting-icon"><Setting /></el-icon>
                </span>

                <template #dropdown >
                  <el-dropdown-menu>
                    <el-dropdown-item command="profile">Perfil</el-dropdown-item>
                    <el-dropdown-item command="editProfile">Editar Perfil</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              </div>
            </div>
          </nav>
        </div>
      </header>
  
      <router-view></router-view>
    </div>
  </template>
  
  <script setup>
  import { ref, inject, onMounted } from 'vue'
  import { useRouter } from 'vue-router';
  import { ElSelect, ElOption, ElIcon, ElInput} from 'element-plus';
  import { Search } from '@element-plus/icons-vue'


  const searchIcon = Search 


  const searchQuery = ref('');
  const selectedOption = ref('');
  const router = useRouter();
  const selectedUser = ref('2');

  const api = inject('axios')

  onMounted(() => {
  const storedUser = localStorage.getItem('selectedUser');
  if (storedUser) {
    selectedUser.value = storedUser;
  }
});

  const handleNewPost = (type) => {
  if (type == 'magazine') router.push({name: 'newmagazine'})
  else router.push({ name: 'newpost', params: { type } });
};

  const handleSearch = () => {
  router.push({ name: 'search', query: { query: searchQuery.value } });
  
};


const handleUserChange = () => {
  localStorage.setItem('selectedUser', selectedUser.value);

  api.interceptors.request.use((config) => {
    config.headers['x-api-key'] = api.API_KEYS[selectedUser.value];
    return config;
  });
  router.go(0);

};


const handleCommand = (command) => {
  if (command === 'profile') {
    router.push({ name: 'profile' });
  } else if (command === 'editProfile') {
    router.push({ name: 'editprofile', query: { isEditing: 'true' } });
  }
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

.setting-icon {
  font-weight: bold;
  color: white;
}
</style>
  