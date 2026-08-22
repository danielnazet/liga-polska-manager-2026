import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin', 'latin-ext'],
});

export const metadata: Metadata = {
  title: 'Polska Liga Manager 2026 | Przeglądarkowy Menedżer Piłkarski',
  description: 'Polska Liga Manager 2026 - kultowy polski menedżer piłkarski w Twojej przeglądarce. Prowadź kluby od Ekstraklasy do Okręgówki, twórz taktyki i słuchaj relacji radiowych!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl" className={`${inter.className} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100 selection:bg-emerald-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
