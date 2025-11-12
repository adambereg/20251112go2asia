import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Главная',
  description: 'Go2Asia - цифровая экосистема путешествий, жизни и бизнеса в Юго-Восточной Азии',
};

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4">Go2Asia</h1>
        <p className="text-xl text-gray-600 mb-8">
          Цифровая экосистема путешествий, жизни и бизнеса в Юго-Восточной Азии
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Link
          href="/atlas"
          className="block p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow text-center"
        >
          <h2 className="text-2xl font-semibold mb-2">Atlas Asia</h2>
          <p className="text-gray-600">База знаний о локациях</p>
        </Link>

        <Link
          href="/blog"
          className="block p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow text-center"
        >
          <h2 className="text-2xl font-semibold mb-2">Blog Asia</h2>
          <p className="text-gray-600">Медиацентр экосистемы</p>
        </Link>

        <Link
          href="/pulse"
          className="block p-8 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow text-center"
        >
          <h2 className="text-2xl font-semibold mb-2">Pulse Asia</h2>
          <p className="text-gray-600">События и афиша</p>
        </Link>
      </div>
    </main>
  );
}

