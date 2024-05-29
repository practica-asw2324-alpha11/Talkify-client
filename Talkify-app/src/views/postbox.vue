<template>
    <div class="wotitem">
      <div class="post-header">
        <div class="vote-el-buttons">
          <el-button type="primary" @click="upvote(post.id)" class="vote" :style="{ color: post.is_upvoted ? 'green' : '' }">
            <span>{{ post.upvotes_count }} &nbsp;</span>
            <el-icon><Top /></el-icon>
          </el-button>
          <br>
          <el-button type="primary" @click="downvote(post.id)" class="vote" :style="{ color: post.is_downvoted ? 'red' : '' }">
            <span>{{ post.downvotes_count }} &nbsp;</span>
            <el-icon><Bottom /></el-icon>
          </el-button>
        </div>
      </div>
      <div class="post-content">
        <span class="first-part">
          <h2>
            <router-link :to="'/post/' + post.id" style="color: white;">{{ post.title }}</router-link>
            <span v-if="post.link" style="font-size: 14px;">
              (<a href="#" style="color: white;" @click.prevent="openExternalLink(post.url)">{{ post.url }}</a>)
            </span>
          </h2>
        </span>
        <div class="text-container" style="color:#cecece; font-size: 14px;">
          <p>
            <router-link :to="{ name: 'user', params: { id: post.user.id}}">
              <strong>{{ post.user ? post.user.full_name : 'Anonymous' }}</strong>
            </router-link>
            {{ timeAgo(post.created_at) }} ago to magazine 
            <router-link :to="{ name: 'magazine', params: {id: post.magazine.id}}">
              <strong> {{ post.magazine ? post.magazine.title : 'Unknown Magazine' }}</strong>
            </router-link>
          </p>
        </div>
        <div class="activity">
          <router-link :to="'/post/' + post.id">comments ({{ post.comments_count }})  </router-link>
          <span @click="post.is_boosted ? unboost(post.id) : boost(post.id)">
            {{ post.is_boosted ? 'boost(1)' : 'boost' }}
          </span>    
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted, ref, inject } from 'vue';
  import { ElButton, ElIcon } from 'element-plus';
  import { useRouter, useRoute } from 'vue-router';

  
  const props = defineProps(['post']); 
  const router = useRouter();
  const api = inject('axios');


  
  const upvote = async (postId) => {
    try {
      await api.post(`posts/${postId}/upvote`)
      router.go(0);
    } catch (error) {
      console.error(error)
    }
  }
  
  const downvote = async (postId) => {
    try {
      await api.post(`posts/${postId}/downvote`)
      router.go(0);
    } catch (error) {
      console.error(error)
    }
  }
  
  const boost = async (postId) => {
    try {
      await api.post(`posts/${postId}/boost`)
      router.go(0);
    } catch (error) {
      console.error(error)
    }
  }
  
  const unboost = async (postId) => {
    try {
      await api.delete(`posts/${postId}/boost`)
      router.go(0);
    } catch (error) {
      console.error(error)
    }
  }
  
  const openExternalLink = (url) => {
    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  }
  
  const timeAgo = (time) => {
    const date = new Date(time)
    const now = new Date()
    const secondsPast = (now.getTime() - date.getTime()) / 1000
  
    if (secondsPast < 60) {
      return `${Math.round(secondsPast)} seconds`
    }
    if (secondsPast < 3600) {
      return `${Math.round(secondsPast / 60)} minutes`
    }
    if (secondsPast < 86400) {
      return `${Math.round(secondsPast / 3600)} hours`
    }
    return `${Math.round(secondsPast / 86400)} days`
  }
  </script>
  
  <style scoped>
  .wotitem {
    background-color: #333; /* Fondo oscuro */
    color: #fff; /* Texto blanco */
    display: flex;
    align-items: start;
  }
  
  .vote-el-buttons .el-button {
    display: flex;
    flex-direction: column;
    align-items: center; /* Centra los elementos horizontalmente */
    border-radius: 0;
    background-color: #111;
    border-color: #444;
    
  }
  
  .icon-container {
    margin: 10px 0; /* Añade un margen en la parte superior e inferior */
  }
  </style>
  