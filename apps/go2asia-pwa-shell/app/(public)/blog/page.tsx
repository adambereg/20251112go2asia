import { Metadata } from 'next';
import { getArticles } from '@/lib/api';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog Asia - Медиацентр экосистемы Go2Asia',
  description: 'Статьи, новости и материалы о путешествиях, жизни и бизнесе в Юго-Восточной Азии',
  openGraph: {
    title: 'Blog Asia - Медиацентр экосистемы Go2Asia',
    description: 'Статьи, новости и материалы о путешествиях, жизни и бизнесе в Юго-Восточной Азии',
    type: 'website',
    url: 'https://go2asia.space/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog Asia - Медиацентр экосистемы Go2Asia',
    description: 'Статьи, новости и материалы о путешествиях, жизни и бизнесе в Юго-Восточной Азии',
  },
};

export const revalidate = 3600; // 1 час для статических страниц

export default async function BlogPage() {
  const { items: articles } = await getArticles();

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Blog Asia</h1>
      <p className="text-lg text-gray-600 mb-8">
        Медиацентр экосистемы Go2Asia
      </p>

      {articles.length === 0 ? (
        <p className="text-gray-500">Статьи скоро появятся</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/blog/${article.slug}`}
              className="block p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
            >
              <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
              {article.excerpt && (
                <p className="text-gray-600 mb-4">{article.excerpt}</p>
              )}
              <time className="text-sm text-gray-500">
                {new Date(article.publishedAt).toLocaleDateString('ru-RU')}
              </time>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
