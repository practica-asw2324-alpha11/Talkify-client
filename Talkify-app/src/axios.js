import axios from 'axios'

const VUE_APP_API_URL = "https://talkify.fly.dev/"
const API_KEYS = {
    '2': 'PdDXW9UJMv1vvKCmF4pDndpS', // Miguel
    '1': 'byLdmMU5wnobRimdGcfse4pL', // Ivan
    '3': 'sBhfhbUzkp2sfoewQBokuUY6', // Ferran
    '4': '7M6G6ajNnr18cKQM4EuxuWcA'  // Sara
}

const api = axios.create({
  baseURL: VUE_APP_API_URL
})


api.interceptors.request.use((config) => {
  const selectedUser = localStorage.getItem('selectedUser') || '2'; 
  config.headers['x-api-key'] = API_KEYS[selectedUser]
  config.headers['Accept'] = 'application/json'
  return config
}, (error) => {
  return Promise.reject(error)
})

export default api
