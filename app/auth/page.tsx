"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Target, Mail, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react"

interface FormData {
  email: string
  password: string
  confirmPassword: string
  username: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
  username?: string
  general?: string
}

export default function AuthPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("login")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  })

  const validateForm = (isLogin: boolean): boolean => {
    const newErrors: FormErrors = {}

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    // Register-specific validation
    if (!isLogin) {
      if (!formData.username) {
        newErrors.username = "Username is required"
      } else if (formData.username.length < 3) {
        newErrors.username = "Username must be at least 3 characters"
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password"
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (isLogin: boolean) => {
    if (!validateForm(isLogin)) return

    setIsLoading(true)
    setErrors({})

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup"
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, password: formData.password, username: formData.username }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrors({ general: data.error || "Something went wrong" })
        return
      }

      // Redirect to dashboard on success
      router.push("/dashboard")
    } catch (error) {
      setErrors({ general: "Network error. Please try again." })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field-specific error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex">
      {/* Left Side - Motivational Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 p-12 flex-col justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

        <div className="relative z-10 max-w-md text-center space-y-8">
          <div className="space-y-4">
            <Target className="h-16 w-16 text-primary mx-auto" />
            <h1 className="text-4xl font-bold text-foreground text-balance">Build Better Habits</h1>
            <p className="text-lg text-muted-foreground text-balance">
              Transform your life one habit at a time. Track progress, stay motivated, and achieve your goals.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-6 py-8">
            <div className="text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-accent mx-auto" />
              <h3 className="font-semibold text-foreground">Track Progress</h3>
              <p className="text-sm text-muted-foreground">Visual progress tracking</p>
            </div>
            <div className="text-center space-y-2">
              <Target className="h-8 w-8 text-primary mx-auto" />
              <h3 className="font-semibold text-foreground">Stay Focused</h3>
              <p className="text-sm text-muted-foreground">Daily reminders & goals</p>
            </div>
            <div className="text-center space-y-2">
              <User className="h-8 w-8 text-chart-1 mx-auto" />
              <h3 className="font-semibold text-foreground">Social Support</h3>
              <p className="text-sm text-muted-foreground">Connect with friends</p>
            </div>
            <div className="text-center space-y-2">
              <CheckCircle2 className="h-8 w-8 text-chart-2 mx-auto" />
              <h3 className="font-semibold text-foreground">Build Streaks</h3>
              <p className="text-sm text-muted-foreground">Maintain consistency</p>
            </div>
          </div>

          <blockquote className="text-lg font-medium text-foreground text-balance italic">
            "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
          </blockquote>
          <cite className="text-sm text-muted-foreground">— Aristotle</cite>
        </div>
      </div>

      {/* Right Side - Authentication Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center lg:hidden mb-4">
              <Target className="h-8 w-8 text-primary mr-2" />
              <h1 className="text-2xl font-bold text-foreground">HabitFlow</h1>
            </div>
            <h2 className="text-3xl font-bold text-foreground">Welcome</h2>
            <p className="text-muted-foreground">Start your habit-building journey today</p>
          </div>

          {errors.general && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.general}</AlertDescription>
            </Alert>
          )}

          <Card className="shadow-lg border-0 bg-card/50 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-center text-xl">Get Started</CardTitle>
              <CardDescription className="text-center">Choose your preferred method to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="register">Register</TabsTrigger>
                </TabsList>

                <TabsContent value="login" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="Enter your email"
                          className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="Enter your password"
                          className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                        />
                      </div>
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    <Button onClick={() => handleSubmit(true)} disabled={isLoading} className="w-full">
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="register-username">Username</Label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-username"
                          type="text"
                          placeholder="Choose a username"
                          className={`pl-10 ${errors.username ? "border-destructive" : ""}`}
                          value={formData.username}
                          onChange={(e) => handleInputChange("username", e.target.value)}
                        />
                      </div>
                      {errors.username && <p className="text-sm text-destructive">{errors.username}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="Enter your email"
                          className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-password"
                          type="password"
                          placeholder="Create a password"
                          className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                          value={formData.password}
                          onChange={(e) => handleInputChange("password", e.target.value)}
                        />
                      </div>
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="register-confirm-password"
                          type="password"
                          placeholder="Confirm your password"
                          className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        />
                      </div>
                      {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                    </div>

                    <Button onClick={() => handleSubmit(false)} disabled={isLoading} className="w-full">
                      {isLoading ? "Creating account..." : "Create Account"}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <p className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
