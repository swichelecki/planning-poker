import { TikTok_Sans } from 'next/font/google';
import { GloablContext } from '../components';
import { Layout } from '../components';
import '../styles/styles.scss';

const tikTokSans = TikTok_Sans({
  weight: ['400', '700'],
  subsets: ['latin'],
});

export const metadata = {
  generator: 'Next.js',
  applicationName: 'Agile Story Planning Poker',
  title: {
    template: '%s | Agile Story Planning Poker',
    default:
      'Online Agile Story Planning Poker | Free Online User Story Point Estimation',
  },
  description:
    'Invite your teammates to custom planning poker rooms for easy, fun and free online user story point estimation.',
  keywords: ['planning poker', 'agile', 'scrum', 'user story'],
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
        <GloablContext>
          <Layout>{children}</Layout>
        </GloablContext>
      </body>
    </html>
  );
}
