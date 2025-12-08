import type { Metadata } from 'next'
import Script from 'next/script'
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
        <Script src="https://cdn.botpress.cloud/webchat/v3.4/inject.js" strategy="afterInteractive" />
        <Script
          src="https://files.bpcontent.cloud/2025/12/08/16/20251208162029-UU682CTG.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
