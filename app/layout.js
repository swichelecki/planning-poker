import { TikTok_Sans } from 'next/font/google';
import { GloablContext } from '../components';
import { Layout } from '../components';
import Header from '../components/header/Header';
import '../styles/styles.scss';

const tikTokSans = TikTok_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
  adjustFontFallback: false,
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata = {
  generator: 'Next.js',
  applicationName: 'Express Planning Poker',
  title: {
    template: '%s | Express Planning Poker',
    default: 'Express Planning Poker | Instant Story Point Estimation',
  },
  description:
    'No user account required. Begin story pointing with your team in seconds with this free agile story point estimation tool.',
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
    siteName: 'Express Planning Poker',
    images: '/images/planning_poker_1200_630.webp',
    locale: 'en_US',
    type: 'website',
  },
  appleWebApp: {
    title: 'Express Planning Poker',
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
              name: 'Express Planning Poker',
              url: process.env.NEXT_PUBLIC_URL,
              description:
                'No user account required. Begin story pointing with your team in seconds with this free agile story point estimation tool.',
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
