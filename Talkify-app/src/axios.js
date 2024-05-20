import axios from 'axios'

const VUE_APP_API_URL = "https://talkify.fly.dev/"
const VUE_APP_API_KEY = "byLdmMU5wnobRimdGcfse4pL"

// Create an api of axios
const api = axios.create({
    baseURL: VUE_APP_API_URL
})

// Add a request interceptor
api.interceptors.request.use((config) => {
    // Do something before request is sent
    config.headers['HTTP_X_API_KEY'] = `${VUE_APP_API_KEY}`
    config.headers['Accept'] = 'application/json'
    return config
}, (error) => {
    // Do something with request error
    return Promise.reject(error)
})

export default api