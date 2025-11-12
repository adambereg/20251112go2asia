// Компонент для Open Graph метаданных
// Разместить в: apps/go2asia-pwa-shell/components/og-metadata.tsx

import Head from 'next/head';

interface OGMetadataProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function OGMetadata({
  title,
  description,
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
}: OGMetadataProps) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://go2asia.space';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const ogImage = image || `${siteUrl}/og-image.jpg`;
  
  return (
    <Head>
      {/* Basic Meta */}
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Go2Asia" />
      <meta property="og:locale" content="ru_RU" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Article specific */}
      {type === 'article' && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
        </>
      )}
      
      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />
    </Head>
  );
}

// Использование в Next.js App Router:
// export async function generateMetadata({ params }: { params: { id: string } }) {
//   const country = await fetchCountry(params.id);
//   return {
//     title: `${country.name} - Go2Asia Atlas`,
//     description: country.description,
//     openGraph: {
//       title: country.name,
//       description: country.description,
//       images: [country.flag],
//     },
//   };
// }

