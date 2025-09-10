import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function setupTestUser() {
  try {
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
