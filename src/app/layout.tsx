import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <head>
        <link href='https://unpkg.com/maplibre-gl@3.0.0/dist/maplibre-gl.css' rel='stylesheet' />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}