<template>
    <div>
        <h1>Posts</h1>
        <div v-for="post in posts" :key="post.id">
        <h2>{{ post.title }}</h2>
        <p>{{ post.body }}</p>
        <hr>
        </div>
    </div>
</template>

<script setup>
import {onMounted, ref, inject} from 'vue'

const posts = ref([])
const api = inject('axios')

onMounted(async () => {
    try {
        const response = await api.get('posts')
        posts.value = response.data
    } catch (error) {
        console.error(error)
    }
})

</script>