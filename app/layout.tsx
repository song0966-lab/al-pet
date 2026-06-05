import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '전시 작품 소개',
  description: '단일 전시를 위한 에디토리얼 작품 소개 웹앱'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
