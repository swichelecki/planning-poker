import { TikTok_Sans } from 'next/font/google';
import { GloablContext } from '../components';
import { Layout } from '../components';
import '../styles/styles.scss';

const tikTokSans = TikTok_Sans({
  weight: ['400', '700'],
  variable: '--font-tiktok-sans',
  subsets: ['latin'],
  fallback: ['sans-serif'],
});

export const metadata = {
  generator: 'Next.js',
  applicationName: 'Agile Story Planning Poker',
  title: {
    template: '%s | Agile Story Planning Poker',
    default:
      'Agile Story Planning Poker | Free Agile Story Planning Estimation App',
  },
  /* description:
    'Saturday is your super simple, no-AI daily planner. Manage all of your everyday tasks and obligations with Saturday’s customizable interface designed to simplify your life.',
  keywords: [
    'daily planner',
    'daily organizer',
    'task manager',
    'todo list',
    'notes',
    'no AI',
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_URL),
  openGraph: {
    url: process.env.NEXT_PUBLIC_URL,
    siteName: 'Saturday',
    images: '/saturday-homepage-no-ai-no-prob.webp',
    locale: 'en_US',
    type: 'website',
  },
  appleWebApp: {
    title: 'Saturday',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  }, */
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      {/* <body className={`${geistSans.variable} ${geistMono.variable}`}> */}
      <body className={`${tikTokSans.variable}`}>
        <GloablContext>
          <Layout>{children}</Layout>
        </GloablContext>
      </body>
    </html>
  );
}
