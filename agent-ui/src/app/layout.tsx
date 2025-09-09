import type { Metadata } from 'next'
import { DM_Mono, Geist } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import SWRegister from '@/components/pwa/SWRegister'
import Navbar from '@/components/ui/Navbar'
import ThemeProvider from '../components/ui/ThemeProvider'
const geistSans = Geist({
  variable: '--font-geist-sans',
  weight: '400',
  subsets: ['latin']
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  weight: '400'
})

export const metadata: Metadata = {
  title: 'Chat AI+',
  description:
    'Agentes de IA para chatbots, conversaciones y aplicaciones de inteligencia artificial'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0d0d0d" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body className={`${geistSans.variable} ${dmMono.variable} antialiased`}>
        <ThemeProvider>
          <Navbar />
          <NuqsAdapter>{children}</NuqsAdapter>
          <Toaster />
          <SWRegister />
        </ThemeProvider>
      </body>
    </html>
  )
}
