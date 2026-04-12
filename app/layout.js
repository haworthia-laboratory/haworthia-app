import './globals.css'
import GlobalMenu from './components/GlobalMenu'
import { Zen_Maru_Gothic } from 'next/font/google'

const zenMaru = Zen_Maru_Gothic({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-rounded',
  display: 'swap',
})

export const metadata = {
  title: {
    default: 'ハオルチア研究室',
    template: '%s | ハオルチア研究室',
  },
  description: 'ハオルチア（多肉植物）に特化した品種図鑑・育成記録・コラムサイト。171品種の図鑑、AI品種診断、成長日記機能を提供します。',
  keywords: ['ハオルチア', '多肉植物', '品種図鑑', '育て方', 'haworthia'],
  authors: [{ name: 'ハオルチア研究室' }],
  openGraph: {
    title: 'ハオルチア研究室',
    description: 'ハオルチア（多肉植物）に特化した品種図鑑・育成記録・コラムサイト',
    locale: 'ja_JP',
    type: 'website',
    url: 'https://haworthia-lab.vercel.app',
    siteName: 'ハオルチア研究室',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ja" className={zenMaru.variable}>
      <body>
        <GlobalMenu />
        {children}
      </body>
    </html>
  )
}
