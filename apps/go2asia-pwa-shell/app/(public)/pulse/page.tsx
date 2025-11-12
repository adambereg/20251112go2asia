import { Metadata } from 'next';
import { getEvents } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Pulse Asia - События и афиша региона | Go2Asia',
  description: 'Актуальные события, мероприятия и афиша в Юго-Восточной Азии',
  openGraph: {
    title: 'Pulse Asia - События и афиша региона',
    description: 'Актуальные события, мероприятия и афиша в Юго-Восточной Азии',
    type: 'website',
    url: 'https://go2asia.space/pulse',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse Asia - События и афиша региона',
    description: 'Актуальные события, мероприятия и афиша в Юго-Восточной Азии',
  },
};

// SSR для динамических данных (события часто меняются)
export const dynamic = 'force-dynamic';

export default async function PulsePage() {
  const { items: events } = await getEvents();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Pulse Asia</h1>
      <p className="text-lg text-gray-600 mb-8">
        События и афиша региона
      </p>

      {events.length === 0 ? (
        <p className="text-gray-500">События скоро появятся</p>
      ) : (
        <div className="space-y-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="p-6 border border-gray-200 rounded-lg"
            >
              <h2 className="text-2xl font-semibold mb-2">{event.title}</h2>
              {event.description && (
                <p className="text-gray-600 mb-4">{event.description}</p>
              )}
              <div className="text-sm text-gray-500">
                <time>
                  {new Date(event.startDate).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </time>
                {event.endDate && (
                  <>
                    {' - '}
                    <time>
                      {new Date(event.endDate).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </time>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
