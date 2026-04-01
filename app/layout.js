import './globals.css'

export const metadata = {
  title: 'ハオルチア研究室',
  description: '撮影→鑑定→記録　あなただけの育成記録',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}
