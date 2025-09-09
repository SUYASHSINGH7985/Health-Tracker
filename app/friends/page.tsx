"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Users,
  UserPlus,
  UserMinus,
  Search,
  Flame,
  CheckCircle2,
  Clock,
  AlertCircle,
  Heart,
} from "lucide-react"

interface User {
  id: string
  username: string
  avatar?: string
  bio?: string
  totalHabits: number
  totalCompletions: number
  followersCount?: number
}

interface Activity {
  id: string
  completedAt: string
  notes?: string
  streak: number
  user: {
    id: string
    username: string
    avatar?: string
  }
  habit: {
    id: string
    name: string
    category: string
    frequency: string
    color: string
  }
}

export default function FriendsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("activity")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<User[]>([])
  const [following, setFollowing] = useState<User[]>([])
  const [followers, setFollowers] = useState<User[]>([])
  const [activity, setActivity] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [followingUser, setFollowingUser] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchData()
    }
  }, [user, activeTab])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      if (activeTab === "activity") {
        const response = await fetch("/api/friends?type=activity")
        if (response.ok) {
          const data = await response.json()
          setActivity(data.activity)
        }
      } else if (activeTab === "following") {
        const response = await fetch("/api/friends?type=following")
        if (response.ok) {
          const data = await response.json()
          setFollowing(data.following)
        }
      } else if (activeTab === "followers") {
        const response = await fetch("/api/friends?type=followers")
        if (response.ok) {
          const data = await response.json()
          setFollowers(data.followers)
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to load data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const searchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    try {
      const response = await fetch(`/api/users/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.users)
      }
    } catch (error) {
      console.error("Error searching users:", error)
    }
  }

  const handleFollow = async (userId: string) => {
    try {
      setFollowingUser(userId)
      const response = await fetch("/api/friends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to follow user")
      }

      // Remove from search results and refresh data
      setSearchResults((prev) => prev.filter((u) => u.id !== userId))
      await fetchData()
    } catch (error) {
      console.error("Follow error:", error)
      setError(error instanceof Error ? error.message : "Failed to follow user")
    } finally {
      setFollowingUser(null)
    }
  }

  const handleUnfollow = async (userId: string) => {
    try {
      setFollowingUser(userId)
      const response = await fetch(`/api/friends/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || "Failed to unfollow user")
      }

      await fetchData()
    } catch (error) {
      console.error("Unfollow error:", error)
      setError(error instanceof Error ? error.message : "Failed to unfollow user")
    } finally {
      setFollowingUser(null)
    }
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Just now"
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return `${Math.floor(diffInDays / 7)}w ago`
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      health: "bg-green-500",
      study: "bg-blue-500",
      personal: "bg-purple-500",
      work: "bg-orange-500",
    }
    return colors[category as keyof typeof colors] || "bg-gray-500"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
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
            <div className="flex items-center space-x-2">
              <Users className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Friends & Activity</h1>
            </div>
            <div className="w-32"></div>
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

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="activity">Activity Feed</TabsTrigger>
            <TabsTrigger value="search">Find Friends</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
            <TabsTrigger value="followers">Followers</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Activity Feed</h2>
              <p className="text-muted-foreground">See what your friends are up to</p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading activity...</p>
              </div>
            ) : activity.length === 0 ? (
              <Card className="text-center py-12">
                <CardContent>
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No activity yet</h3>
                  <p className="text-muted-foreground mb-4">Follow some friends to see their habit completions here.</p>
                  <Button onClick={() => setActiveTab("search")}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Find Friends
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activity.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={item.user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{item.user.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="font-semibold text-foreground">{item.user.username}</span>
                              <span className="text-muted-foreground">completed</span>
                              <Badge variant="outline" className="text-xs">
                                {item.habit.category}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {formatTimeAgo(item.completedAt)}
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${getCategoryColor(item.habit.category)}`} />
                            <span className="font-medium text-foreground">{item.habit.name}</span>
                            <div className="flex items-center space-x-1">
                              <Flame className="h-4 w-4 text-orange-500" />
                              <span className="text-sm font-medium">{item.streak} day streak</span>
                            </div>
                          </div>
                          {item.notes && <p className="text-sm text-muted-foreground italic">"{item.notes}"</p>}
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Find Friends</h2>
              <p className="text-muted-foreground">Search for users to follow and get motivated together</p>
            </div>

            <div className="flex space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username or email..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchUsers()}
                />
              </div>
              <Button onClick={searchUsers}>Search</Button>
            </div>

            <div className="space-y-4">
              {searchResults.map((searchUser) => (
                <Card key={searchUser.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={searchUser.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{searchUser.username[0].toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">{searchUser.username}</h3>
                          {searchUser.bio && <p className="text-sm text-muted-foreground">{searchUser.bio}</p>}
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-muted-foreground">{searchUser.totalHabits} habits</span>
                            <span className="text-xs text-muted-foreground">
                              {searchUser.totalCompletions} completions
                            </span>
                            {searchUser.followersCount !== undefined && (
                              <span className="text-xs text-muted-foreground">
                                {searchUser.followersCount} followers
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => handleFollow(searchUser.id)}
                        disabled={followingUser === searchUser.id}
                        size="sm"
                      >
                        {followingUser === searchUser.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                            Following...
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-4 w-4 mr-2" />
                            Follow
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="following" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Following</h2>
              <p className="text-muted-foreground">Users you're following</p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {following.map((followedUser) => (
                  <Card key={followedUser.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={followedUser.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{followedUser.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">{followedUser.username}</h3>
                            {followedUser.bio && <p className="text-sm text-muted-foreground">{followedUser.bio}</p>}
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs text-muted-foreground">{followedUser.totalHabits} habits</span>
                              <span className="text-xs text-muted-foreground">
                                {followedUser.totalCompletions} completions
                              </span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => handleUnfollow(followedUser.id)}
                          disabled={followingUser === followedUser.id}
                          size="sm"
                        >
                          {followingUser === followedUser.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                              Unfollowing...
                            </>
                          ) : (
                            <>
                              <UserMinus className="h-4 w-4 mr-2" />
                              Unfollow
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="followers" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">Followers</h2>
              <p className="text-muted-foreground">Users following you</p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {followers.map((follower) => (
                  <Card key={follower.id}>
                    <CardContent className="p-4">
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
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
