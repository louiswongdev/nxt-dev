import Head from 'next/head';

export default function Metatags({
  title = 'Nxt - Social Blogging Platform',
  description = 'A Social Blogging site built with Next.js + Firebase',
  image = '',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:site" content="@louiswongdev" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
    </Head>
  );
}
