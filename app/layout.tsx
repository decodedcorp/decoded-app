import type { Metadata } from 'next'
import './globals.css'
import { AppProviders } from './providers'

export const metadata: Metadata = {
  title: 'Decoded App',
  description: 'Decoded application',
}

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode
  modal: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProviders>
          {children}
          {modal}
        </AppProviders>
      </body>
    </html>
  )
}

