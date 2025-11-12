import { MetadataRoute } from 'next';
import { getCountries } from '@/lib/api';
import { getArticles } from '@/lib/api';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://go2asia.space';

  // Статические страницы
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/atlas`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pulse`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.8,
    },
  ];

  // Страны из Atlas
  const countries = await getCountries().catch(() => ({ items: [] }));
  const countryPages: MetadataRoute.Sitemap = countries.items.map((country) => ({
    url: `${baseUrl}/atlas/countries/${country.id}`,
    lastModified: new Date(), // В будущем будет из БД
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Статьи из Blog
  const articles = await getArticles().catch(() => ({ items: [] }));
  const articlePages: MetadataRoute.Sitemap = articles.items.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...staticPages, ...countryPages, ...articlePages];
}

