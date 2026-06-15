import axiosClient from './axiosClient.js'

export const getTasks = (params) => {
  return axiosClient.get('/tasks', { params })
}

export const getTaskById = (id) => {
  return axiosClient.get(`/tasks/${id}`)
}

export const createTask = (payload) => {
  return axiosClient.post('/tasks', payload)
}

export const updateTask = (id, payload) => {
  return axiosClient.put(`/tasks/${id}`, payload)
}

export const deleteTask = (id) => {
  return axiosClient.delete(`/tasks/${id}`)
}