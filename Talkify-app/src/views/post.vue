<template>

    <postbox id="post" :post="post" />
    
    <div class="wotitem sub-navbar">
      <router-link class="nav-link">Top</router-link>
      <router-link class="nav-link">Newest</router-link>
      <router-link class="nav-link">Oldest</router-link>
    </div>

    <div class="wotitem">
      <el-row>
        <el-input v-model="body" type="textarea" :rows="3" :input-style="textareaStyle"></el-input>
      </el-row>
      <br>
      <el-row justify="end">
        <el-button @click="createComment"> Add Comment! </el-button>
      </el-row>
    </div>

    <div id="comments">
        <PostComment class="single-comment" v-for="comment in comments" :key="comment.id" :comment="comment"/>
    </div>

</template>

<script setup>
import { onMounted, ref, inject, reactive } from 'vue'
import { useRoute } from 'vue-router'
import PostComment from './post_comment.vue'
import postbox from './postbox.vue'; 


const post = ref({})
const comments = ref([])
const api = inject('axios')
const route = useRoute()

const body = ref('')

const textareaStyle = reactive({
  backgroundColor: '#1c1c1c',
  boxShadow: '0 0 0 1px #1c1c1c inset',
  color: '#cacece'
});

onMounted(async () => {
    await fetchPost(); 
    
})

const fetchPost = async () => {
  try {
    let response = await api.get(`posts/${route.params.id}`);
    post.value = response.data.post;
    
    let res = await api.get(`posts/${route.params.id}/comments`);
    comments.value = res.data

    comments.value = comments.value.filter(c => c.parent_comment_id === null)

  } catch (error) {
    console.error(error);
  }
}

const createComment = async () => {
  let data = { body: body.value, parent_comment_id: null};
  body.value = ''

  try{
    let res = await api.post(`posts/${route.params.id}/comments`, data)
    comments.value.push(res.data)
  } catch (error){
    console.log(error)
  }
 
}

</script>

<style scoped>
.nav-link {
  margin-right: 20px;
}

.el-input {
  background-color: #000;
  color: #fff;
}

.single-comment{
  margin-bottom: 0;
  margin-top: 0; 
}

</style>