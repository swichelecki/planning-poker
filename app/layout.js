import { TikTok_Sans } from 'next/font/google';
import { GloablContext } from '../components';
import { Layout } from '../components';
import Header from '../components/header/Header';
import '../styles/styles.scss';

const tikTokSans = TikTok_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  adjustFontFallback: false,
});

export const metadata = {
  generator: 'Next.js',
  applicationName: 'Agile Story Planning Poker',
  title: {
    template: '%s | Agile Story Planning Poker',
    default: 'Agile Story Planning Poker | Free Story Point Estimation Tool',
  },
  description:
    'Free planning poker tool for remote scrum team story point estimation. Create voting rooms and invite teammates for online story point estimation.',
  keywords: [
    'planning poker',
    'pointing poker',
    'scrum poker',
    'agile',
    'scrum',
    'user story',
    'story point estimation',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
  openGraph: {
    url: process.env.NEXT_PUBLIC_URL,
    siteName: 'Agile Story Planning Poker',
    images: '/images/planning_poker_1200_630.webp',
    locale: 'en_US',
    type: 'website',
  },
  appleWebApp: {
    title: 'Agile Story Planning Poker',
  },
  icons: {
    icon: '/images/favicon-32x32.png',
    apple: '/images/apple-icon-180x180.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={`${tikTokSans.variable}`}>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Agile Story Planning Poker',
              url: process.env.NEXT_PUBLIC_URL,
              description:
                'Free planning poker tool for remote scrum team story point estimation. Create voting rooms and invite teammates for online story point estimation.',
              applicationCategory: 'BusinessApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
        <GloablContext>
          <Header />
          <Layout>{children}</Layout>
        </GloablContext>
      </body>
    </html>
  );
}
