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
        <Script src="https://cdn.botpress.cloud/webchat/v3.5/inject.js" strategy="afterInteractive" />
        <Script
          src="https://files.bpcontent.cloud/2025/12/09/18/20251209185610-AMNCV6ON.js"
          strategy="afterInteractive"
        />
        {children}
      </body>
    </html>
  )
}
