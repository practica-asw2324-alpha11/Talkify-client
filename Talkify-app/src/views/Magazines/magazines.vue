<template>
  <div class="container">
    <div class="sub-navbar wotitem">
      <div style="font-size: 18px; margin-left: 80px;">
        <el-button class="btn btn-secondary btn-rectangular" @click.prevent="fetchMagazines('threads')">Most threads</el-button>
        <el-button class="btn btn-secondary btn-rectangular" @click.prevent="fetchMagazines('comments')">Most commented</el-button>
        <el-button class="btn btn-secondary btn-rectangular" @click.prevent="fetchMagazines('subscribers')">Most subscribers</el-button>
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
                  <i style="margin: 10px 5px 5px 5px;"></i> &nbsp {{ magazine.subscribers }} <el-icon><User/></el-icon> &nbsp
                </div>
                <div class="user_actions_mag">
                  <el-button v-if="magazine.isSubscribed" @click.prevent="unsubscribe(magazine.id)" class="btn btn-primary btn-rectangular-mag">Unsubscribe</el-button>
                  <el-button v-else @click.prevent="subscribe(magazine.id)" class="btn btn-primary btn-rectangular-mag">Subscribe</el-button>
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
  import { ElButton, ElIcon } from 'element-plus'

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
    } catch (error) {
      console.error(error);
    }
  }

  const subscribe = async (magazineId) => {
    try {
      await api.post(`magazines/${magazineId}/subscribe`)
      const magazine = magazines.value.find(m => m.id === magazineId)
      if (magazine) {
        magazine.isSubscribed = true
        magazine.subscribers += 1
      }
    } catch (error) {
      console.error(error)
    }
  }

  const unsubscribe = async (magazineId) => {
    try {
      await api.delete(`magazines/${magazineId}/subscribe`)
      const magazine = magazines.value.find(m => m.id === magazineId)
      if (magazine) {
        magazine.isSubscribed = false
        magazine.subscribers -= 1
      }
    } catch (error) {
      console.error(error)
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

  .btn-secondary {
    background-color: #444;
    color: #fff;
    border: 1px solid #444;
  }

  .btn-secondary:hover {
    background-color: #666;
  }
  .sub-navbar button {
    color: #fff;
    text-decoration: none;
    padding: 8px 12px;
    transition: background-color 0.3s ease;
    background: none;
    border: none;
    cursor: pointer;
  }
  
  .sub-navbar button:hover {
    background-color: #555;
  }
</style>