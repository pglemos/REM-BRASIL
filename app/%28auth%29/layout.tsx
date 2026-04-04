import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-container-low text-on-surface">
      {/* TopNavBar */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 py-3 bg-white/80 backdrop-blur-xl border-b border-outline/30">
        <div className="flex items-center gap-8">
          <h1 className="text-xl font-black uppercase tracking-tighter text-pulse-cyan">REM OS</h1>
          <div className="hidden md:flex items-center bg-surface-container px-4 py-1.5 rounded-full border border-outline">
            <span className="material-symbols-outlined text-on-surface-variant text-sm mr-2">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm text-on-surface w-64" placeholder="Search official materials..." type="text" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors duration-200 rounded-full">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container transition-colors duration-200 rounded-full">
            <span className="material-symbols-outlined">settings</span>
          </button>
          <div className="h-8 w-8 rounded-full bg-pulse-cyan/10 flex items-center justify-center overflow-hidden border border-pulse-cyan/20">
            <img alt="Administrator Profile" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBYzz0s4AVkQ8wsqybFxpEedJ2XUD7miORud3Qs6HTyuO7zW3Qe_NW__dQ7zUyAQnvGhepD3Mf7s3917gr760VTbrtALjJgxKmN42B2oRHLbY8FJ34_VQLRMB0oVNecZYZ5qdbSzygAKi8TIldNC2DoeoAFvCHjbKlRhmZLott3mSJ1e8DeJeR8dsTU3u0jy0lyNBdHDGclB3s2B67K-IMvpGBGstRRPe7Ct8c40mIGKTd77TSls3-CXMMtwg75iZsfNI-c1vXiyxA" />
          </div>
        </div>
      </header>

      {/* SideNavBar */}
      <aside className="h-screen w-64 fixed left-0 top-0 bg-white border-r border-outline/50 flex flex-col pt-16 z-40 hidden md:flex">
        <div className="px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-action-orange flex items-center justify-center rounded-sm">
              <span className="material-symbols-outlined text-white" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
            </div>
            <div>
              <div className="text-lg font-black text-action-orange italic leading-none uppercase">REM ADMIN</div>
              <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold">Marriage Empowerment</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-pulse-cyan hover:bg-surface-container font-['Inter'] text-sm uppercase tracking-[0.08em] font-bold transition-all">
            <span className="material-symbols-outlined">dashboard</span> National Dashboard
          </Link>
          <Link href="/headquarters" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-pulse-cyan hover:bg-surface-container font-['Inter'] text-sm uppercase tracking-[0.08em] font-bold transition-all">
            <span className="material-symbols-outlined">location_city</span> Local HQs
          </Link>
          <Link href="/editions" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-pulse-cyan hover:bg-surface-container font-['Inter'] text-sm uppercase tracking-[0.08em] font-bold transition-all">
            <span className="material-symbols-outlined">event_repeat</span> Editions
          </Link>
          <Link href="/actos" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-pulse-cyan hover:bg-surface-container font-['Inter'] text-sm uppercase tracking-[0.08em] font-bold transition-all">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span> ACTO Tracking
          </Link>
          <Link href="/content" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-pulse-cyan hover:bg-surface-container font-['Inter'] text-sm uppercase tracking-[0.08em] font-bold transition-all">
            <span className="material-symbols-outlined">library_books</span> Content CMS
          </Link>
          <Link href="/homologation" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-pulse-cyan hover:bg-surface-container font-['Inter'] text-sm uppercase tracking-[0.08em] font-bold transition-all">
            <span className="material-symbols-outlined">verified_user</span> Compliance
          </Link>
          <Link href="/audit" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-pulse-cyan hover:bg-surface-container font-['Inter'] text-sm uppercase tracking-[0.08em] font-bold transition-all">
            <span className="material-symbols-outlined">fact_check</span> Audit Logs
          </Link>
          <Link href="/media" className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-pulse-cyan hover:bg-surface-container font-['Inter'] text-sm uppercase tracking-[0.08em] font-bold transition-all">
            <span className="material-symbols-outlined">folder_open</span> Mídia & Arquivos
          </Link>
        </nav>
        <div className="p-4">
          <button className="w-full py-3 bg-action-orange text-white font-black uppercase text-xs tracking-widest active:scale-95 transition-transform shadow-lg shadow-action-orange/20">
            Publish New Version
          </button>
        </div>
        <div className="px-3 pb-6 space-y-1">
          <Link href="/support" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-pulse-cyan font-['Inter'] text-xs uppercase tracking-widest font-bold">
            <span className="material-symbols-outlined text-sm">help</span> Support
          </Link>
          <Link href="/login" className="flex items-center gap-3 px-4 py-2 text-on-surface-variant hover:text-pulse-cyan font-['Inter'] text-xs uppercase tracking-widest font-bold">
            <span className="material-symbols-outlined text-sm">logout</span> Logout
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="md:ml-64 pt-20 p-8 min-h-screen pb-24 md:pb-8">
        {children}
      </main>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-outline/50 flex justify-around items-center py-3 z-50 shadow-up">
        <Link href="/dashboard" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px] technical-label font-bold uppercase">Home</span>
        </Link>
        <Link href="/headquarters" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">location_city</span>
          <span className="text-[10px] technical-label font-bold uppercase">Sedes</span>
        </Link>
        <Link href="/content" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>library_books</span>
          <span className="text-[10px] technical-label font-bold uppercase">CMS</span>
        </Link>
        <Link href="/audit" className="flex flex-col items-center gap-1 text-on-surface-variant">
          <span className="material-symbols-outlined">fact_check</span>
          <span className="text-[10px] technical-label font-bold uppercase">Audit</span>
        </Link>
      </nav>
    </div>
  );
}

export const metadata = {
  title: 'REM OS',
};
