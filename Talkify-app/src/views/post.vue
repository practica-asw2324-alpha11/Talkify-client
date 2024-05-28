<template>

    <postbox id="post" :post="post" />
    
    <div class="wotitem sub-navbar">
      <a @click="sortComments('top')" class="nav-link">Top</a>
      <a @click="sortComments('newest')" class="nav-link">Newest</a>
      <a @click="sortComments('oldest')" class="nav-link">Oldest</a>
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
        <PostComment v-for="comment in comments" @delete-comment="deleteComment" class="single-comment" :key="comment.id" :comment="comment"></PostComment>
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
    console.log(post.value)
    
    let res = await api.get(`posts/${route.params.id}/comments`);

    comments.value = Array.isArray(res.data) ? res.data : [res.data];

    comments.value = comments.value.filter(c => c.parent_comment_id === null);
    console.log(comments.value);

  } catch (error) {
    console.error(error);
  }

  for(let comment of comments.value){
    console.log(comment);
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

const sortComments = async (param) => {

  let params = {
    sort_by: param
  }

  try{
    let res = await api.get(`posts/${route.params.id}/comments`, {params})
    comments.value = res.data
    comments.value = comments.value.filter(i => i.parent_comment_id === null)
  } catch{
    console.log(error)
  }
}

const deleteComment = (commentId) => {
  let index = comments.value.findIndex(comment => comment.id === commentId);
  if (index !== -1) {
    comments.value.splice(index, 1);
  }
};

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