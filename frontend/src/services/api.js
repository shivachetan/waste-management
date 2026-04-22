import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  const auth = localStorage.getItem('auth')
  if (auth) {
    const { token } = JSON.parse(auth)
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// API Service object with mock functions
export const apiService = {
  // Auth endpoints
  auth: {
    login: (email, password) => {
      // Mock implementation
      return Promise.resolve({
        data: {
          user: { id: 1, email, type: 'giver' },
          token: 'mock_token',
        },
      })
    },
    register: (email, password, userType, details) => {
      return Promise.resolve({
        data: {
          user: { id: 1, email, type: userType, ...details },
          token: 'mock_token',
        },
      })
    },
  },

  // Waste Requests endpoints
  requests: {
    create: (data) => api.post('/requests', data),
    getAll: () => api.get('/requests'),
    getById: (id) => api.get(`/requests/${id}`),
    update: (id, data) => api.put(`/requests/${id}`, data),
    getByGiver: (giverId) => api.get(`/requests?giverId=${giverId}`),
  },

  // Driver endpoints
  drivers: {
    getNearby: (lat, lng, radius = 5) =>
      api.get(`/drivers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`),
    getById: (id) => api.get(`/drivers/${id}`),
    acceptRequest: (driverId, requestId) =>
      api.put(`/drivers/${driverId}/accept`, { requestId }),
    updateLocation: (driverId, lat, lng) =>
      api.put(`/drivers/${driverId}/location`, { latitude: lat, longitude: lng }),
    getRoute: (driverId) => api.get(`/drivers/${driverId}/route`),
    markDumped: (driverId) => api.put(`/drivers/${driverId}/dump`),
    register: (data) => api.post('/drivers', data),
  },

  // Admin endpoints
  admin: {
    getDashboard: () => api.get('/admin/dashboard'),
    getAllRequests: () => api.get('/admin/requests'),
    getAllDrivers: () => api.get('/admin/drivers'),
  },
}

export default api
