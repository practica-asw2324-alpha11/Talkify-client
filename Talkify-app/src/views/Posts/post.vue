<template>
  <div>
    <postbox/>
    

    <el-row class="wotitem sub-navbar">
      <el-col :span="10" style="display: flex">
        <el-button @click="sortComments('top')" class="nav-link">Top</el-button>
        <el-button @click="sortComments('newest')" class="nav-link">Newest</el-button>
        <el-button @click="sortComments('oldest')" class="nav-link">Oldest</el-button>
      </el-col>
    </el-row>

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
        <PostComment v-for="comment in comments" @delete-comment="deleteComment" class="single-comment" :key="comment.id" :comment="comment" :show_relpies="true"></PostComment>
    </div>

    
  </div>
</template>

<script setup>
import { onMounted, ref, inject, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import postbox from '../../components/Posts/postbox.vue'
import { ElButton } from 'element-plus'
import PostComment from '../../components/Comments/post_comment.vue'

const post = ref({})
const comments = ref([])

const magazines = ref([])
const api = inject('axios')
const route = useRoute()


const body = ref('')

const textareaStyle = reactive({
  backgroundColor: '#1c1c1c',
  boxShadow: '0 0 0 1px #1c1c1c inset',
  color: '#cacece'
});

const fetchComments = async () => {
  try{
    let res = await api.get(`posts/${route.params.id}/comments`);

    comments.value = Array.isArray(res.data) ? res.data : [res.data];

    comments.value = comments.value.filter(c => c.parent_comment_id === null);

    let magResponse = await api.get(`magazines`)
    magazines.value = magResponse.data
  } catch (error) {
    console.error(error)
  }
}

const createComment = async () => {
  let data = { body: body.value, parent_comment_id: null};
  body.value = ''

  try{
    let res = await api.post(`posts/${route.params.id}/comments`, data)
    comments.value.push(res.data)
  } catch (error){
    console.error(error);
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
  let index = comments.value.findIndex(c => c.id === commentId);
  if (index !== -1) {
    comments.value.splice(index, 1);
  }

};

onMounted( async () => {
  await fetchComments()
})
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
