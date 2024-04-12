import TopMenu from '@/components/TopMenu'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'
import NextAuthProvider from './providers/NextAuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Restaurant Reservation',
  description: 'Make reservation with us to enjoy your meal',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body className={inter.className}>
        <NextAuthProvider session={session}>
        <TopMenu/>
        {children}
        </NextAuthProvider>
      </body>
    </html>
  )
}
