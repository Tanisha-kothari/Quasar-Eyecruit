import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EyeCruit',
  description: 'Created with love',
  generator: 'yash-atharva-tanisha-soham',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
