"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Users, User, BarChart3, Flame, Trophy, UserPlus, UserMinus, Settings, Edit3 } from "lucide-react"

interface UserProfile {
  id: string
  name: string
  username: string
  bio: string
  avatar: string
  totalHabits: number
  completedHabits: number
  currentStreak: number
  longestStreak: number
  joinDate: string
}

interface Habit {
  id: string
  name: string
  category: string
  frequency: "daily" | "weekly"
  streak: number
  progress: number
  color: string
}

interface Connection {
  id: string
  name: string
  username: string
  avatar: string
  isFollowing: boolean
  mutualFriends: number
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("habits")

  const userProfile: UserProfile = {
    id: "1",
    name: "Alex Johnson",
    username: "@alexj",
    bio: "Building better habits one day at a time. Fitness enthusiast, book lover, and productivity geek. 🎯",
    avatar: "/professional-headshot.png",
    totalHabits: 12,
    completedHabits: 847,
    currentStreak: 23,
    longestStreak: 45,
    joinDate: "January 2024",
  }

  const userHabits: Habit[] = [
    {
      id: "1",
      name: "Morning Meditation",
      category: "Wellness",
      frequency: "daily",
      streak: 23,
      progress: 95,
      color: "bg-primary",
    },
    {
      id: "2",
      name: "Read 30 Minutes",
      category: "Learning",
      frequency: "daily",
      streak: 18,
      progress: 88,
      color: "bg-accent",
    },
    {
      id: "3",
      name: "Exercise",
      category: "Health",
      frequency: "daily",
      streak: 15,
      progress: 82,
      color: "bg-chart-1",
    },
    {
      id: "4",
      name: "Weekly Planning",
      category: "Productivity",
      frequency: "weekly",
      streak: 8,
      progress: 100,
      color: "bg-chart-2",
    },
  ]

  const [followers] = useState<Connection[]>([
    {
      id: "1",
      name: "Sarah Chen",
      username: "@sarahc",
      avatar: "/woman-profile.png",
      isFollowing: true,
      mutualFriends: 5,
    },
    {
      id: "2",
      name: "Mike Rodriguez",
      username: "@mikerod",
      avatar: "/man-profile.png",
      isFollowing: false,
      mutualFriends: 3,
    },
    {
      id: "3",
      name: "Emma Wilson",
      username: "@emmaw",
      avatar: "/woman-profile.png",
      isFollowing: true,
      mutualFriends: 8,
    },
  ])

  const [following] = useState<Connection[]>([
    {
      id: "4",
      name: "David Kim",
      username: "@davidk",
      avatar: "/man-profile.png",
      isFollowing: true,
      mutualFriends: 2,
    },
    {
      id: "5",
      name: "Lisa Thompson",
      username: "@lisat",
      avatar: "/woman-profile.png",
      isFollowing: true,
      mutualFriends: 6,
    },
  ])

  const handleFollowToggle = (connectionId: string, isCurrentlyFollowing: boolean) => {
    // Handle follow/unfollow logic here
    console.log(`${isCurrentlyFollowing ? "Unfollowing" : "Following"} user ${connectionId}`)
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
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                <Users className="h-4 w-4 mr-2" />
                Friends
              </Button>
              <Button variant="ghost" className="text-primary font-medium">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
            </nav>

            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
                {/* Profile Picture */}
                <div className="relative">
                  <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                    <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
                      {userProfile.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <Button size="sm" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" variant="secondary">
                    <Edit3 className="h-3 w-3" />
                  </Button>
                </div>

                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-4">
                    <h2 className="text-3xl font-bold text-foreground mb-1">{userProfile.name}</h2>
                    <p className="text-muted-foreground mb-3">{userProfile.username}</p>
                    <p className="text-foreground text-balance max-w-md">{userProfile.bio}</p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{userProfile.totalHabits}</div>
                      <div className="text-sm text-muted-foreground">Active Habits</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{userProfile.completedHabits}</div>
                      <div className="text-sm text-muted-foreground">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Flame className="h-5 w-5 text-accent" />
                        <span className="text-2xl font-bold text-foreground">{userProfile.currentStreak}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Current Streak</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <Trophy className="h-5 w-5 text-accent" />
                        <span className="text-2xl font-bold text-foreground">{userProfile.longestStreak}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">Best Streak</div>
                    </div>
                  </div>
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
              <span>My Habits</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userHabits.map((habit) => (
                <Card key={habit.id} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${habit.color}`} />
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
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Streak</span>
                      <div className="flex items-center space-x-1">
                        <Flame className="h-4 w-4 text-accent" />
                        <span className="font-semibold text-foreground">{habit.streak} days</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Followers Tab */}
          <TabsContent value="followers" className="space-y-4">
            {followers.map((follower) => (
              <Card key={follower.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={follower.avatar || "/placeholder.svg"} alt={follower.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {follower.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{follower.name}</h3>
                        <p className="text-sm text-muted-foreground">{follower.username}</p>
                        <p className="text-xs text-muted-foreground">{follower.mutualFriends} mutual friends</p>
                      </div>
                    </div>
                    <Button
                      variant={follower.isFollowing ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleFollowToggle(follower.id, follower.isFollowing)}
                    >
                      {follower.isFollowing ? (
                        <>
                          <UserMinus className="h-4 w-4 mr-2" />
                          Unfollow
                        </>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Follow Back
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Following Tab */}
          <TabsContent value="following" className="space-y-4">
            {following.map((person) => (
              <Card key={person.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={person.avatar || "/placeholder.svg"} alt={person.name} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {person.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">{person.name}</h3>
                        <p className="text-sm text-muted-foreground">{person.username}</p>
                        <p className="text-xs text-muted-foreground">{person.mutualFriends} mutual friends</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleFollowToggle(person.id, true)}>
                      <UserMinus className="h-4 w-4 mr-2" />
                      Unfollow
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
