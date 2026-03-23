import './globals.css';

export const metadata = {
  title: 'cancelhack_ — Save money by canceling subscriptions',
  description: 'Discover which subscription services offer discounts when you try to cancel. Stop overpaying.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans">
        {children}
      </body>
    </html>
  );
}
