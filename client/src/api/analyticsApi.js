import axiosClient from './axiosClient.js'

export const getSummary = (params) => {
  return axiosClient.get('/analytics/summary', { params })
}

export const getByStatus = (params) => {
  return axiosClient.get('/analytics/by-status', { params })
}

export const getByPriority = (params) => {
  return axiosClient.get('/analytics/by-priority', { params })
}

export const getCompletionTrend = (params) => {
  return axiosClient.get('/analytics/completion-trend', { params })
}

export const exportTasksCsv = () => {
  return axiosClient.get('/analytics/export', { responseType: 'blob' })
}