import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getCountry, getCities } from '@/lib/api';
import Link from 'next/link';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const country = await getCountry(id).catch(() => null);

  if (!country) {
    return {
      title: 'Страна не найдена | Go2Asia',
    };
  }

  return {
    title: `${country.name} - Atlas Asia | Go2Asia`,
    description: country.description || `Информация о стране ${country.name} в Юго-Восточной Азии`,
    openGraph: {
      title: `${country.name} - Atlas Asia`,
      description: country.description || `Информация о стране ${country.name}`,
      type: 'website',
      url: `https://go2asia.space/atlas/countries/${id}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${country.name} - Atlas Asia`,
      description: country.description || `Информация о стране ${country.name}`,
    },
  };
}

export const revalidate = 300; // 5 минут

export default async function CountryPage({ params }: Props) {
  const { id } = await params;
  
  const [country, citiesData] = await Promise.all([
    getCountry(id).catch(() => null),
    getCities(id).catch(() => ({ items: [] })),
  ]);

  if (!country) {
    notFound();
  }

  const { items: cities } = citiesData;

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/atlas" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Назад к Atlas
      </Link>
      
      <h1 className="text-4xl font-bold mb-4">{country.name}</h1>
      {country.description && (
        <p className="text-lg text-gray-600 mb-8">{country.description}</p>
      )}

      {cities.length > 0 && (
        <section className="mt-8">
          <h2 className="text-2xl font-semibold mb-4">Города</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cities.map((city) => (
              <div
                key={city.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <h3 className="text-xl font-semibold">{city.name}</h3>
                {city.description && (
                  <p className="text-gray-600 mt-2">{city.description}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}

