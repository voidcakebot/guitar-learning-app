import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fretboard Pilot',
  description: 'A pragmatic MVP for guided guitar learning with a static library and dynamic learning state.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
