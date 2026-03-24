import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'cancelhack_ — Unlock hidden subscription discounts',
  description: 'Get discounts on subscriptions you already pay for. We show you exactly how to unlock hidden retention offers — step by step.',
  metadataBase: new URL('https://cancelhack.co'),
  openGraph: {
    title: 'cancelhack_ — Get the discount. Keep the service.',
    description: 'No sign-up. No BS. Just discounts. We show you exactly how to unlock hidden retention offers on 69+ subscription services.',
    siteName: 'cancelhack_',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'cancelhack_ — Get the discount. Keep the service.',
    description: 'No sign-up. No BS. Just discounts. Hidden retention offers on 69+ subscription services.',
    creator: '@yoshizen',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
