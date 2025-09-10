import bcrypt from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "./prisma"

// Environment variables with fallbacks
const JWT_SECRET = process.env.JWT_SECRET || "habits_jwt_secret_key_2025_09_10_v1"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d"
const COOKIE_NAME = process.env.COOKIE_NAME || "auth-token"
const COOKIE_MAX_AGE = parseInt(process.env.COOKIE_MAX_AGE || "604800", 10) // 7 days in seconds

interface JWTPayload {
  userId: string
  iat?: number
  exp?: number
}

type JoseJWTPayload = {
  userId: string
  iat?: number
  exp?: number
  [key: string]: unknown
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

/**
 * Generate a JWT token for a user
 */
export async function generateToken(userId: string): Promise<string> {
  const secret = new TextEncoder().encode(JWT_SECRET)
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRES_IN)
    .sign(secret)
  return token
}

/**
 * Verify a JWT token
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const josePayload = payload as JoseJWTPayload
    
    if (!josePayload.userId) {
      console.error("Token payload missing userId")
      return null
    }
    
    return {
      userId: josePayload.userId,
      iat: josePayload.iat,
      exp: josePayload.exp
    }
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

/**
 * Set auth cookie in response
 */
export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: COOKIE_MAX_AGE,
  })
}

/**
 * Clear auth cookie in response
 */
export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  })
}

/**
 * Get current user from request
 */
export async function getCurrentUser(request: NextRequest) {
  // Get token from cookie
  const token = request.cookies.get(COOKIE_NAME)?.value
  if (!token) {
    return null
  }

  // Verify token
  const payload = await verifyToken(token)
  if (!payload) {
    return null
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: payload.userId },
    select: {
      id: true,
      email: true,
      username: true,
      bio: true,
      avatar: true,
      createdAt: true,
    }
  })

  return user
}
