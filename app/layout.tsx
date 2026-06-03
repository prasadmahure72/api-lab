import type { Metadata } from 'next'
import { Instrument_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { ToastProvider } from '@/components/Toast'

const instrumentSans = Instrument_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

const dmMono = DM_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'APILab — Mock API Platform',
  description: 'Create, manage, and simulate APIs dynamically without writing backend code.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${dmMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0f0d] text-white">
        <ToastProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </ToastProvider>
      </body>
    </html>
  )
}
