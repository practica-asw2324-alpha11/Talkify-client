<template>
  <div>
    <div class="sub-navbar wotitem">
      <div style="display: flex;">
        <el-button @click="setView('threads')" :class="{ active: currentView === 'threads' }">Threads ( {{ num_activity.num_threads }} ) </el-button>
        <el-button @click="setView('comments')" :class="{ active: currentView === 'comments' }">Comments ( {{ num_activity.num_comments }} ) </el-button>
        <el-button @click="setView('boosts')" :class="{ active: currentView === 'boosts' }" v-if="localStorageUserIdMatchesRoute">Boosts ( {{ num_activity.num_boosts }} ) </el-button>
      </div>
    </div>

    <div class="content-container">
      <div v-if="currentView === 'threads'">
        <div class="sub-navbar wotitem">
          <el-button @click="setSort('top')">Top</el-button>
          <el-button @click="setSort('newest')">Newest</el-button>
          <el-button @click="setSort('commented')">Commented</el-button>
        </div>
        <div id="posts">
          <div v-for="post in posts" :key="post.id">
            <postbox :post="post" />
          </div>          
        </div>
      </div>

      <div v-if="currentView === 'comments'">
        <div class="sub-navbar wotitem">
          <el-button @click="setSort('top')">Top</el-button>
          <el-button @click="setSort('newest')">Newest</el-button>
          <el-button @click="setSort('oldest')">Oldest</el-button>
        </div>
        <br>
        <div id="comments">
          <PostComment v-for="comment in comments" :key="comment.id" :comment="comment" />
        </div>
      </div>

      <div v-if="currentView === 'boosts'">
        <div v-for="post in boostedPosts" :key="post.id">
          <postbox @unboost-post="onUnboostPost" :post="post" />
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
  },
  num_activity: {
    type: Object,
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

const onUnboostPost = async (postU) => {
  console.log(postU)
  boostedPosts.value = boostedPosts.value.filter(boostedPost => boostedPost.id !== postU.id);
}

onMounted(async () => {
  await fetchData();
})
</script>


  
  <style scoped>
  
  .sub-navbar button {
    color: #fff;
    text-decoration: none;
    padding: 8px 12px;
    transition: background-color 0.3s ease;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  
  .content-container {
    background-color: #333;
    color: #fff;
    padding: 20px;
    border-radius: 8px;
    margin-top: 20px;
  }
  </style>