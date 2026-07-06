import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { SessionProvider } from 'next-auth/react'
import Header from '@/components/ui/header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI Quiz Builder',
  description: 'Generate Quizzes in seconds!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <SessionProvider>
      <body className={"dark"}><Header/>{children}</body>
      </SessionProvider>
    </html>
  )
}
