import axios from 'axios'

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const setAuthToken = (token) => {
  if (token) {
    axiosClient.defaults.headers.common.Authorization = `Bearer ${token}`
  } else {
    delete axiosClient.defaults.headers.common.Authorization
  }
}

export default axiosClient