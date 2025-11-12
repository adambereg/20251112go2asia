import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Go2Asia - Цифровая экосистема путешествий в ЮВА',
    template: '%s | Go2Asia',
  },
  description: 'Go2Asia - связанная сеть веб-модулей для путешественников, местных жителей и бизнес-партнёров в Юго-Восточной Азии',
  keywords: ['путешествия', 'Юго-Восточная Азия', 'Вьетнам', 'Таиланд', 'Индонезия', 'туризм'],
  authors: [{ name: 'Go2Asia Team' }],
  creator: 'Go2Asia',
  publisher: 'Go2Asia',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://go2asia.space'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://go2asia.space',
    siteName: 'Go2Asia',
    title: 'Go2Asia - Цифровая экосистема путешествий в ЮВА',
    description: 'Go2Asia - связанная сеть веб-модулей для путешественников, местных жителей и бизнес-партнёров в Юго-Восточной Азии',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Go2Asia - Цифровая экосистема путешествий в ЮВА',
    description: 'Go2Asia - связанная сеть веб-модулей для путешественников, местных жителей и бизнес-партнёров в Юго-Восточной Азии',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}

