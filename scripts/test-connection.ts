import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
})

async function testConnection() {
  try {
    console.log('Testing database connection...')
    
    // Test the connection by running a simple query
    const result = await prisma.$queryRaw`SELECT 1 as result;`
    console.log('Connection successful!', result)
    
    // Get database version
    const version = await prisma.$queryRaw`SELECT version();`
    console.log('Database version:', version)
    
  } catch (error) {
    console.error('Connection failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()
