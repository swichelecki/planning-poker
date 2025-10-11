//import { Geist, Geist_Mono } from 'next/font/google';
// TODO: ADD LAYOUT COMPONENT AND GLOBAL CONTEXT
/* import { GloablContext } from '../components';
import { Layout } from '../components'; */
import '../styles/styles.scss';

/* const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); */

export const metadata = {
  generator: 'Next.js',
  applicationName: 'Planning Poker',
  title: {
    template: '%s | Planning Poker',
    default: 'Planning Poker | Free Agile Estimation App',
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
      <body>{children}</body>

      {/*  
      TODO: ADD LAYOUT COMPONENT AND GLOBAL CONTEXT
      <GloablContext>
          <Layout>{children}</Layout>
        </GloablContext> */}
    </html>
  );
}
