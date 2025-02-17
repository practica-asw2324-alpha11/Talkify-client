<template>
    <div class="profile-header wotitem">
      <div class="background-banner-container">
        <img :src="user.background" class="background-banner" />
      </div>
  
      <!-- Avatar and User Info Overlay -->
      <div class="overlay">
        <div class="avatar-container">
          <img :src="user.avatar" class="avatar" />
        </div>
        <p class="user-full-name">{{ user.full_name }}</p>
        <p class="user-email">{{ user.email }}</p>
        <p class="user-description">{{ user.description }}</p>    
      </div>
    </div>
  
    <profile_tab v-if="!isEditing" :userId="route.params.id" :num_activity="num_activity"></profile_tab>
  </template>
  
  <script setup>
  import { onMounted, ref, inject, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import profile_tab from './Profile/profile_tab.vue';
  
  const route = useRoute();
  const router = useRouter();
  const api = inject('axios');
  

  const num_activity = ref({});

  const isEditing = false;
  const user = ref({});
  const routeUserId = route.params.id;
  const formData = ref({
    email: '',
    full_name: '',
    description: '',
    avatar: null,
    background: null
  });
  
  const fetchUser = async () => {
  try {
    if (!routeUserId) {
      throw new Error('No user ID found in the route');
    }
    const response = await api.get(`users/${routeUserId}`);
    user.value = response.data;
    num_activity.value = { 
        num_threads: user.value.posts_count,
        num_comments: user.value.comments_count,
        num_boosts: user.value.boosts_count
      }
    console.log("USER CHARGED")
    console.log(user.value);
    formData.value = { ...user.value, avatar: null, background: null }; 
  } catch (error) {
    console.error('Error fetching user:', error);
  }
};


  const toggleEditMode = () => {
    isEditing.value = !isEditing.value;
    if (isEditing.value) {
      router.push({ name: 'editprofile', params: { id: route.params.id }, query: { isEditing: 'true' } });
    } else {
      router.push({ name: 'userprofile', params: { id: route.params.id } });
    }
  };
  
  const localStorageUserIdMatchesRoute = computed(() => {
    const localStorageUserId = localStorage.getItem('selectedUser');
    const routeUserId = route.params.id;
    return localStorageUserId === routeUserId;
  });
  
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file && !isValidFileType(file)) {
      alert('El tipo de archivo seleccionado no es válido para el avatar.');
      return;
    }
    formData.value.avatar = file;
  };
  
  const handleBackgroundChange = (event) => {
    const file = event.target.files[0];
    if (file && !isValidFileType(file)) {
      alert('El tipo de archivo seleccionado no es válido para el fondo de imagen.');
      return;
    }
    formData.value.background = file;
  };
  
  const isValidFileType = (file) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    return allowedTypes.includes(file.type);
  };
  
  const updateProfile = async () => {
    const userId = route.params.id; // Get user ID from the route parameters
    if (!userId) {
      console.error('No user ID found in the route');
      return;
    }
    const formDataToSend = new FormData();
    formDataToSend.append('email', formData.value.email);
    formDataToSend.append('full_name', formData.value.full_name);
    formDataToSend.append('description', formData.value.description);
    if (formData.value.avatar) {
      formDataToSend.append('avatar', formData.value.avatar);
    }
    if (formData.value.background) {
      formDataToSend.append('background', formData.value.background);
    }
  
    // Logging FormData content to check if files are appended correctly
    console.log("aqui")
    for (let [key, value] of formDataToSend.entries()) {
      console.log(key, value);
    }
  
    try {
      const response = await api.put(`users/${userId}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Perfil actualizado:', response.data);
      await fetchUser();
      toggleEditMode();
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Server response:', error.response.data);
      }
    }
  };
  
  onMounted(fetchUser);
  </script>
  
  <style scoped>
  /* Your existing CSS styles */
  .container {
    background-color: #333;
    color: #fff;
    padding: 20px;
  }
  
  .navbar {
    margin-bottom: 20px; /* Add space below the navbar */
  }
  
  .profile-header {
    position: relative;
    background-color: #333;
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-bottom: 20px;
    height: 700px;
  }
  
  .background-banner-container {
    width: 100%;
    padding-top: 25%;
    position: relative;
  }
  
  .background-banner {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 400px;
    object-fit: cover;
  }
  
  .overlay {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .avatar-container {
    margin-bottom: 10px;
  }
  
  .avatar {
    border: 3px solid #373737;
    border-radius: 50%;
    width: 100px;
    height: 100px;
    object-fit: cover;
  }
  
  .user-full-name {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .user-email,
  .user-description,
  .user-actions {
    margin: 5px 0;
  }
  
  .user-actions {
    color: #cecece;
    background: #2c2c2c;
    border: 1px dashed #373737;
    padding: 5px 10px;
  }
  
  .edit-button-container {
    margin-bottom: 20px; 
    flex: 1;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
    border: 1px solid #444;
    border-radius: 4px;
    background-color: #555;
    color: #ffffff;
  }
  
  .btn-rectangular {
    padding: 10px 20px;
    border-radius: 4px;
    background-color: #000; 
    color: #fff;
  }
  
  .btn-rectangular.btn-secondary {
    background-color: #6c757d;
  }
  </style>
  