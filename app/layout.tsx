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
        <script src="https://cdn.botpress.cloud/webchat/v3.5/inject.js"></script>
        <script src="https://files.bpcontent.cloud/2025/12/09/21/20251209214238-BRGDOS1V.js" defer></script>
      </body>
    </html>
  )
}
