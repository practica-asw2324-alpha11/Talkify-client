<template>
    <div>
      <div class="sub-navbar wotitem">
        <div>
          <button @click="setView('threads')" :class="{ active: currentView === 'threads' }">Threads</button>
          <button @click="setView('comments')" :class="{ active: currentView === 'comments' }">Comments</button>
          <button @click="setView('boosts')" :class="{ active: currentView === 'boosts' }">Boosts</button>
        </div>
      </div>
  
      <div class="content-container">
        <div v-if="currentView === 'threads'">
          <div class="sub-navbar wotitem">
            <button @click="setSort('top')">Top</button>
            <button @click="setSort('newest')">Newest</button>
            <button @click="setSort('commented')">Commented</button>
          </div>
          <div id="posts">
            <div v-for="post in posts" :key="post.id">
                    <postbox :post="post" />
            </div>          
        </div>
        </div>
  
        <div v-if="currentView === 'comments'">
          <div class="sub-navbar wotitem">
            <button @click="setSort('top')">Top</button>
            <button @click="setSort('newest')">Newest</button>
            <button @click="setSort('oldest')">Oldest</button>
          </div>
          <div id="comments">
            <Comment v-for="comment in comments" :key="comment.id" :comment="comment" />
          </div>
        </div>
  
        <div v-if="currentView === 'boosts'">
          <div v-for="post in boostedPosts" :key="post.id">
                <postbox :post="post" />
        </div> 
        </div>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, inject } from 'vue';
  import postbox from './postbox.vue';
  import Comment from './comment.vue'


  const currentView = ref('threads');
  const posts = ref([]);
  const comments = ref([]);
  const boostedPosts = ref([]);
  const sortCriteria = ref(''); 
  const userId = localStorage.getItem('selectedUser');
  const api = inject('axios');


  const setView = (view) => {
    currentView.value = view;
    sortCriteria.value = ''; 
    
    fetchData();
  };

  const setSort = (criteria) => {
    sortCriteria.value = criteria;
    fetchData();
  };

  const fetchData = async () => {
    let url;
    if (currentView.value === 'threads') {
      url = `/users/${userId}/posts`;
      if (sortCriteria.value) {
      url += `?sort_by=${sortCriteria.value}`;
    }
    } else if (currentView.value === 'comments') {
      url = `/users/${userId}/comments`;
      if (sortCriteria.value) {
      url += `?sort_by=${sortCriteria.value}`;
    }
    } else if (currentView.value === 'boosts') {
      url = `/users/${userId}/boosts`;
    }

   

    const response = await api.get(url);
    if (currentView.value === 'threads') {
      posts.value = response.data;
    } else if (currentView.value === 'comments') {
      comments.value = response.data;
    } else if (currentView.value === 'boosts') {
      boostedPosts.value = response.data.boosted_posts;
    }
    console.log(response.data)

  };

  fetchData();
</script>

  
  <style scoped>
  .sub-navbar {
    background-color: #222;
    padding: 5px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 90%;
    margin: 0 auto;
    border-radius: 5px;
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
  
  .sub-navbar button.active {
    background-color: #007bff;
    color: #fff;
  }
  
  .content-container {
    background-color: #333;
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
  }
  </style>
  