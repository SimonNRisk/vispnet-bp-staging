import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vispnet',
  description: 'Vispnet portal'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        {/* Must use v3.3 for updateUser to work */}

        <script src="https://cdn.botpress.cloud/webchat/v3.5/inject.js"></script>
        <script src="https://files.bpcontent.cloud/2026/01/07/15/20260107150430-TIG10B51.js" defer></script>

      </body>
    </html>
  )
}
