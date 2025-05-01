
import axios from 'axios'
import { getTokenSubject } from '../service/token.service'

//token from tojen subject
const token = getTokenSubject().value

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  })
  
// Inject token dynamically before each request
api.interceptors.request.use((config) => {
    const token = getTokenSubject().value
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
})


// Optional: refresh the token or handle 401 errors globally
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // handle logout or token refresh
    }
    return Promise.reject(error)
  }
)

export default api
