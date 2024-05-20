import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import api from './axios.js'

const app = createApp(App)

app.provide('axios', api)

app.use(router)

app.mount('#app')
