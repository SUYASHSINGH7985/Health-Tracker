import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

// Routes that don't require authentication
const PUBLIC_ROUTES = new Set([
  // Pages
  "/",
  "/auth",
  "/login",
  "/signup",
  // API routes
  "/api/auth/login",
  "/api/auth/signup",
  "/api/auth/logout",
])

// Routes that should redirect to dashboard if authenticated
const AUTH_ROUTES = new Set(["/auth", "/login", "/signup"])

// JWT verification for Edge runtime
async function verifyAuthToken(token: string) {
  if (!token) return null
  
  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "habits_jwt_secret_key_2025_09_10_v1"
    )
    const { payload } = await jwtVerify(token, secret)
    return payload
  } catch (error) {
    console.error("Token verification error:", error)
    return null
  }
}

export async function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl

  // Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.has(pathname)
  
  // Get token from cookie
  const token = request.cookies.get("auth-token")?.value

  // Handle unauthenticated requests
  if (!token) {
    // Allow access to public routes
    if (isPublicRoute) {
      return NextResponse.next()
    }
    
    // Redirect to login for protected routes
    const loginUrl = new URL("/auth", request.url)
    loginUrl.searchParams.set("from", pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Verify token if present
  const payload = await verifyAuthToken(token)
  if (!payload) {
    // Clear invalid token
    const response = NextResponse.redirect(new URL("/auth", request.url))
    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 0,
    })
    return response
  }

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.has(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Allow access to protected routes for authenticated users
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - api/auth/* (auth endpoints)
     * - _next/* (Next.js files)
     * - public/* (public assets)
     * - *.* (files with extensions)
     */
    "/((?!api/auth/|_next/|public/|[\\w-]+\\.[\\w-]+$).*)",
  ],
}
