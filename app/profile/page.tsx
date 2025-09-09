"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Target,
  Users,
  User,
  BarChart3,
  Flame,
  Trophy,
  UserPlus,
  UserMinus,
  Edit3,
  ArrowLeft,
  Save,
  X,
  AlertCircle,
} from "lucide-react"

interface UserProfile {
  id: string
  email: string
  username: string
  bio?: string
  avatar?: string
  createdAt: string
  totalHabits: number
  totalCompletions: number
  followersCount: number
  followingCount: number
  currentStreak: number
  longestStreak: number
  habits: Array<{
    id: string
    name: string
    category: string
    frequency: string
    streak: number
    progress: number
    color: string
    totalCompletions: number
  }>
}

interface Connection {
  id: string
  username: string
  avatar?: string
  bio?: string
  totalHabits: number
  totalCompletions: number
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("habits")
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [followers, setFollowers] = useState<Connection[]>([])
  const [following, setFollowing] = useState<Connection[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({
    username: "",
    bio: "",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchProfile()
      fetchConnections()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/profile")

      if (!response.ok) {
        throw new Error("Failed to fetch profile")
      }

      const data = await response.json()
      setProfile(data.profile)
      setEditForm({
        username: data.profile.username,
        bio: data.profile.bio || "",
      })
    } catch (error) {
      console.error("Error fetching profile:", error)
      setError("Failed to load profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchConnections = async () => {
    try {
      // Fetch followers
      const followersResponse = await fetch("/api/friends?type=followers")
      if (followersResponse.ok) {
        const followersData = await followersResponse.json()
        setFollowers(followersData.followers)
      }

      // Fetch following
      const followingResponse = await fetch("/api/friends?type=following")
      if (followingResponse.ok) {
        const followingData = await followingResponse.json()
        setFollowing(followingData.following)
      }
    } catch (error) {
      console.error("Error fetching connections:", error)
    }
  }

  const handleSaveProfile = async () => {
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to update profile")
      }

      await fetchProfile()
      setIsEditing(false)
      setError(null)
    } catch (error) {
      console.error("Error updating profile:", error)
      setError(error instanceof Error ? error.message : "Failed to update profile")
    }
  }

  const handleUnfollow = async (userId: string) => {
    try {
      const response = await fetch(`/api/friends/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to unfollow user")
      }

      await fetchConnections()
    } catch (error) {
      console.error("Error unfollowing user:", error)
      setError("Failed to unfollow user")
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

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/dashboard")}
                className="text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <Button
                variant="ghost"
                className="text-muted-foreground hover:text-foreground"
                onClick={() => router.push("/dashboard")}
              >
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
              <Button variant="ghost" className="text-primary font-medium">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </nav>

            <div className="flex items-center space-x-2">
              <Target className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Profile</h1>
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

        {/* Profile Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Picture */}
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.username} />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {profile.username[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                    variant="secondary"
                    onClick={() => setIsEditing(!isEditing)}
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  {isEditing ? (
                    <div className="space-y-4 max-w-md">
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          value={editForm.username}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={editForm.bio}
                          onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                          placeholder="Tell us about yourself..."
                          className="min-h-[80px]"
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button onClick={handleSaveProfile} size="sm">
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} size="sm">
                          <X className="h-4 w-4 mr-2" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-4">
                      <h2 className="text-3xl font-bold text-foreground mb-1">{profile.username}</h2>
                      <p className="text-muted-foreground mb-3">{profile.email}</p>
                      <p className="text-foreground text-balance max-w-md">
                        {profile.bio || "No bio yet. Click the edit button to add one!"}
                      </p>
                    </div>
                  )}

                  {!isEditing && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">{profile.totalHabits}</div>
                        <div className="text-sm text-muted-foreground">Active Habits</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{profile.totalCompletions}</div>
                        <div className="text-sm text-muted-foreground">Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Flame className="h-5 w-5 text-accent" />
                          <span className="text-2xl font-bold text-foreground">{profile.currentStreak}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Current Streak</div>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center space-x-1">
                          <Trophy className="h-5 w-5 text-accent" />
                          <span className="text-2xl font-bold text-foreground">{profile.longestStreak}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">Best Streak</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="habits" className="flex items-center space-x-2">
              <Target className="h-4 w-4" />
              <span>My Habits ({profile.habits.length})</span>
            </TabsTrigger>
            <TabsTrigger value="followers" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Followers ({followers.length})</span>
            </TabsTrigger>
            <TabsTrigger value="following" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Following ({following.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* My Habits Tab */}
          <TabsContent value="habits" className="space-y-6">
            {profile.habits.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No habits yet</h3>
                  <p className="text-muted-foreground mb-4">Start building better habits by creating your first one.</p>
                  <Button onClick={() => router.push("/habits")}>
                    <Target className="h-4 w-4 mr-2" />
                    Create Your First Habit
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.habits.map((habit) => (
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
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Current Streak</span>
                          <div className="flex items-center space-x-1">
                            <Flame className="h-4 w-4 text-accent" />
                            <span className="font-semibold text-foreground">{habit.streak} days</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Total Completions</span>
                          <span className="font-semibold text-foreground">{habit.totalCompletions}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Followers Tab */}
          <TabsContent value="followers" className="space-y-4">
            {followers.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No followers yet</h3>
                  <p className="text-muted-foreground">Share your profile to get followers!</p>
                </CardContent>
              </Card>
            ) : (
              followers.map((follower) => (
                <Card key={follower.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={follower.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{follower.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{follower.username}</h3>
                          {follower.bio && <p className="text-sm text-muted-foreground">{follower.bio}</p>}
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-muted-foreground">{follower.totalHabits} habits</span>
                            <span className="text-xs text-muted-foreground">
                              {follower.totalCompletions} completions
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          {/* Following Tab */}
          <TabsContent value="following" className="space-y-4">
            {following.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">Not following anyone yet</h3>
                  <p className="text-muted-foreground mb-4">Find friends to follow and get motivated together!</p>
                  <Button onClick={() => router.push("/friends")}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Find Friends
                  </Button>
                </CardContent>
              </Card>
            ) : (
              following.map((person) => (
                <Card key={person.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={person.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{person.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{person.username}</h3>
                          {person.bio && <p className="text-sm text-muted-foreground">{person.bio}</p>}
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-muted-foreground">{person.totalHabits} habits</span>
                            <span className="text-xs text-muted-foreground">{person.totalCompletions} completions</span>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => handleUnfollow(person.id)}>
                        <UserMinus className="h-4 w-4 mr-2" />
                        Unfollow
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
