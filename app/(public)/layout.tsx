import React from 'react';
import Link from 'next/link';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="border-b border-gray-100 py-4 px-6 flex justify-between items-center">
        <Link href="/" className="text-xl font-black uppercase tracking-tighter">REM OS</Link>
        <nav className="flex gap-6 text-sm font-bold uppercase">
          <Link href="/login" className="hover:text-pulse-cyan transition-colors">Acesso Restrito</Link>
        </nav>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-gray-100 py-8 px-6 text-center text-xs text-gray-400 uppercase font-bold tracking-widest">
        &copy; {new Date().getFullYear()} REM OS Foundation. Todos os direitos reservados.
      </footer>
    </div>
  );
}
