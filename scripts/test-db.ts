import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

// Configure Prisma client with direct database access and SSL
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL + '&pgbouncer=true'
    }
  }
})

async function testConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test the connection with a simple query
    const result = await prisma.$queryRaw`SELECT 1`
    console.log('Database connection successful:', result)
    
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

async function setupTestUser() {
  try {
    // Test connection first
    const isConnected = await testConnection()
    if (!isConnected) {
      throw new Error('Could not establish database connection')
    }

    console.log('Setting up test user...')

    // Delete test user if exists
    await prisma.user.deleteMany({
      where: {
        email: {
          equals: 'test@example.com',
          mode: 'insensitive'
        }
      }
    })

    // Create test user
    const hashedPassword = await bcrypt.hash('Test123!@#', 12)
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword
      }
    })

    console.log('Test user created successfully:')
    console.log({
      id: user.id,
      email: user.email,
      username: user.username
    })

    console.log('\nYou can now log in with:')
    console.log('Email: test@example.com')
    console.log('Password: Test123!@#')

  } catch (error) {
    console.error('Error setting up test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupTestUser()
