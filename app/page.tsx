'use client'

import { useState, useEffect, FormEvent } from 'react'

declare global {
  interface Window {
    botpress: {
      updateUser: (data: { data: Record<string, string> }) => void
      on: (event: string, callback: () => void) => void
    }
  }
}

export default function Home() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [webchatReady, setWebchatReady] = useState(false)
  const [scriptsLoaded, setScriptsLoaded] = useState(false)

  useEffect(() => {
    // Only load webchat scripts after successful login
    if (!isLoggedIn) return

    if (!scriptsLoaded) {
      // Load Botpress scripts only on first login
      const script1 = document.createElement('script')
      script1.src = 'https://cdn.botpress.cloud/webchat/v3.5/inject.js'

      script1.onload = () => {
        // Load second script only after first one loads
        const script2 = document.createElement('script')
        script2.src = 'https://files.bpcontent.cloud/2026/01/07/15/20260107150430-TIG10B51.js'
        document.body.appendChild(script2)
      }

      document.body.appendChild(script1)
      setScriptsLoaded(true)

      // Wait for Botpress to load, then listen for initialization
      const waitForBotpress = setInterval(() => {
        if (window.botpress) {
          window.botpress.on('webchat:initialized', () => {
            console.log('webchat:initialized')
            setWebchatReady(true)
          })
          clearInterval(waitForBotpress)
        }
      }, 100)

      return () => clearInterval(waitForBotpress)
    } else {
      // If scripts already loaded (second login), just poll for container
      const interval = setInterval(() => {
        const webchatContainer = document.getElementById('bp-web-widget-container')
        if (webchatContainer) {
          webchatContainer.style.display = 'block'
          setWebchatReady(true)
          clearInterval(interval)
        }
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isLoggedIn])

  const handleLogin = (e: FormEvent) => {
    e.preventDefault()
    setIsLoggedIn(true)
  }

  useEffect(() => {
    if (webchatReady && isLoggedIn && username && password) {
      console.log('Calling updateUser:', { username, password })
      window.botpress.updateUser({
        data: {
          username: username,
          password: password
        }
      })
    }
  }, [webchatReady, isLoggedIn, username, password])

  const handleSignOut = () => {
    // Refresh the page to reset to initial login state
    window.location.reload()
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-xl font-medium mb-2">Welcome, {username}</h1>
        <p className="text-gray-500 mb-6">Chat with our assistant using the bubble.</p>
        <button onClick={handleSignOut} className="text-blue-500 text-sm">
          Sign out
        </button>
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
