import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ديوان تميم — لوحة الإدارة',
  description: 'Admin dashboard for Tamim Diwan',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
