-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they exist (be careful with this in production)
DROP TABLE IF EXISTS "completions";
DROP TABLE IF EXISTS "habits";
DROP TABLE IF EXISTS "friendships";
DROP TABLE IF EXISTS "users";

-- Create users table
CREATE TABLE "users" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "password" TEXT NOT NULL,
  "username" TEXT UNIQUE NOT NULL,
  "bio" TEXT,
  "avatar" TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create habits table
CREATE TABLE "habits" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "frequency" TEXT NOT NULL,
  "notes" TEXT,
  "color" TEXT DEFAULT '#3b82f6',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  UNIQUE("userId", "name")
);

-- Create completions table
CREATE TABLE "completions" (
  "id" TEXT PRIMARY KEY,
  "completedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "notes" TEXT,
  "habitId" TEXT NOT NULL REFERENCES "habits"("id") ON DELETE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  UNIQUE("habitId", "completedAt")
);

-- Create friendships table
CREATE TABLE "friendships" (
  "id" TEXT PRIMARY KEY,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  "followerId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "followingId" TEXT NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  UNIQUE("followerId", "followingId")
);

-- Add triggers to automatically update updatedAt
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW."updatedAt" = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON "users"
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at();

CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON "habits"
  FOR EACH ROW
  EXECUTE PROCEDURE update_updated_at();
