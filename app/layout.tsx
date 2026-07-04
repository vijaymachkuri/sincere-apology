import type {Metadata} from 'next';
import { Inter, Playfair_Display, Caveat } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif' });
const caveat = Caveat({ subsets: ['latin'], variable: '--font-handwriting' });

export const metadata: Metadata = {
  title: 'An Apology',
  description: 'A warm, peaceful, and sincere apology.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${caveat.variable}`}>
      <body suppressHydrationWarning className="font-sans antialiased text-gray-800">{children}</body>
    </html>
  );
}
