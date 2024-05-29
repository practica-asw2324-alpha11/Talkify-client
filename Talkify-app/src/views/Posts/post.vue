<template>
  <div>
    <postbox/>
    

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

.wotitem {
  border: 2px solid #3d3c3d;
  margin: 20px auto;
  padding: 1em;
  width: 90%;
  background-color: #3d3c3d;
  border-color: #4a4a4a;
  position: relative;
}

.post-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px; /* Espacio entre los botones */
}

.el-button.btn-primary {
  background-color: #000;
  color: #fff;
  border: 1px solid #000;
  padding: 10px 20px;
  border-radius: 0;
}

.el-button.btn-danger {
  background-color: #000;
  color: #fff;
  border: 1px solid #000;
  padding: 10px 20px;
  border-radius: 0;
}

.el-button:hover {
  background-color: #333;
}

.edit-form-container {
  background-color: #2a2929;
  padding: 20px;
  margin: 20px auto;
  width: 90%;
  border: 2px solid #4a4a4a;
  border-radius: 5px;
}

.form-control {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: #1c1c1c;
  border: 1px solid #373737;
  color: #cacece;
  font-size: 1rem;
}

.btn-secondary {
  background-color: #444;
  color: #fff;
  border: 1px solid #444;
}

.btn-secondary:hover {
  background-color: #666;
}
</style>
