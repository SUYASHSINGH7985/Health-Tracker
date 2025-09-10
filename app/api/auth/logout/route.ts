import { type NextRequest, NextResponse } from "next/server"

// Force Node.js runtime
export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  console.log("Logging out user...")
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  })

  response.cookies.set("auth-token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0, // Expire immediately
  })

  console.log("Auth cookie cleared")
  return response
}
