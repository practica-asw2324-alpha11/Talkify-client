<template>
	<el-row justify="center" style="margin-top: 10px; margin-bottom: 10px">
		<el-col :span="8">
			<el-alert v-if="alert" :title="alertText" :type="alertStyle" effect="dark" show-icon @close="alert=false"/>
		</el-col>
	</el-row>

	<div>
		<div class="sub-navbar">
			<div style="font-size: 18px; display: flex">
        		<el-button href="#" @click.prevent="goToNewPost('link')" :class="{ 'active': selectedPostType === 'link' }">Link</el-button>
        		<el-button href="#" @click.prevent="goToNewPost('thread')" :class="{ 'active': selectedPostType === 'thread' }">Thread</el-button>
        		<el-button href="#">Magazine</el-button>
      		</div>
    	</div>
		<div class="wotitem">
			<h2>Crear Nueva Magazine</h2>
			<form @submit.prevent="createMagazine">
				<div class="form-group">
					<label for="name">Nombre: <span style="color: red;">*</span></label>
					<input type="text" v-model="formData.name" id="name" class="form-control" required/>
				</div>
				<div class="form-group">
					<label for="title">Título: <span style="color: red;">*</span></label>
					<input type="text" v-model="formData.title" id="title" class="form-control" required/>
				</div>
				<div class="form-group">
					<label for="description">Descripción: </label>
					<textarea v-model="formData.description" id="description" class="form-control" rows="3"></textarea>
				</div>
				<div class="form-group">
					<label for="rules">Reglas:</label>
					<textarea v-model="formData.rules" id="rules" class="form-control" rows="3"></textarea>
				</div>
				<div class="form-group text-right">
					<el-button class="btn btn-secondary btn-rectangular" @click="createMagazine">Crear Magazine</el-button>
				</div>
			</form>
		</div>
	</div>
</template>

<script setup>
	import { ref, inject } from 'vue'
	import { useRouter, useRoute } from 'vue-router'
	import { ElButton } from 'element-plus'

	const formData = ref({ name: '', title: '', description: '', rules: '' })
	const api = inject('axios')
	const router = useRouter()
	const route = useRoute()

	const alertText = ref('')
	const alertStyle = ref('')
	const alert = ref(false)


	const showAlert = (text, style) => {
		alertText.value = text;
		alertStyle.value = style;
		alert.value = true;
	}

	const createMagazine = async () => {
		try {
			let payload = {
				name: formData.value.name,
				title: formData.value.title,
				description: formData.value.description,
				rules: formData.value.rules,
			}
			await api.post('magazines', payload)
			router.push('/magazines')
		} catch (error) {
			showAlert("No se ha podido crear la Magazine, hay campos vacíos", "error")
			console.error(error)
		}
	}

	const goToNewPost = (postType) => {
		router.push({name: `newpost`, query: {postType}})
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
  
  .form-group {
    margin-bottom: 20px;
  }
  
  .form-control {
    width: 100%;
    padding: 10px;
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