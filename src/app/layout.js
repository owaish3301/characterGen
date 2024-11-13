import './globals.css'

export const metadata = {
  title: 'CloneYou',
  description: 'Character Generation App',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}