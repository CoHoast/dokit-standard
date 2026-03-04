import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'DOKit - AI Document Intelligence Platform',
  description: 'Process healthcare documents in seconds with AI-powered extraction and automation.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
