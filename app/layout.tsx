import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: {
    default: 'INFOBIKE – Magasins de vélos en Belgique',
    template: '%s | INFOBIKE',
  },
  description:
    'INFOBIKE : votre spécialiste vélo à Dour et Maisières (Belgique). VTT, route, électrique, urbain — marques Thompson, Scott, Orbea, Colnago.',
  keywords: ['vélo', 'vtt', 'vélo électrique', 'route', 'Belgique', 'Dour', 'Maisières'],
  openGraph: {
    siteName: 'INFOBIKE',
    locale: 'fr_BE',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
