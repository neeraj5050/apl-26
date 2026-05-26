import type { Metadata } from 'next';
import { Rajdhani, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-game',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Aki Cricket — AI IPL Guessing Game',
  description: 'Think of any IPL cricketer and let AI guess who it is in 15 questions. Powered by Grok AI with immersive 3D visuals.',
  keywords: ['IPL', 'cricket', 'AI', 'guessing game', 'akinator', 'Grok'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${jetbrainsMono.variable}`}>
      <body className="font-game antialiased bg-dark-bg text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
