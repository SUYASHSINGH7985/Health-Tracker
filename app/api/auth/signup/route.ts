import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth"
import { z } from "zod"

// Force Node.js runtime
export const runtime = 'nodejs'

// Validation schema for signup request
const signupSchema = z.object({
  email: z
    .string()
    .email("Invalid email address")
    .min(1, "Email is required")
    .max(255, "Email is too long")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username is too long")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .trim(),
})

export async function POST(request: NextRequest) {
  try {
    console.log('Starting signup process...')
    
    // Parse and validate request body
    const body = await request.json()
    console.log('Received signup request:', { ...body, password: '[REDACTED]' })
    
    const validatedData = signupSchema.parse(body)
    const { email, password, username } = validatedData
    console.log('Validation passed for:', { email, username })

    // Check for existing user
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: { equals: email, mode: "insensitive" } },
          { username: { equals: username, mode: "insensitive" } },
        ],
      },
    })

    if (existingUser) {
      return NextResponse.json({
        error: existingUser.email.toLowerCase() === email.toLowerCase()
          ? "Email already registered"
          : "Username already taken"
      }, { status: 400 })
    }

    // Create new user with hashed password
    const hashedPassword = await hashPassword(password)
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
      select: {
        id: true,
        email: true,
        username: true,
        bio: true,
        avatar: true,
        createdAt: true,
      },
    })

    // Generate authentication token
    const token = generateToken(newUser.id)

    // Create response with user data
    const response = NextResponse.json({
      user: newUser,
      message: "Registration successful"
    }, { status: 201 })

    // Set authentication cookie
    setAuthCookie(response, token)

    return response
  } catch (error) {
    console.error("Signup error:", error)

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: error.errors[0].message
      }, { status: 400 })
    }

    // Handle other errors
    return NextResponse.json({
      error: "Registration failed. Please try again later."
    }, { status: 500 })
  }
}
