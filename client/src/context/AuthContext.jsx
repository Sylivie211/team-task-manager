import { createContext, useCallback, useContext, useState } from 'react'
import { loginUser, registerUser } from '../api/authApi.js'
import { setAuthToken } from '../api/axiosClient.js'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)

  const login = useCallback(async (credentials) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const response = await loginUser(credentials)
      const { token: newToken, user: loggedInUser } = response.data.data
      setAuthToken(newToken)
      setToken(newToken)
      setUser(loggedInUser)
      return true
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Unable to log in')
      return false
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const register = useCallback(async (details) => {
    setAuthLoading(true)
    setAuthError(null)
    try {
      const response = await registerUser(details)
      const { token: newToken, user: newUser } = response.data.data
      setAuthToken(newToken)
      setToken(newToken)
      setUser(newUser)
      return true
    } catch (error) {
      setAuthError(error.response?.data?.message || 'Unable to register')
      return false
    } finally {
      setAuthLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setAuthToken(null)
    setToken(null)
    setUser(null)
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token),
    authLoading,
    authError,
    login,
    register,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}