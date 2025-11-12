import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Go2Asia - Цифровая экосистема путешествий в ЮВА',
  description: 'Go2Asia - связанная сеть веб-модулей для путешественников, местных жителей и бизнес-партнёров в Юго-Восточной Азии',
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

