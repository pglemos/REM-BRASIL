import Link from 'next/link';
import { Calendar as CalendarIcon, MapPin, Search, ChevronRight, Filter } from 'lucide-react';
import { Logo } from '@/components/Logo';

export default function PublicCalendar() {
  return (
    <div className="min-h-screen bg-rem-gray/20">
      {/* Header */}
      <header className="border-b border-rem-gray bg-rem-white/90 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Logo className="w-10 h-10" layout="horizontal" showText={true} />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/calendar" className="text-sm font-bold text-rem-teal-dark border-b-2 border-rem-cyan pb-1 uppercase tracking-wider">Calendário</Link>
            <Link href="/faq" className="text-sm font-bold text-rem-teal hover:text-rem-orange transition-colors uppercase tracking-wider">FAQ</Link>
            <Link href="/contact" className="text-sm font-bold text-rem-teal hover:text-rem-orange transition-colors uppercase tracking-wider">Contato</Link>
          </nav>
          <div className="flex items-center gap-5">
            <Link href="/login" className="text-sm font-bold text-rem-teal hover:text-rem-orange transition-colors uppercase tracking-wider">Acesso Restrito</Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-rem-teal-dark text-rem-white py-24 px-4 relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-rem-cyan/10 blur-3xl"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-rem-orange/10 blur-3xl"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-8 tracking-tight">Encontre sua edição</h1>
          <p className="text-xl text-rem-cyan-light max-w-2xl mx-auto leading-relaxed font-medium">
            Descubra as próximas datas do REM em todo o Brasil e reserve seu lugar nesta experiência transformadora.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-10">
        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-xl shadow-rem-gray/50 border border-rem-gray mb-16 flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-rem-teal" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3.5 border border-rem-gray rounded-xl leading-5 bg-rem-white placeholder-rem-teal/50 focus:outline-none focus:ring-2 focus:ring-rem-cyan/20 focus:border-rem-cyan sm:text-sm transition-all font-medium text-rem-teal-dark"
              placeholder="Buscar por cidade ou estado..."
            />
          </div>
          <div className="flex gap-4">
            <select className="block w-full pl-4 pr-10 py-3.5 text-sm font-bold text-rem-teal-dark border-rem-gray focus:outline-none focus:ring-2 focus:ring-rem-cyan/20 focus:border-rem-cyan rounded-xl border bg-rem-white min-w-[160px]">
              <option>Todos os meses</option>
              <option>Agosto 2026</option>
              <option>Setembro 2026</option>
              <option>Outubro 2026</option>
            </select>
            <button className="bg-rem-gray/30 text-rem-teal-dark px-6 py-3.5 rounded-xl font-bold hover:bg-rem-gray/50 transition-colors flex items-center gap-2 border border-rem-gray">
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline">Filtros</span>
            </button>
          </div>
        </div>

        {/* Calendar List */}
        <div className="space-y-20">
          {/* Month Group */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-rem-teal-dark mb-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rem-cyan-light/20 flex items-center justify-center border border-rem-cyan">
                <CalendarIcon className="w-6 h-6 text-rem-cyan" />
              </div>
              Agosto 2026
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { city: 'São Paulo', state: 'SP', dates: '15 a 17 de Agosto', status: 'Inscrições Abertas' },
                { city: 'Belo Horizonte', state: 'MG', dates: '22 a 24 de Agosto', status: 'Últimas Vagas' },
                { city: 'Curitiba', state: 'PR', dates: '29 a 31 de Agosto', status: 'Inscrições Abertas' },
              ].map((edition, i) => (
                <div key={i} className="bg-white rounded-2xl border border-rem-gray shadow-sm overflow-hidden hover:shadow-xl hover:shadow-rem-gray/50 transition-all flex flex-col group">
                  <div className="p-8 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-2 text-rem-teal text-sm font-bold uppercase tracking-wider">
                        <MapPin className="w-4 h-4" />
                        {edition.city}, {edition.state}
                      </div>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                        edition.status === 'Últimas Vagas' ? 'bg-rem-cyan-light/20 text-rem-orange border-rem-cyan' : 'bg-rem-teal/10 text-rem-teal border-rem-teal'
                      }`}>
                        {edition.status}
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-rem-teal-dark mb-3">REM {edition.city}</h3>
                    <p className="text-rem-teal font-medium flex items-center gap-2">
                       <CalendarIcon className="w-4 h-4 text-rem-teal/50" />
                       {edition.dates}
                    </p>
                  </div>
                  <div className="px-8 py-5 bg-rem-white border-t border-rem-gray/50 mt-auto">
                    <button className="w-full flex items-center justify-center gap-2 text-sm font-bold text-rem-teal-dark hover:text-rem-orange transition-colors">
                      Ver detalhes e inscrever-se <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Month Group */}
          <div>
            <h2 className="text-3xl font-serif font-bold text-rem-teal-dark mb-10 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-rem-gray/30 flex items-center justify-center border border-rem-gray">
                <CalendarIcon className="w-6 h-6 text-rem-teal" />
              </div>
              Setembro 2026
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { city: 'Rio de Janeiro', state: 'RJ', dates: '12 a 14 de Setembro', status: 'Em Breve' },
                { city: 'Salvador', state: 'BA', dates: '19 a 21 de Setembro', status: 'Em Breve' },
              ].map((edition, i) => (
                <div key={i} className="bg-white rounded-2xl border border-rem-gray shadow-sm overflow-hidden flex flex-col opacity-80">
                  <div className="p-8 flex-1">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-2 text-rem-teal text-sm font-bold uppercase tracking-wider">
                        <MapPin className="w-4 h-4" />
                        {edition.city}, {edition.state}
                      </div>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rem-gray/30 text-rem-teal border border-rem-gray">
                        {edition.status}
                      </span>
                    </div>
                    <h3 className="text-3xl font-serif font-bold text-rem-teal-dark mb-3">REM {edition.city}</h3>
                    <p className="text-rem-teal font-medium flex items-center gap-2">
                       <CalendarIcon className="w-4 h-4 text-rem-teal/50" />
                       {edition.dates}
                    </p>
                  </div>
                  <div className="px-8 py-5 bg-rem-white border-t border-rem-gray/50 mt-auto">
                    <button className="w-full flex items-center justify-center gap-2 text-sm font-bold text-rem-teal cursor-not-allowed">
                      Aguarde abertura <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
