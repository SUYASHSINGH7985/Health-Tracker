import fetch from 'node-fetch'

async function testLogin() {
  try {
    console.log('Testing login...')
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'Password123!'
      })
    })

    const data = await response.json()
    console.log('Status:', response.status)
    console.log('Response:', data)

  } catch (error) {
    console.error('Error testing login:', error)
  }
}

testLogin()
