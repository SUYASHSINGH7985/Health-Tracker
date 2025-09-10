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
      console.log("AuthProvider: Checking auth status...")
      
      const response = await fetch("/api/auth/me", {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
        cache: "no-store",
      })

      console.log("AuthProvider: Auth check response status:", response.status)
      console.log("AuthProvider: Auth check response headers:", {
        contentType: response.headers.get("content-type"),
        cookie: response.headers.get("set-cookie"),
      })
      
      if (!response.ok) {
        console.error("AuthProvider: Auth check failed with status:", response.status)
        throw new Error("Auth check failed")
      }

      const data = await response.json()
      console.log("AuthProvider: Auth check response data:", data)
      
      if (!data.user) {
        console.error("AuthProvider: Invalid auth check response:", data)
        throw new Error("No user data received")
      }

      console.log("AuthProvider: Setting user data:", data.user)
      setUser(data.user)
      return true
    } catch (error) {
      console.error("AuthProvider: Auth check error:", error)
      setUser(null)
      
      if (redirectOnFailure && isProtectedRoute(window.location.pathname)) {
        console.log("AuthProvider: Redirecting to auth page...")
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
      console.log("AuthProvider: Attempting login with email:", email)
      console.log("AuthProvider: Current URL:", window.location.href)
      
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      console.log("AuthProvider: Login response status:", loginResponse.status)
      console.log("AuthProvider: Login response headers:", {
        contentType: loginResponse.headers.get("content-type"),
        cookie: loginResponse.headers.get("set-cookie"),
      })

      if (!loginResponse.ok) {
        const error = await loginResponse.json()
        console.error("AuthProvider: Login failed:", error)
        throw new Error(error.error || "Login failed")
      }

      const loginData = await loginResponse.json()
      console.log("AuthProvider: Login successful, checking auth...")

      // Small delay to ensure cookie is set
      console.log("AuthProvider: Waiting for cookie to be set...")
      await new Promise(resolve => setTimeout(resolve, 100))

      // Verify auth state after login
      console.log("AuthProvider: Verifying auth state...")
      const authChecked = await checkAuth(false)
      console.log("AuthProvider: Auth verification result:", authChecked)
      
      if (!authChecked) {
        console.error("AuthProvider: Auth verification failed")
        throw new Error("Authentication verification failed")
      }

      console.log("AuthProvider: Login and auth verification complete, redirecting to dashboard...")
      router.push("/dashboard")
    } catch (error) {
      console.error("AuthProvider: Login error:", error)
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
