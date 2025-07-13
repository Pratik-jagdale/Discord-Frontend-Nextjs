import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Xcyberbot',
  description: 'Xcyberbot migrated from Vite to Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div id="root">{children}</div>
      </body>
    </html>
  )
} 