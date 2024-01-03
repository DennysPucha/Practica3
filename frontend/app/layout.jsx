import { Inter } from 'next/font/google';
import 'bootstrap/dist/css/bootstrap.css';
import Footer from '@/componentes/footer';
import { estaSesion } from '@/hooks/SessionUtil';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({ children }) {
  const autenticado = estaSesion();

  return (
    <html lang="en" style={{ height: '100%' }}>
      <body className={`${inter.className} d-flex flex-column`} style={{ minHeight: '100vh' }}>
        <section className="container flex-grow-1">{children}</section>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}