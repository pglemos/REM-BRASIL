'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Logo } from '@/components/Logo';
import { Facebook, Instagram, CheckSquare, Mic, Laptop, ArrowRight, MapPin, Calendar } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';

export default function PublicHome() {
  const [editions, setEditions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    async function fetchPublicEditions() {
      const { data, error } = await supabase
        .from('editions')
        .select('*, headquarters(name, city, state)')
        .eq('is_public', true)
        .order('start_at', { ascending: true })
        .limit(6);
      
      if (!error) setEditions(data || []);
      setLoading(false);
    }
    fetchPublicEditions();
  }, [supabase]);

  return (
    <div className="min-h-screen bg-rem-white font-sans selection:bg-rem-orange selection:text-rem-white">
      
      {/* Header */}
      <header className="absolute top-0 left-0 w-full z-50 py-6 px-6 md:px-12 flex justify-between items-center bg-gradient-to-b from-rem-black/80 to-transparent">
        <Link href="/" className="flex items-center hover:scale-105 transition-transform">
          <Logo className="w-16 h-16 md:w-20 md:h-20" layout="horizontal" showText={true} theme="dark" />
        </Link>
        <nav className="hidden md:flex items-center gap-10 text-rem-white font-bold text-sm tracking-[0.2em] uppercase">
          <Link href="/calendario" className="hover:text-rem-cyan transition-colors relative group">
            Calendário
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-rem-cyan transition-all group-hover:w-full"></span>
          </Link>
          <Link href="#" className="hover:text-rem-cyan transition-colors relative group">
            Experiência
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-rem-cyan transition-all group-hover:w-full"></span>
          </Link>
          <Link href="#" className="hover:text-rem-cyan transition-colors relative group">
            5 Coisas REM
            <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-rem-cyan transition-all group-hover:w-full"></span>
          </Link>
          <div className="flex items-center gap-5 ml-4 border-l border-rem-white/30 pl-8">
            <Link href="/login" className="bg-rem-cyan text-rem-teal-dark px-6 py-2 rounded-full hover:bg-rem-white transition-colors">Login</Link>
            <Link href="#" className="hover:text-rem-cyan transition-transform hover:scale-110"><Facebook size={22} /></Link>
            <Link href="#" className="hover:text-rem-cyan transition-transform hover:scale-110"><Instagram size={22} /></Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <Image 
          src="https://picsum.photos/seed/concert/1920/1080" 
          alt="REM Experience Crowd" 
          fill 
          className="object-cover scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-rem-teal-dark/60 via-rem-black/40 to-rem-black/90"></div>
        
        <div className="relative z-10 text-center px-4 mt-20">
          <h1 className="text-5xl md:text-7xl lg:text-[7rem] text-rem-white font-display uppercase tracking-tight leading-[0.9] drop-shadow-2xl">
            <span className="block text-rem-cyan mb-2">Vivencie</span>
            <span className="block text-rem-white mb-2">Sinta</span>
            <span className="block text-rem-orange">Experimente</span>
          </h1>
          <p className="mt-8 text-rem-gray font-serif text-lg md:text-xl max-w-2xl mx-auto font-light tracking-wide">
            O evento que transformará seu casamento para sempre.
          </p>
          <Link href="/calendario" className="mt-12 bg-rem-orange text-rem-white font-bold text-sm md:text-base uppercase tracking-[0.2em] px-10 py-5 rounded-full hover:bg-rem-red transition-all hover:shadow-[0_0_30px_rgba(255,85,0,0.5)] hover:-translate-y-1 flex items-center gap-3 mx-auto w-fit">
            Participe do Desafio <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* Orange Banner */}
      <section className="bg-rem-orange py-12 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent"></div>
        <h2 className="relative z-10 text-rem-white font-display text-3xl md:text-5xl uppercase tracking-wide leading-tight max-w-5xl mx-auto">
          Seu casamento não foi criado para ser destruído, <br className="hidden md:block" />
          abandonado ou dado como perdido.
        </h2>
      </section>

      {/* REM Info Section */}
      <section className="relative py-32 px-6 md:px-12 overflow-hidden bg-rem-black">
        <div className="absolute inset-0 opacity-40">
          <Image 
            src="https://picsum.photos/seed/marriage/1920/1080" 
            alt="Couple hugging" 
            fill 
            className="object-cover object-top grayscale"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-rem-teal-dark/95 via-rem-teal-dark/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-4xl text-rem-white">
          <h2 className="text-7xl md:text-[9rem] font-display text-rem-cyan mb-8 leading-none drop-shadow-2xl">REM</h2>
          <div className="w-24 h-2 bg-rem-orange mb-10"></div>
          <p className="text-xl md:text-3xl font-serif font-light mb-8 leading-relaxed text-rem-gray">
            Seu casamento foi criado para vencer. <strong className="text-rem-white font-bold">O &quot;até que a morte nos separe&quot; existe sim!</strong> Se você se esforçou tanto para ter o casamento dos seus sonhos, esforce-se para ter o matrimônio dos seus sonhos.
          </p>
          <p className="text-2xl md:text-4xl font-display text-rem-orange uppercase tracking-wide">
            Seu casamento é o seu melhor investimento!
          </p>
        </div>
        
        {/* Faded Background Text */}
        <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none overflow-hidden">
          <h2 className="text-[15rem] font-display text-rem-white leading-none translate-y-1/4 translate-x-1/4 whitespace-nowrap">MR. EXTREME</h2>
        </div>
      </section>

      {/* Events Grid Section */}
      <section className="bg-rem-white py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-display text-rem-teal-dark uppercase tracking-tight mb-6">Próximos Eventos</h2>
            <p className="text-rem-teal font-serif text-xl">Encontre um REM perto de você</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-2xl"></div>
              ))
            ) : editions.length === 0 ? (
              <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 text-gray-500 font-bold uppercase tracking-widest">
                Nenhum evento público agendado no momento.
              </div>
            ) : (
              editions.map((edition) => (
                <div key={edition.id} className="group bg-rem-white rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.15)] transform hover:-translate-y-2 transition-all duration-500 border border-gray-100">
                  <div className={`h-48 bg-rem-teal-dark relative flex items-center justify-center p-6 overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                    <h3 className={`relative z-10 text-4xl font-display text-rem-white uppercase text-center leading-none tracking-wide group-hover:scale-110 transition-transform duration-500`}>{edition.headquarters?.city}</h3>
                  </div>
                  
                  <div className="bg-rem-black text-rem-white p-6">
                    <div className="flex items-center gap-3 mb-3 text-rem-gray">
                      <Calendar size={18} className="text-rem-cyan" />
                      <span className="font-bold text-sm uppercase tracking-wider">{new Date(edition.start_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center gap-3 mb-6 text-rem-gray">
                      <MapPin size={18} className="text-rem-cyan" />
                      <span className="font-bold text-sm uppercase tracking-wider">{edition.headquarters?.name}</span>
                    </div>
                    <div className="inline-block bg-rem-teal-dark text-rem-cyan text-xs font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full mb-6 border border-rem-cyan/30">
                      Inscrições Abertas
                    </div>
                    
                    <div className="space-y-3">
                      <Link 
                        href={`/${edition.public_slug || edition.id}`}
                        className="w-full bg-rem-orange text-rem-white font-bold py-4 rounded-xl hover:bg-rem-red transition-colors uppercase text-sm tracking-widest flex justify-center items-center gap-2"
                      >
                        Inscrições <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Coming Soon Card */}
            <div className="bg-gray-50 rounded-2xl overflow-hidden shadow-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center p-10 text-center min-h-[400px]">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-6">
                <MapPin size={32} className="text-gray-400" />
              </div>
              <h3 className="text-3xl font-display text-rem-teal-dark uppercase leading-tight mb-4">Em breve na<br/>Sua Cidade</h3>
              <p className="text-gray-500 font-serif mb-8">Uma experiência de dois dias que transformará seu casamento.</p>
              <Link href="/calendario" className="bg-rem-teal-dark text-rem-white font-bold py-3 px-8 rounded-full hover:bg-rem-teal transition-colors uppercase text-sm tracking-widest">
                Ver Calendário
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-3">
        {/* Couple Test */}
        <div className="bg-rem-orange py-32 px-12 flex flex-col items-center justify-center text-center group overflow-hidden relative">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500"></div>
          <div className="w-32 h-32 mb-10 relative transform group-hover:scale-110 transition-transform duration-500">
            <CheckSquare className="w-full h-full text-rem-white drop-shadow-2xl" strokeWidth={1.5} />
          </div>
          <h2 className="text-5xl font-display text-rem-white uppercase mb-6 tracking-wide relative z-10">Teste de Casal</h2>
          <p className="text-rem-white/90 font-serif mb-10 max-w-sm relative z-10">Descubra o estado atual do seu casamento com nossa avaliação gratuita.</p>
          <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md relative z-10">
            <button className="flex-1 bg-rem-black text-rem-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-rem-teal-dark transition-colors uppercase text-sm tracking-wider">
              <Facebook size={20} /> Facebook
            </button>
            <button className="flex-1 bg-rem-black text-rem-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-3 hover:bg-rem-teal-dark transition-colors uppercase text-sm tracking-wider">
              <Instagram size={20} /> Instagram
            </button>
          </div>
        </div>

        {/* Podcast */}
        <div className="bg-rem-black py-32 px-12 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 opacity-5 flex items-center justify-center transform group-hover:scale-150 transition-transform duration-1000">
            <Mic className="w-[40rem] h-[40rem] text-rem-white" />
          </div>
          <div className="w-48 h-48 rounded-full overflow-hidden mb-10 relative z-10 border-4 border-rem-cyan shadow-[0_0_50px_rgba(55,210,226,0.3)] group-hover:border-rem-orange transition-colors duration-500">
            <Image 
              src="https://picsum.photos/seed/podcast/800/800" 
              alt="Podcast Host" 
              fill 
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-5xl font-display text-rem-white uppercase mb-6 tracking-wide z-10">Podcast</h2>
          <p className="text-rem-gray font-serif mb-10 max-w-sm z-10">Ouça conselhos, testemunhos e ferramentas para fortalecer seu relacionamento.</p>
          <button className="bg-rem-cyan text-rem-teal-dark font-bold py-4 px-12 rounded-xl hover:bg-rem-white transition-colors uppercase text-sm tracking-widest z-10 flex items-center gap-2">
            Ouvir Agora <ArrowRight size={16} />
          </button>
        </div>

        {/* Blog */}
        <div className="bg-rem-cyan py-32 px-12 flex flex-col items-center justify-center text-center group overflow-hidden relative">
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500"></div>
          <div className="w-32 h-32 mb-10 relative transform group-hover:scale-110 transition-transform duration-500">
            <Laptop className="w-full h-full text-rem-teal-dark drop-shadow-2xl" strokeWidth={1.5} />
          </div>
          <h2 className="text-5xl font-display text-rem-teal-dark uppercase mb-6 tracking-wide relative z-10">Blog</h2>
          <p className="text-rem-teal-dark/80 font-serif mb-10 max-w-sm relative z-10">Artigos e recursos desenvolvidos para o crescimento do seu casamento.</p>
          <button className="bg-rem-teal-dark text-rem-white font-bold py-4 px-12 rounded-xl hover:bg-rem-black transition-colors uppercase text-sm tracking-widest relative z-10 flex items-center gap-2">
            Ler Artigos <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-32 px-6 md:px-12 overflow-hidden bg-rem-black">
        <div className="absolute inset-0 opacity-30">
          <Image 
            src="https://picsum.photos/seed/contact/1920/1080" 
            alt="Contact background" 
            fill 
            className="object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-rem-black via-rem-black/80 to-transparent"></div>
        
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="text-5xl md:text-7xl font-display text-rem-white uppercase mb-6 drop-shadow-lg leading-tight">
              Tem <br/><span className="text-rem-cyan">Dúvidas?</span>
            </h2>
            <p className="text-rem-gray font-serif text-lg mb-10 max-w-md">
              Estamos aqui para ajudar. Escreva para nós e nossa equipe entrará em contato o mais breve possível.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-rem-white">
                <div className="w-12 h-12 bg-rem-teal-dark rounded-full flex items-center justify-center">
                  <MapPin size={20} className="text-rem-cyan" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-sm">Localização Principal</h4>
                  <p className="text-rem-gray font-serif text-sm">Miami, Flórida, EUA</p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-rem-white">
                <div className="w-12 h-12 bg-rem-teal-dark rounded-full flex items-center justify-center">
                  <Mic size={20} className="text-rem-cyan" />
                </div>
                <div>
                  <h4 className="font-bold uppercase tracking-wider text-sm">Contato Direto</h4>
                  <p className="text-rem-gray font-serif text-sm">info@matrimoniosrem.com</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-rem-white/5 backdrop-blur-md p-8 md:p-12 rounded-3xl border border-rem-white/10">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-rem-white text-xs font-bold uppercase tracking-widest">Nome Completo</label>
                  <input 
                    type="text" 
                    className="w-full px-5 py-4 bg-rem-black/50 text-rem-white border border-rem-white/20 rounded-xl focus:outline-none focus:border-rem-cyan focus:ring-1 focus:ring-rem-cyan transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-rem-white text-xs font-bold uppercase tracking-widest">Telefone</label>
                  <input 
                    type="tel" 
                    className="w-full px-5 py-4 bg-rem-black/50 text-rem-white border border-rem-white/20 rounded-xl focus:outline-none focus:border-rem-cyan focus:ring-1 focus:ring-rem-cyan transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-rem-white text-xs font-bold uppercase tracking-widest">E-mail</label>
                <input 
                  type="email" 
                  className="w-full px-5 py-4 bg-rem-black/50 text-rem-white border border-rem-white/20 rounded-xl focus:outline-none focus:border-rem-cyan focus:ring-1 focus:ring-rem-cyan transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-rem-white text-xs font-bold uppercase tracking-widest">Mensagem</label>
                <textarea 
                  rows={4}
                  className="w-full px-5 py-4 bg-rem-black/50 text-rem-white border border-rem-white/20 rounded-xl focus:outline-none focus:border-rem-cyan focus:ring-1 focus:ring-rem-cyan resize-none transition-colors"
                ></textarea>
              </div>
              <button 
                type="submit" 
                className="w-full bg-rem-cyan text-rem-teal-dark font-bold py-5 rounded-xl hover:bg-rem-white transition-colors uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(55,210,226,0.2)]"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-rem-black pt-20 pb-10 px-6 md:px-12 border-t border-rem-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Logo className="w-24 h-24 mb-6" layout="horizontal" showText={true} theme="dark" />
            <p className="text-rem-gray font-serif max-w-sm mb-8">
              Empoderando casamentos para alcançarem seu potencial máximo através de experiências transformadoras.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="w-10 h-10 rounded-full bg-rem-white/10 flex items-center justify-center text-rem-white hover:bg-rem-cyan hover:text-rem-teal-dark transition-all"><Facebook size={18} /></Link>
              <Link href="#" className="w-10 h-10 rounded-full bg-rem-white/10 flex items-center justify-center text-rem-white hover:bg-rem-cyan hover:text-rem-teal-dark transition-all"><Instagram size={18} /></Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-rem-white font-bold uppercase tracking-widest mb-6">Links Rápidos</h4>
            <ul className="space-y-4">
              <li><Link href="/" className="text-rem-gray hover:text-rem-cyan transition-colors font-serif">Início</Link></li>
              <li><Link href="#" className="text-rem-gray hover:text-rem-cyan transition-colors font-serif">Experiência REM</Link></li>
              <li><Link href="#" className="text-rem-gray hover:text-rem-cyan transition-colors font-serif">5 Coisas REM</Link></li>
              <li><Link href="/calendario" className="text-rem-gray hover:text-rem-cyan transition-colors font-serif">Eventos</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-rem-white font-bold uppercase tracking-widest mb-6">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-rem-gray hover:text-rem-cyan transition-colors font-serif">Termos e Condições</Link></li>
              <li><Link href="#" className="text-rem-gray hover:text-rem-cyan transition-colors font-serif">Política de Privacidade</Link></li>
              <li><Link href="#" className="text-rem-gray hover:text-rem-cyan transition-colors font-serif">Política de Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto pt-8 border-t border-rem-white/10 text-center md:text-left flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-rem-gray/50 text-sm font-serif">
            Copyright © {new Date().getFullYear()} Matrimônios REM. Todos os direitos reservados.
          </p>
          <p className="text-rem-gray/50 text-sm font-serif">
            Projetado para transformar.
          </p>
        </div>
      </footer>

    </div>
  );
}
