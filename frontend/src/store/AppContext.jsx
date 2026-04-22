import React, { createContext, useState, useCallback } from 'react'

export const AppContext = createContext()

export const AppProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
  })

  const [requests, setRequests] = useState([])
  const [drivers, setDrivers] = useState([])
  const [notifications, setNotifications] = useState([])

  // Mock login
  const login = useCallback((email, password, userType) => {
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      type: userType,
      name: email.split('@')[0],
    }
    const mockToken = `token_${Date.now()}`

    setAuth({
      isAuthenticated: true,
      user: mockUser,
      token: mockToken,
    })

    // Store in localStorage
    localStorage.setItem('auth', JSON.stringify({
      user: mockUser,
      token: mockToken,
    }))
  }, [])

  // Mock logout
  const logout = useCallback(() => {
    setAuth({
      isAuthenticated: false,
      user: null,
      token: null,
    })
    localStorage.removeItem('auth')
  }, [])

  // Mock register
  const register = useCallback((email, password, userType, details) => {
    const mockUser = {
      id: `user_${Date.now()}`,
      email,
      type: userType,
      name: email.split('@')[0],
      ...details,
    }
    const mockToken = `token_${Date.now()}`

    setAuth({
      isAuthenticated: true,
      user: mockUser,
      token: mockToken,
    })

    localStorage.setItem('auth', JSON.stringify({
      user: mockUser,
      token: mockToken,
    }))
  }, [])

  // Add notification
  const addNotification = useCallback((message, type = 'info') => {
    const id = `notif_${Date.now()}`
    setNotifications(prev => [...prev, { id, message, type }])

    // Auto-remove after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id))
    }, 5000)
  }, [])

  // Restore auth from localStorage on mount
  React.useEffect(() => {
    const stored = localStorage.getItem('auth')
    if (stored) {
      const { user, token } = JSON.parse(stored)
      setAuth({
        isAuthenticated: true,
        user,
        token,
      })
    }
  }, [])

  const value = {
    auth,
    login,
    logout,
    register,
    requests,
    setRequests,
    drivers,
    setDrivers,
    notifications,
    addNotification,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

// Custom hook to use context
export const useApp = () => {
  const context = React.useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
