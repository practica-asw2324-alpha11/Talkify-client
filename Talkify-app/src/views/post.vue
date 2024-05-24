<template>
    <div id="post" class="wotitem">
        {{ post.body }}
    </div>

    <div id="comments">
        <Comment v-for="comment in comments" :key="comment.id" :comment="comment"/>
    </div>
</template>

<script setup>
import { onMounted, ref, inject } from 'vue'
import { useRoute } from 'vue-router'
import Comment from './comment.vue'

const post = ref({})
const comments = ref([])
const api = inject('axios')
const route = useRoute()

onMounted(async () => {
    await fetchPost(); 
    
})

const fetchPost = async () => {
  try {
    let response = await api.get(`posts/${route.params.id}`);
    post.value = response.data.post;
    
    let res = await api.get(`posts/${route.params.id}/comments`);
    comments.value = res.data

  } catch (error) {
    console.error(error);
  }
}

</script>

<style scoped>

</style>