import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/connect/', '/profile/', '/_next/'],
      },
    ],
    sitemap: 'https://go2asia.space/sitemap.xml',
  };
}

