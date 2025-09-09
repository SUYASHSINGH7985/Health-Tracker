"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Target,
  TrendingUp,
  CheckCircle,
  Plus,
  Calendar,
  Flame,
  User,
  Users,
  BarChart3,
  Clock,
  AlertCircle,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"

interface Habit {
  id: string
  name: string
  category: string
  frequency: "daily" | "weekly"
  streak: number
  progress: number
  completedToday: boolean
  color: string
  totalCompletions: number
}

export default function HabitTrackerDashboard() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [habits, setHabits] = useState<Habit[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkingIn, setCheckingIn] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      fetchHabits()
    }
  }, [user])

  const fetchHabits = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/habits")

      if (!response.ok) {
        throw new Error("Failed to fetch habits")
      }

      const data = await response.json()
      setHabits(data.habits)
    } catch (error) {
      console.error("Error fetching habits:", error)
      setError("Failed to load habits. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async (habitId: string) => {
    try {
      setCheckingIn(habitId)
      const habit = habits.find((h) => h.id === habitId)

      if (habit?.completedToday) {
        // Undo check-in
        const response = await fetch(`/api/habits/${habitId}/checkin`, {
          method: "DELETE",
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to undo check-in")
        }
      } else {
        // Check in
        const response = await fetch(`/api/habits/${habitId}/checkin`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || "Failed to check in")
        }
      }

      // Refresh habits data
      await fetchHabits()
    } catch (error) {
      console.error("Check-in error:", error)
      setError(error instanceof Error ? error.message : "Check-in failed")
    } finally {
      setCheckingIn(null)
    }
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  const CircularProgress = ({ progress, size = 60 }: { progress: number; size?: number }) => {
    const radius = (size - 8) / 2
    const circumference = radius * 2 * Math.PI
    const strokeDasharray = `${(progress / 100) * circumference} ${circumference}`

    return (
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="transform -rotate-90" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-muted"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            className="text-primary transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-foreground">{progress}%</span>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading your habits...</p>
        </div>
      </div>
    )
  }

  const completedToday = habits.filter((h) => h.completedToday).length
  const totalHabits = habits.length
  const overallProgress = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0
  const bestStreak = habits.length > 0 ? Math.max(...habits.map((h) => h.streak)) : 0

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Target className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">HabitFlow</h1>
              </div>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Button variant="ghost" className="text-primary font-medium">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/friends")}
              >
                <Users className="h-4 w-4 mr-2" />
                Friends
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/profile")}
              >
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </nav>

            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="hidden sm:flex">
                <Flame className="h-3 w-3 mr-1" />
                {bestStreak} day streak
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Progress</p>
                  <p className="text-2xl font-bold text-foreground">
                    {completedToday}/{totalHabits}
                  </p>
                </div>
                <CircularProgress progress={overallProgress} size={50} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Best Streak</p>
                  <p className="text-2xl font-bold text-foreground">{bestStreak}</p>
                </div>
                <Flame className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Habits</p>
                  <p className="text-2xl font-bold text-foreground">{totalHabits}</p>
                </div>
                <Target className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">This Week</p>
                  <p className="text-2xl font-bold text-foreground">85%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Habits Grid */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-foreground">Your Habits</h2>
          <div className="text-sm text-muted-foreground">
            <Clock className="h-4 w-4 inline mr-1" />
            Updated just now
          </div>
        </div>

        {habits.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No habits yet</h3>
              <p className="text-muted-foreground mb-4">Start building better habits by creating your first one.</p>
              <Button onClick={() => router.push("/habits")}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Habit
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {habits.map((habit) => (
              <Card key={habit.id} className="hover:shadow-lg transition-shadow duration-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: habit.color }} />
                      <div>
                        <CardTitle className="text-lg text-balance">{habit.name}</CardTitle>
                        <CardDescription className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {habit.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {habit.frequency === "daily" ? "Daily" : "Weekly"}
                          </span>
                        </CardDescription>
                      </div>
                    </div>
                    <CircularProgress progress={habit.progress} size={45} />
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Streak</span>
                      <div className="flex items-center space-x-1">
                        <Flame className="h-4 w-4 text-accent" />
                        <span className="font-semibold text-foreground">{habit.streak} days</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">{habit.progress}%</span>
                      </div>
                      <Progress value={habit.progress} className="h-2" />
                    </div>

                    <Button
                      onClick={() => handleCheckIn(habit.id)}
                      disabled={checkingIn === habit.id}
                      className={`w-full ${
                        habit.completedToday
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground"
                      }`}
                      variant={habit.completedToday ? "default" : "outline"}
                    >
                      {checkingIn === habit.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                          {habit.completedToday ? "Undoing..." : "Checking in..."}
                        </>
                      ) : habit.completedToday ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Completed Today
                        </>
                      ) : (
                        <>
                          <Calendar className="h-4 w-4 mr-2" />
                          Check In
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Motivational Quote */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardContent className="p-6 text-center">
            <blockquote className="text-lg font-medium text-foreground text-balance mb-2">
              "Success is the sum of small efforts repeated day in and day out."
            </blockquote>
            <cite className="text-sm text-muted-foreground">— Robert Collier</cite>
          </CardContent>
        </Card>
      </main>

      {/* Floating Action Button */}
      <Button
        onClick={() => router.push("/habits")}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
        size="icon"
      >
        <Plus className="h-6 w-6" />
        <span className="sr-only">Create New Habit</span>
      </Button>
    </div>
  )
}
