import './globals.css'

export const metadata = {
  title: 'ハオルチア雑録',
  description: '透明窓と薬草と植物たち',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
