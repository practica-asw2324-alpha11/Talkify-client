<template>
  <div>
    <div class="sub-navbar wotitem">
      <div>
        <button @click="setView('threads')" :class="{ active: currentView === 'threads' }">Threads</button>
        <button @click="setView('comments')" :class="{ active: currentView === 'comments' }">Comments</button>
        <button @click="setView('boosts')" :class="{ active: currentView === 'boosts' }" v-if="localStorageUserIdMatchesRoute">Boosts</button>
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
        <br>
        <div id="comments">
          <PostComment v-for="comment in comments" :key="comment.id" :comment="comment" />
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
import { ref, inject, defineProps,computed, onMounted } from 'vue';
import postbox from '../../components/Posts/postbox.vue';
import PostComment from '../../components/Comments/post_comment.vue';

const currentView = ref('threads');
const posts = ref([]);
const comments = ref([]);
const boostedPosts = ref([]);
const sortCriteria = ref(''); 
const api = inject('axios');

const setView = async (view) => {
  currentView.value = view;
  sortCriteria.value = ''; 
  await fetchData();
};


const props = defineProps({
  userId: {
    type: String, 
    required: true 
  }
});


const localStorageUserIdMatchesRoute = computed(() => {
    const localStorageUserId = localStorage.getItem('selectedUser');
    return localStorageUserId === props.userId;
  });

const setSort = (criteria) => {
  sortCriteria.value = criteria;
  fetchData();
};

const fetchData = async () => {
  let url;
  if (currentView.value === 'threads') {
    url = `/users/${props.userId}/posts`;
    if (sortCriteria.value) {
      url += `?sort_by=${sortCriteria.value}`;
    }
  } else if (currentView.value === 'comments') {
    url = `/users/${props.userId}/comments`;
    if (sortCriteria.value) {
      url += `?sort_by=${sortCriteria.value}`;
    }
  } else if (currentView.value === 'boosts') {
    url = `/users/${props.userId}/boosts`;
  }

  const response = await api.get(url);
  if (currentView.value === 'threads') {
    posts.value = response.data.posts;
  } else if (currentView.value === 'comments') {
    comments.value = response.data;
    console.log(comments.value)
  } else if (currentView.value === 'boosts') {
    boostedPosts.value = response.data.boosted_posts;
  }
};

onMounted(async () => {
  await fetchData();
})
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