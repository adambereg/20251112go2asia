import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getArticle } from '@/lib/api';
import Link from 'next/link';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Статья не найдена | Go2Asia',
    };
  }

  return {
    title: `${article.title} - Blog Asia | Go2Asia`,
    description: article.excerpt || article.title,
    openGraph: {
      title: article.title,
      description: article.excerpt || article.title,
      type: 'article',
      url: `https://go2asia.space/blog/${slug}`,
      publishedTime: article.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || article.title,
    },
  };
}

export const revalidate = 3600; // 1 час для статических страниц

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/blog" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Назад к Blog
      </Link>
      
      <article>
        <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
        <time className="text-gray-500 block mb-8">
          {new Date(article.publishedAt).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </time>
        
        {article.excerpt && (
          <p className="text-xl text-gray-600 mb-8">{article.excerpt}</p>
        )}
        
        <div className="prose max-w-none">
          {/* Контент статьи будет здесь */}
          <p>Контент статьи загружается...</p>
        </div>
      </article>
    </main>
  );
}

