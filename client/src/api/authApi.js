import axiosClient from './axiosClient.js'

export const registerUser = (payload) => {
  return axiosClient.post('/auth/register', payload)
}

export const loginUser = (payload) => {
  return axiosClient.post('/auth/login', payload)
}

export const getCurrentUser = () => {
  return axiosClient.get('/auth/me')
}