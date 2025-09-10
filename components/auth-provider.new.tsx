"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: string
  email: string
  username: string
  bio?: string
  avatar?: string
  createdAt: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, username: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const router = useRouter()

  // Function to check if current route requires auth
  const isProtectedRoute = (path: string) => {
    const publicRoutes = ["/", "/auth"]
    return !publicRoutes.includes(path)
  }

  const checkAuth = async (redirectOnFailure = true) => {
    try {
      console.log("Checking auth status...")
      
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
      })

      console.log("Auth check response:", response.status)
      
      if (!response.ok) {
        throw new Error("Auth check failed")
      }

      const data = await response.json()
      console.log("Auth check data:", data)
      
      if (data.user) {
        setUser(data.user)
        return true
      } else {
        throw new Error("No user data received")
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setUser(null)
      
      if (redirectOnFailure && isProtectedRoute(window.location.pathname)) {
        router.push("/auth")
      }
      return false
    } finally {
      setLoading(false)
      setInitialized(true)
    }
  }

  // Initial auth check on mount
  useEffect(() => {
    checkAuth(false) // Don't redirect on initial load
  }, [])

  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      console.log("Attempting login...")
      const response = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("Login response status:", response.status)
      const data = await response.json()
      console.log("Login response data:", data)

      if (!response.ok) {
        throw new Error(data.error || "Login failed")
      }

      if (!data.user) {
        throw new Error("No user data received")
      }

      // Set the user data immediately
      setUser(data.user)
      
      // Navigate to dashboard on success
      console.log("Login successful, redirecting to dashboard...")
      router.push("/dashboard")
    } catch (error) {
      console.error("Login error:", error)
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    login,
    signup: async (email: string, password: string, username: string) => {
      setLoading(true)
      try {
        const response = await fetch("/api/auth/signup", {
          method: "POST",
          credentials: "include",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password, username }),
        })

        console.log("Signup response status:", response.status)
        const data = await response.json()
        console.log("Signup response data:", data)

        if (!response.ok) {
          throw new Error(data.error || "Signup failed")
        }

        if (!data.user) {
          throw new Error("No user data received")
        }

        setUser(data.user)
        router.push("/dashboard")
      } catch (error) {
        console.error("Signup error:", error)
        setUser(null)
        throw error
      } finally {
        setLoading(false)
      }
    },
    logout: async () => {
      try {
        await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        })
        setUser(null)
        router.push("/auth")
      } catch (error) {
        console.error("Logout failed:", error)
        throw error
      }
    },
  }

  // Wait for initial auth check before rendering children
  if (!initialized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
