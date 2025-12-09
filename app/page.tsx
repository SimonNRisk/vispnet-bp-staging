'use client'

import { useState, useEffect, FormEvent } from 'react'

declare global {
  interface Window {
    botpress?: {
      on: (event: string, callback: () => void) => void
      updateUser: (data: { data: Record<string, string> }) => void
    }
  }
}

export default function Home() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (!window.botpress) {
        return
      }
      window.botpress.on('webchat:initialized', () => {
        console.log('Webchat initialized')
      })
      clearInterval(interval)
    }, 100)
  }, [])

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()

    // Send user data to Botpress
    // https://botpress.com/docs/webchat/interact/send-user-data
    console.log('window.botpress exists:', !!window.botpress)
    console.log('Calling updateUser:', { username, password })
    window.botpress?.updateUser({
      data: {
        username: username,
        password: password
      }
    })
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // const user = await window.botpress.getUser()
    // console.log({ user })
    setIsLoggedIn(true)
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-xl font-medium mb-2">Welcome, {username}</h1>
        <p className="text-gray-500 mb-6">Chat with our assistant below.</p>
        <button
          onClick={() => {
            setIsLoggedIn(false)
            setUsername('')
            setPassword('')
          }}
          className="text-blue-500 text-sm"
        >
          Sign out
        </button>
        <div id="bp-embedded-webchat" className="mt-8 w-full max-w-md h-[500px]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-xl font-medium text-center mb-8">Vispnet</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm mb-1">
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 bg-transparent border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 bg-transparent border border-gray-700 rounded text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <button type="submit" className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
