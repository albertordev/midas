import type { Metadata } from 'next'

import { Plus_Jakarta_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'

import { Toaster } from '@/components/ui/toaster'

import './globals.css'

const fontSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Midas',
  description: 'Midas',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={cn(
          'bg-dark-300 min-h-screen font-sans antialiased',
          fontSans.variable
        )}>
        <Toaster />
        {children}
      </body>
    </html>
  )
}