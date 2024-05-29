<template>
	<div>
		<div id="magazine" class=" infomagazine wotitem">
			<h2>{{magazine.name}}</h2>
			<strong><p>@{{magazine.title}}@talkify</p></strong>
			<strong><p>Description:</p></strong>
			<p>{{magazine.description}}</p>
			<strong><p>Rules:</p></strong>
			<p>{{magazine.rules}}</p>
			<div class="user_actions_mag">
        <el-button v-if="magazine.isSubscribed" @click.prevent="unsubscribe(magazine.id)" class="btn btn-primary btn-rectangular-mag">Unsubscribe</el-button>
        <el-button v-else @click.prevent="subscribe(magazine.id)" class="btn btn-primary btn-rectangular-mag">Subscribe</el-button>
      </div>
		</div>
		<div class="infomagazine wotitem">
			<p><strong>Created: </strong>{{calculateDate(magazine.created_at)}}</p>
			<p><strong>Subscribers: </strong>{{magazine.subscribers}}</p>
			<p><strong>Threads: </strong>{{magazine.threads}}</p>
			<p><strong>Comments: </strong>{{magazine.comments}}</p>
		</div>
		<el-row class="sub-navbar wotitem">
			<el-col span="10" style="display:flex;">
    		<el-button class="btn btn-secondary btn-rectangular" @click.prevent="fetchPosts('top')">Top</el-button>
    		<el-button class="btn btn-secondary btn-rectangular" @click.prevent="fetchPosts('newest')">Newest</el-button>
    		<el-button class="btn btn-secondary btn-rectangular" @click.prevent="fetchPosts('commented')">Commented</el-button>
  		</el-col>
		</el-row>
		<div>
			<div v-for="post in posts" :key="post.id">
      	<postbox :post="post" />
    	</div>
		</div> 
	</div>
</template>

<script setup>
	import { onMounted, ref, inject } from 'vue'
	import { useRoute, useRouter } from 'vue-router'
	import postbox from '../../components/Posts/postbox.vue'
	import { ElButton } from 'element-plus'

	const magazine = ref({})
	const posts = ref([])
	const api = inject('axios')
	const route = useRoute()
	const router = useRouter()

	const calculateDate = (createdAt) => {
		const createdDate = new Date(createdAt)
		const currentDate = new Date()
		const diffTime = Math.abs(currentDate - createdDate)
		const diffDays = Math.floor(diffTime / (1000*60*60*24))
		if (diffDays === 0) return "today"
		else if (diffDays === 1) return "yesterday"
		else return `${diffDays} days ago`
	}

	const fetchMagazine = async () => {
		try {
			let response = await api.get(`magazines/${route.params.id}`)
    	magazine.value = response.data

			let postsResponse = await api.get(`magazines/${route.params.id}/posts`)
			posts.value = postsResponse.data.posts

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
			posts.value = response.data.posts
		} catch (error) {
			console.error(error)
		}
	}

	onMounted(async () => {
		await fetchMagazine()
	})

	const subscribe = async (magazineId) => {
    try {
      await api.post(`magazines/${magazineId}/subscribe`)
      magazine.value.isSubscribed = true
      magazine.value.subscribers += 1
    } catch (error) {
      console.error(error)
    }
  }
  const unsubscribe = async (magazineId) => {
    try {
      await api.delete(`magazines/${magazineId}/subscribe`)
      magazine.value.isSubscribed = false
      magazine.value.subscribers -= 1
    } catch (error) {
      console.error(error)
    }
  }
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

	.btn-rectangular-mag {
  	border-radius: 0;
  	background-color: #2c2c2c;
  	border: 1px solid #4a4a4a;
  	color: #fff;
  	font-weight: 700;
  	padding: 10px 20px;
	}
	.btn-rectangular-mag:hover {
  	background-color: #2f2f2f !important; /* Color de fondo más oscuro cuando se pasa el ratón por encima */
	}
</style>