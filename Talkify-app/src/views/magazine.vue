<template>
	<div>
		<navbar></navbar>
		<div id="magazine" class=" infomagazine wotitem">
			<h2>{{magazine.name}}</h2>
			<strong><p>@{{magazine.title}}@talkify</p></strong>
			<strong><p>Description:</p></strong>
			<p>{{magazine.description}}</p>
			<strong><p>Rules:</p></strong>
			<p>{{magazine.rules}}</p>
			
		</div>
		<div class="infomagazine wotitem">
			<p><strong>Created: </strong>{{magazine.created_at}}</p>
			<p><strong>Subscribers: </strong>{{magazine.subscribers}}</p>
			<p><strong>Threads: </strong>{{magazine.threads}}</p>
			<p><strong>Comments: </strong>{{magazine.comments}}</p>
		</div>
		<div class="sub-navbar wotitem">
			<div style="font-size: 18px; margin-left: 80px;">
    		<el-button class="btn btn-secondary btn-rectangular" @click.prevent="fetchPosts('top')">Top</el-button>
    		<el-button class="btn btn-secondary btn-rectangular" @click.prevent="fetchPosts('newest')">Newest</el-button>
    		<el-button class="btn btn-secondary btn-rectangular" @click.prevent="fetchPosts('commented')">Commented</el-button>
  		</div>
		</div>
		<div>
			<div v-for="post in posts" :key="post.id">
      	<postbox :post="post" />
    	</div>
		</div> 
	</div>
</template>

<script setup>
	import { onMounted, ref, inject, watch } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import postbox from './postbox.vue'
	import navbar from './navbar.vue'
	import { ElButton } from 'element-plus'

	const magazine = ref({})
	const posts = ref([])
	const api = inject('axios')
	const route = useRoute()
	const router = useRouter()

	const fetchMagazine = async () => {
		try {
			let response = await api.get(`magazines/${route.params.id}`)
    	magazine.value = response.data
			console.log('Dades magazine: ', response.data)

			let postsResponse = await api.get(`magazines/${route.params.id}/posts`)
			posts.value = postsResponse.data
			console.log('Dades posts de la magazine: ', postsResponse.data)

		} catch (error) {
			console.error(error)
		}
	}

	const fetchPosts = async (sortBy) => {
		try {
			let response = await api.get(`magazines/${route.params.id}/posts`, {
				params: {
					sort_by: sortBy
				}
			})
			posts.value = response.data
		} catch (error) {
			console.error(error)
		}
	}

	onMounted(async () => {
		await fetchMagazine()
	})

	watch(posts, (newPosts) => {
  	newPosts.forEach(post => {
    	console.log('Post:', post)
  	})
	})
</script>

<style scoped>
	.wotitem {
  	border: 2px solid #3d3c3d;
  	margin: 20px auto;
  	padding: 1em;
  	width: 90%;
  	background-color: #3d3c3d;
  	border-color: #4a4a4a;
  	position: relative;
	}

	.btn-secondary {
  	background-color: #444;
  	color: #fff;
  	border: 1px solid #444;
	}

	.infomagazine {
  	display: block;
  	margin-block-start: 1em;
  	margin-block-end: 1em;
  	margin-inline-start: 0px;
  	margin-inline-end: 0px;
  	color: #ffffff;
	}
</style>