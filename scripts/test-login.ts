import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testLoginFlow() {
  try {
    console.log('Creating test user...')
    
    // Delete test user if exists
    await prisma.user.deleteMany({
      where: {
        email: 'test@example.com'
      }
    })

    // Create test user
    const hashedPassword = await hashPassword('Password123!')
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        password: hashedPassword,
        username: 'testuser',
      }
    })

    console.log('Test user created:', { id: user.id, email: user.email })

    // Verify the user exists
    const foundUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' }
    })

    console.log('User lookup result:', foundUser ? 'Found' : 'Not found')
    if (foundUser) {
      console.log('User details:', {
        id: foundUser.id,
        email: foundUser.email,
        username: foundUser.username
      })
    }

  } catch (error) {
    console.error('Error in test:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testLoginFlow()
