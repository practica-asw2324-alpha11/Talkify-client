<template>
    <div class="post-comment">
    <div :id="`comment-${comment.id}`"  class="wotitem">
        <el-row justify="space-between">
            <el-col :span="12">
                <router-link :to="`/user/${comment.user_id}`">{{ comment.user.full_name }}</router-link>,
                {{ formatDate(new Date(comment.created_at)) }} ago
            </el-col>
            <el-col :span="12" style="display: flex; justify-content: flex-end">
                <div class="vote-el-buttons" style="display: flex;">

                    <el-button type="primary" @click="upvote(comment.id)" class="vote" :style="{ color: comment.is_upvoted ? 'green' : '' }">
                        <span> {{ comment.upvote }} </span>
                        <el-icon><Top/></el-icon>
                    </el-button>

                    <el-button type="primary" @click="downvote(comment.id)" class="vote" :style="{ color: comment.is_downvoted ? 'red' : '' }">
                        <span> {{ comment.downvote }} </span>
                        <el-icon><Bottom/></el-icon>
                    </el-button>

                </div>
            </el-col>
        </el-row>
        <el-row>
          {{ comment.body }}  
        </el-row>
        <el-row>
            <a style="margin-bottom: 10px; margin-top: 10px;" @click="reply_to = reply_to === '' ? comment.id : ''">reply</a>
            <a v-if="comment.is_author" style="margin-bottom: 10px; margin-top: 10px;" @click="reply_to = reply_to === '' ? comment.id : ''">edit</a>
            <a v-if="comment.is_author" style="margin-bottom: 10px; margin-top: 10px;">delete</a>
        </el-row>
        <div v-if="reply_to === comment.id">
            <el-row>
                <el-input v-model="reply_body" type="textarea" class="dark-input" :rows="3" ></el-input>
            </el-row>
            <br>
            <el-row justify="end">
                <el-button @click="createReply(comment.id)"> Add Reply! </el-button>
            </el-row>
        </div>
    </div>

    <post_comment style="padding-left: 20px; " v-for="reply in comment.replies" :key="reply.id" :comment="reply"></post_comment>

</div>
    

</template>

<script setup>
import { onMounted, ref, inject, defineProps } from 'vue'
import { useRoute } from 'vue-router'
import { formatDistanceToNow } from 'date-fns';

const props = defineProps({
    comment: Object
})

const api = inject('axios')
const route = useRoute()
const comment = ref(props.comment)
const reply_body = ref('')
const reply_to = ref('')

onMounted(async() => {
    console.log(comment.value)
    if (comment.value.parent_comment_id != null){
        try{
            let res = await api.get(`posts/${route.params.id}/comments/${comment.value.id}`)
            comment["replies"].value = res.data.replies
        } catch(error){
            console.log(error)
        }
    }
})

const formatDate = (date) => {
    return formatDistanceToNow(date)
}

const upvote = async (commentId) => {
    try {
      let updated_comm = await api.post(`posts/${route.params.post_id}/comments/${commentId}/upvote`)
      comment.value = updated_comm.data
    } catch (error) {
      console.error(error)
    }
}
  
const downvote = async (commentId) => {
    try {
        let updated_comm = await api.post(`posts/${route.params.post_id}/comments/${commentId}/downvote`)
        comment.value = updated_comm.data
    } catch (error) {
        console.error(error)
    }
}

const createReply = async (commentId) => {
  let data = { body: reply_body.value, parent_comment_id: commentId};
  reply_body.value = ''
  reply_to.value = ''

  try{
    let res = await api.post(`posts/${route.params.id}/comments`, data)
    comments.value.push(res.data)
  } catch (error){
    console.log(error)
  }
 
}

</script>

<style scoped>
  .vote-el-buttons .el-button {
    display: flex;
    flex-direction: column;
    align-items: center; /* Centra los elementos horizontalmente */
    border-radius: 0;
    background-color: #111;
    border-color: #444;
    
  }

  .wotitem {
    margin-top: 0;
    margin-bottom: 0;
  }
</style>