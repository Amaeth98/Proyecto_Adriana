import type { Metadata } from 'next';
import { AuthProvider } from '@/components/AuthProvider';
import { Nav } from '@/components/Nav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Fungi Decor',
  description: 'Tienda online de figuras decorativas de setas con NextJS y NestJS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <AuthProvider>
          <Nav />
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
