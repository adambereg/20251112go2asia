import { Metadata } from 'next';
import { getCountries } from '@/lib/api';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Atlas Asia - База знаний о локациях Юго-Восточной Азии | Go2Asia',
  description: 'Исследуйте страны, города и места Юго-Восточной Азии. Полная база знаний о локациях региона.',
  openGraph: {
    title: 'Atlas Asia - База знаний о локациях Юго-Восточной Азии',
    description: 'Исследуйте страны, города и места Юго-Восточной Азии',
    type: 'website',
    url: 'https://go2asia.space/atlas',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Atlas Asia - База знаний о локациях Юго-Восточной Азии',
    description: 'Исследуйте страны, города и места Юго-Восточной Азии',
  },
};

export const revalidate = 300; // 5 минут

export default async function AtlasPage() {
  const { items: countries } = await getCountries();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Atlas Asia</h1>
      <p className="text-lg text-gray-600 mb-8">
        База знаний о локациях Юго-Восточной Азии
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {countries.map((country) => (
          <Link
            key={country.id}
            href={`/atlas/countries/${country.id}`}
            className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-2xl font-semibold mb-2">{country.name}</h2>
            {country.description && (
              <p className="text-gray-600">{country.description}</p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
