export const authUtils = {
    getToken: () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token')
        }
        return null
    },

    getUser: () => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user')
            return userData ? JSON.parse(userData) : null
        }
        return null
    },

    setAuthData: (token, user) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
        }
    },

    clearAuthData: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    },

    isAuthenticated: () => {
        const token = authUtils.getToken()
        return !!token
    },

    authenticatedFetch: async (url, options = {}) => {
        const token = authUtils.getToken()

        if (!token) {
            throw new Error('No authentication token found')
        }

        const defaultHeaders = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }

        const config = {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers
            }
        }

        return fetch(url, config)
    }
}

import { useState, useEffect } from 'react'

export const useAuth = () => {
    const [user, setUser] = useState(null)
    const [token, setToken] = useState(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const storedUser = authUtils.getUser()
        const storedToken = authUtils.getToken()

        setUser(storedUser)
        setToken(storedToken)
        setIsLoading(false)
    }, [])

    const login = (userData, userToken) => {
        authUtils.setAuthData(userToken, userData)
        setUser(userData)
        setToken(userToken)
    }

    const logout = () => {
        authUtils.clearAuthData()
        setUser(null)
        setToken(null)
    }

    return {
        user,
        token,
        isLoading,
        isAuthenticated: authUtils.isAuthenticated(),
        login,
        logout
    }
}