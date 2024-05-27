<template>
  <div class="container">
    <navbar></navbar>
    <div class="sub-navbar">
      <div>
        <router-link :to="{ path: '/magazines', query: { sort_by: 'threads' } }">Most Threads</router-link>
        <router-link :to="{ path: '/magazines', query: { sort_by: 'comments' } }">Most Comments</router-link>
        <router-link :to="{ path: '/magazines', query: { sort_by: 'subscribers' } }">Most Subscribers</router-link>
      </div>
    </div>
    <div class="wotbody">
      <div class="wotitem">
        <table class="magazine-table">
          <thead>
            <tr>
              <th class="magazine-th">Name</th>
              <th class="magazine-th"># Threads</th>
              <th class="magazine-th"># Comments</th>
              <th class="magazine-th">Subscribe/Unsubscribe</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="magazine in magazines" :key="magazine.id">
              <td class="magazine-td"><strong><router-link :to="{ path: '/magazine/' + magazine.id }" style="color: white;">{{ magazine.name }}</router-link></strong></td>
              <td class="magazine-td">{{ magazine.threads }}</td>
              <td class="magazine-td">{{ magazine.comments }}</td>
              <td class="magazine-td" style="display: flex; flex-direction: row; justify-content: center;">
                <div class="user_actions_mag">
                  <i style="margin: 10px 5px 5px 5px;" class="fas fa-users"></i> &nbsp {{ magazine.subscribers }} &nbsp
                </div>
                <div class="user_actions_mag">
                  <template v-if="userSignedIn">
                    <button v-if="currentMagazines.includes(magazine.id)" @click="unsubscribe(magazine.id)" class="btn btn-primary btn-rectangular-mag">Unsubscribe</button>
                    <button v-else @click="subscribe(magazine.id)" class="btn btn-primary btn-rectangular-mag">Subscribe</button>
                  </template>
                  <template v-else>
                    <router-link to="/login" class="btn btn-primary btn-rectangular-mag">Subscribe</router-link>
                  </template>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
	import { onMounted, ref, inject } from 'vue'
  import navbar from './navbar.vue'

	const magazines = ref([])
	const api = inject('axios')

	onMounted(async () => {
    await fetchMagazines(); 
  })

  const fetchMagazines = async (sortBy) => {
  	try {
      const response = await api.get('magazines', {
        params: {
          sort_by: sortBy
        }
      });
      magazines.value = response.data;
      console.log(posts.value)
    } catch (error) {
      console.error(error);
    }
  }
</script>

<style scoped>
  .wotitem {
  	background-color: #333; /* Fondo oscuro */
  	color: #fff; /* Texto blanco */
  	display: flex;
  	align-items: start;
	}

	.magazine-table {
  	width: 100%;
  	border-collapse: collapse;
  	color: #dbdee2;
	}

	.magazine-th {
  	padding: 1.5rem 1rem;
  	border: 1px solid #373733;
  	background-color: #2c2c2c
	}

	.magazine-td {
  	position: relative;
  	padding: 1.5rem 1rem;
  	border: 1px solid #373733;
	}

	.user_actions_mag {
  	color: #cecece;
  	background: #2c2c2c;
  	border: 1px dashed #373737;
	}

	.btn-rectangular-mag{
  	border-radius: 0; /* Sin esquinas redondeadas */
  	background-color: #2c2c2c !important; /* Color de fondo gris */
  	border: 1px dashed #4a4a4a;
  	color: #ceceec; /* Color del texto blanco */
  	font-weight: 700; /* Texto en negrita */
  	padding: 10px 20px; /* Espaciado interno */
	}

	.btn-rectangular-mag:hover {
  	background-color: #2f2f2f !important; /* Color de fondo más oscuro cuando se pasa el ratón por encima */
	}
</style>