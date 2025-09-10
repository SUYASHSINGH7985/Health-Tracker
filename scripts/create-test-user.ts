import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUser() {
  try {
    // Delete existing test user if exists
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com'
      }
    })

    // Create new test user
    const hashedPassword = await bcrypt.hash('Test123!@#', 12)
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        username: 'testuser',
        password: hashedPassword
      }
    })

    console.log('Test user created successfully:', {
      id: user.id,
      email: user.email,
      username: user.username
    })
  } catch (error) {
    console.error('Error creating test user:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTestUser()
