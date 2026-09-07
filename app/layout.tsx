import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SakuJalan — Campus Budget Navigator | Gojek Champointship 2026',
  description: 'Know what is left. Find what fits. Keep college life moving. Student cashflow navigation and alternative finder.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
