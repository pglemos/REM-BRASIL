import type {Metadata} from 'next';
import { Inter, Work_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans' 
});

const workSans = Work_Sans({ 
  subsets: ['latin'], 
  variable: '--font-label' 
});

export const metadata: Metadata = {
  title: 'REM OS | Control Center',
  description: 'Plataforma Nacional de Gestão do REM Brasil',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${workSans.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased bg-surface-container-low text-on-surface" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
