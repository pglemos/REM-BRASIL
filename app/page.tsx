'use client';

import { useEffect, useMemo, useState, type ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { createBrowserClient } from '@supabase/ssr';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Compass,
  Facebook,
  Flame,
  HeartHandshake,
  Instagram,
  MapPin,
  MessageCircle,
  Play,
  ShieldCheck,
  Users,
} from 'lucide-react';

type Edition = {
  id: string;
  name?: string | null;
  public_slug?: string | null;
  start_at?: string | null;
  end_at?: string | null;
  headquarters?: {
    name?: string | null;
    city?: string | null;
    state?: string | null;
  } | null;
};

type Icon = ComponentType<{ className?: string; strokeWidth?: number }>;

const assets = {
  logo: '/rem-assets/rem-logo.png',
  hero: '/rem-assets/outdoor-teaching.jpg',
  forest: '/rem-assets/forest-briefing.webp',
  joy: '/rem-assets/couple-joy.webp',
  prayer: '/rem-assets/prayer-room.jpg',
  ritual: '/rem-assets/commitment-ritual.webp',
  lake: '/rem-assets/lake-couple.jpg',
  embrace: '/rem-assets/embrace-badge.jpg',
  auditorium: '/rem-assets/auditorium-kiss.jpg',
  intimate: '/rem-assets/intimate-prayer.jpg',
  canoe: '/rem-assets/canoe-couple.jpg',
  mountain: '/rem-assets/mountain-gathering.jpg',
  water: '/rem-assets/water-run.jpg',
  stage: '/rem-assets/stage-moment.webp',
  heroLoop: '/rem-assets/rem-hero-loop.mp4',
  film: '/rem-assets/rem-film.mp4',
  filmPoster: '/rem-assets/rem-film-poster.jpg',
};

const pillars: Array<{ icon: Icon; title: string; copy: string }> = [
  {
    icon: Compass,
    title: 'Direção',
    copy: 'Um roteiro intenso para o casal parar, escutar e decidir o próximo passo juntos.',
  },
  {
    icon: Flame,
    title: 'Coragem',
    copy: 'Atividades, desafios e conversas que tiram o casamento do automático.',
  },
  {
    icon: HeartHandshake,
    title: 'Reconexão',
    copy: 'Momentos guiados para reconstruir confiança, presença e compromisso.',
  },
];

const journey = [
  'Chegada e alinhamento do casal',
  'Dinâmicas ao ar livre e em auditório',
  'Ferramentas práticas para conversas difíceis',
  'Celebração, compromisso e plano de continuidade',
];

const gallery = [
  { src: assets.joy, alt: 'Casal sorrindo durante o REM', label: 'Alegria' },
  { src: assets.prayer, alt: 'Casal em oração durante a experiência', label: 'Presença' },
  { src: assets.ritual, alt: 'Casal durante momento de compromisso', label: 'Compromisso' },
  { src: assets.lake, alt: 'Casal REM perto do lago', label: 'Parceria' },
  { src: assets.auditorium, alt: 'Casal se beijando no auditório', label: 'Cuidado' },
  { src: assets.embrace, alt: 'Casal abraçado no percurso', label: 'Entrega' },
];

function formatDate(value?: string | null) {
  if (!value) return 'Data a confirmar';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Data a confirmar';

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function eventHref(edition: Edition) {
  return `/${edition.public_slug || edition.id}`;
}

export default function PublicHome() {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) return null;
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchPublicEditions() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('editions')
        .select('id, name, public_slug, start_at, end_at, headquarters(name, city, state)')
        .eq('is_public', true)
        .order('start_at', { ascending: true })
        .limit(3);

      if (!isMounted) return;
      if (!error) setEditions((data as Edition[]) || []);
      setLoading(false);
    }

    fetchPublicEditions();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  return (
    <main className="min-h-screen bg-[#f5f1e8] text-[#102124] selection:bg-[#ff6a1a] selection:text-[#fffaf0]">
      <header className="absolute left-0 top-0 z-40 w-full px-4 py-4 sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center" aria-label="REM Brasil">
            <Image
              src={assets.logo}
              alt="Reto de Empoderamiento Matrimonial"
              width={250}
              height={101}
              priority
              className="h-auto w-40 sm:w-52"
            />
          </Link>

          <nav className="hidden items-center gap-7 rounded-full bg-[#061617]/85 px-6 py-3 text-sm font-bold text-[#f6fbfb] shadow-[0_18px_50px_rgba(0,0,0,0.22)] lg:flex">
            <a href="#experiencia" className="hover:text-[#61dbe5]">Experiência</a>
            <a href="#jornada" className="hover:text-[#61dbe5]">Jornada</a>
            <a href="#eventos" className="hover:text-[#61dbe5]">Calendário</a>
            <Link href="/login" className="rounded-full bg-[#36d3df] px-4 py-2 text-[#062529] hover:bg-[#fffaf0]">
              Acesso Restrito
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative min-h-[88svh] overflow-hidden bg-[#071719]">
        <video
          className="absolute inset-0 h-full w-full object-cover object-center"
          src={assets.heroLoop}
          poster={assets.filmPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Filme REM Brasil com casais em encontros, palestras e momentos de reconexão"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,16,18,0.93)_0%,rgba(5,16,18,0.70)_43%,rgba(5,16,18,0.18)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,rgba(5,16,18,0)_0%,#f5f1e8_100%)]" />

        <div className="relative z-10 mx-auto flex min-h-[88svh] max-w-7xl items-end px-4 pb-20 pt-36 sm:px-6 lg:px-10 lg:pb-24">
          <div className="max-w-3xl text-[#fffaf0]">
            <p className="mb-5 inline-flex items-center rounded-full bg-[#ff6a1a] px-4 py-2 text-xs font-black uppercase text-[#fffaf0]">
              REM Brasil 2026
            </p>
            <h1 className="max-w-4xl text-5xl font-black uppercase leading-[0.95] sm:text-7xl lg:text-8xl">
              Seu casamento foi criado para vencer
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#d7e8e8] sm:text-xl">
              Uma experiência presencial para casais que decidiram parar de sobreviver e voltar a caminhar como equipe.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#eventos"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#ff6a1a] px-7 text-sm font-black uppercase text-[#fffaf0] shadow-[0_18px_40px_rgba(255,106,26,0.32)] transition hover:-translate-y-0.5 hover:bg-[#e9550d]"
              >
                Ver próximas datas <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="#filme"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#fffaf0]/40 px-7 text-sm font-black uppercase text-[#fffaf0] transition hover:-translate-y-0.5 hover:border-[#61dbe5] hover:text-[#61dbe5]"
              >
                Assistir filme <Play className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f5f1e8] px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-[6px] bg-[#17353a] md:grid-cols-4">
          {[
            ['2 dias', 'imersivos'],
            ['Casais', 'lado a lado'],
            ['Brasil', 'em expansão'],
            ['Fé e prática', 'no mesmo caminho'],
          ].map(([value, label]) => (
            <div key={value} className="bg-[#092629] px-5 py-6 text-[#fffaf0]">
              <p className="text-3xl font-black uppercase sm:text-4xl">{value}</p>
              <p className="mt-2 text-sm font-semibold text-[#9bdde2]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="experiencia" className="bg-[#f5f1e8] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#d95412]">A experiência</p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none text-[#102124] sm:text-6xl">
              Não é palestra. É decisão em movimento.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#415b60]">
              O REM combina direção espiritual, exercícios de comunicação, desafios em dupla e momentos de cura emocional para que o casal volte a se enxergar.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {pillars.map(({ icon: IconComponent, title, copy }) => (
              <article key={title} className="rounded-[6px] bg-[#fffaf0] p-6 shadow-[0_18px_44px_rgba(9,38,41,0.10)]">
                <IconComponent className="h-8 w-8 text-[#ff6a1a]" strokeWidth={1.8} />
                <h3 className="mt-6 text-xl font-black uppercase text-[#092629]">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#51686d]">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="grid bg-[#081719] text-[#fffaf0] lg:grid-cols-2">
        <div className="relative min-h-[520px]">
          <Image
            src={assets.forest}
            alt="Casais reunidos no início de uma trilha REM"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div className="flex items-center px-4 py-16 sm:px-10 lg:px-16">
          <div className="max-w-xl">
            <p className="text-sm font-black uppercase text-[#61dbe5]">Para quem é</p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none sm:text-6xl">
              Para casais que ainda querem lutar juntos
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#c8dddd]">
              Para quem sente distância, rotina, cansaço ou feridas abertas, mas ainda reconhece que existe uma aliança maior do que a crise.
            </p>
            <div className="mt-8 grid gap-3">
              {[
                'Vocês precisam conversar sem se atacar.',
                'Vocês querem recuperar alegria e cumplicidade.',
                'Vocês buscam ferramentas práticas, não frases prontas.',
              ].map((item) => (
                <p key={item} className="flex gap-3 text-base text-[#effafa]">
                  <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-[#61dbe5]" />
                  <span>{item}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="jornada" className="bg-[#fffaf0] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[6px]">
              <Image src={assets.intimate} alt="Casal em momento de oração" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="relative mt-10 aspect-[4/5] overflow-hidden rounded-[6px]">
              <Image src={assets.canoe} alt="Casal remando em uma canoa" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
          </div>

          <div>
            <p className="text-sm font-black uppercase text-[#d95412]">A jornada</p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none text-[#102124] sm:text-6xl">
              Do silêncio ao compromisso
            </h2>
            <ol className="mt-8 space-y-5">
              {journey.map((item, index) => (
                <li key={item} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#092629] text-sm font-black text-[#61dbe5]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span className="pt-2 text-lg font-bold text-[#253f44]">{item}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section id="filme" className="bg-[#092629] px-4 py-16 text-[#fffaf0] sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase text-[#61dbe5]">Veja por dentro</p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none sm:text-6xl">
              Setenta segundos para sentir o REM
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#c8dddd]">
              Um recorte direto do encontro: casais chegando, líderes conduzindo, conversas difíceis, oração, celebração e decisões que seguem para casa.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {['Filme horizontal', 'Com áudio', 'Otimizado para web'].map((item) => (
                <span key={item} className="rounded-full border border-[#61dbe5]/35 px-4 py-2 text-xs font-black uppercase text-[#9fe8ec]">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-[8px] bg-[#061617] shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
            <video
              className="aspect-video h-auto w-full object-cover"
              src={assets.film}
              poster={assets.filmPoster}
              controls
              playsInline
              preload="metadata"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#f5f1e8] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-sm font-black uppercase text-[#d95412]">Momentos REM</p>
            <h2 className="mt-4 text-4xl font-black uppercase leading-none text-[#102124] sm:text-6xl">
              A transformação aparece nos detalhes
            </h2>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {gallery.map((item, index) => (
              <figure
                key={item.src}
                className={`group relative overflow-hidden rounded-[6px] bg-[#102124] ${
                  index === 0 || index === 5 ? 'md:col-span-2' : ''
                }`}
              >
                <div className="relative aspect-[16/11]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    loading="eager"
                    sizes={index === 0 || index === 5 ? '(min-width: 768px) 66vw, 100vw' : '(min-width: 768px) 33vw, 100vw'}
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <figcaption className="absolute bottom-3 left-3 rounded-full bg-[#fffaf0] px-3 py-1 text-xs font-black uppercase text-[#092629]">
                  {item.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="eventos" className="bg-[#fffaf0] px-4 py-16 sm:px-6 lg:px-10 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-3xl">
              <p className="text-sm font-black uppercase text-[#d95412]">Calendário</p>
              <h2 className="mt-4 text-4xl font-black uppercase leading-none text-[#102124] sm:text-6xl">
                Encontre uma edição perto de você
              </h2>
            </div>
            <Link
              href="/calendario"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#092629] px-6 text-sm font-black uppercase text-[#092629] transition hover:bg-[#092629] hover:text-[#fffaf0]"
            >
              Ver calendário completo
            </Link>
          </div>

          <div className="mt-10 grid gap-4 lg:grid-cols-3">
            {loading ? (
              [0, 1, 2].map((item) => (
                <div key={item} className="h-64 animate-pulse rounded-[6px] bg-[#e3ddd0]" />
              ))
            ) : editions.length > 0 ? (
              editions.map((edition) => (
                <article key={edition.id} className="rounded-[6px] bg-[#092629] p-6 text-[#fffaf0] shadow-[0_18px_44px_rgba(9,38,41,0.16)]">
                  <p className="inline-flex rounded-full bg-[#36d3df] px-3 py-1 text-xs font-black uppercase text-[#062529]">
                    Inscrições abertas
                  </p>
                  <h3 className="mt-8 text-3xl font-black uppercase">
                    {edition.headquarters?.city || edition.name || 'REM Brasil'}
                  </h3>
                  <div className="mt-6 space-y-3 text-[#d8eeee]">
                    <p className="flex gap-3">
                      <Calendar className="mt-1 h-5 w-5 shrink-0 text-[#ff6a1a]" />
                      <span>{formatDate(edition.start_at)}</span>
                    </p>
                    <p className="flex gap-3">
                      <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#ff6a1a]" />
                      <span>
                        {[edition.headquarters?.name, edition.headquarters?.state].filter(Boolean).join(', ') || 'Local a confirmar'}
                      </span>
                    </p>
                  </div>
                  <Link
                    href={eventHref(edition)}
                    className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#ff6a1a] px-5 text-sm font-black uppercase text-[#fffaf0] transition hover:bg-[#e9550d]"
                  >
                    Quero participar <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </article>
              ))
            ) : (
              <article className="rounded-[6px] bg-[#092629] p-8 text-[#fffaf0] lg:col-span-2">
                <h3 className="text-3xl font-black uppercase">Novas datas em preparação</h3>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-[#c8dddd]">
                  A agenda pública ainda não tem inscrições abertas. Fale com a equipe REM para ser avisado quando uma edição estiver disponível.
                </p>
              </article>
            )}

            <article className="rounded-[6px] border border-[#d7cec0] bg-[#f5f1e8] p-6 text-[#102124]">
              <Users className="h-9 w-9 text-[#d95412]" />
              <h3 className="mt-8 text-3xl font-black uppercase">Leve o REM para sua cidade</h3>
              <p className="mt-4 leading-7 text-[#51686d]">
                Converse com a equipe nacional e entenda os próximos passos para receber uma edição.
              </p>
              <a
                href="mailto:info@matrimoniosrem.com"
                className="mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#092629] px-5 text-sm font-black uppercase text-[#fffaf0] transition hover:bg-[#173f45]"
              >
                Falar com a equipe
              </a>
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#081719] px-4 py-20 text-[#fffaf0] sm:px-6 lg:px-10 lg:py-28">
        <Image
          src={assets.mountain}
          alt="Casais reunidos em uma montanha durante o REM"
          fill
          sizes="100vw"
          className="object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#081719_0%,rgba(8,23,25,0.82)_45%,rgba(8,23,25,0.45)_100%)]" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-black uppercase leading-none sm:text-6xl lg:text-7xl">
              O melhor investimento do seu casamento é o próximo passo de vocês.
            </h2>
            <p className="mt-6 text-lg leading-8 text-[#d8eeee]">
              Decidam juntos. Participem juntos. Voltem para casa com uma direção prática.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="#eventos"
                className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#ff6a1a] px-7 text-sm font-black uppercase text-[#fffaf0] transition hover:bg-[#e9550d]"
              >
                Escolher uma edição <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a
                href="mailto:info@matrimoniosrem.com"
                className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#fffaf0]/35 px-7 text-sm font-black uppercase text-[#fffaf0] transition hover:border-[#61dbe5] hover:text-[#61dbe5]"
              >
                Tirar dúvidas <MessageCircle className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-[#061617] px-4 py-10 text-[#d8eeee] sm:px-6 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <Image src={assets.logo} alt="REM Brasil" width={220} height={89} className="h-auto w-44" />
          <div className="flex flex-wrap gap-4">
            <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#12383d] text-[#fffaf0] hover:bg-[#36d3df] hover:text-[#062529]" aria-label="Facebook">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#12383d] text-[#fffaf0] hover:bg-[#36d3df] hover:text-[#062529]" aria-label="Instagram">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
          <p className="max-w-md text-sm leading-6 text-[#9fbec2]">
            Reto de Empoderamiento Matrimonial. Experiências para casais que escolheram caminhar juntos.
          </p>
          <div className="flex items-center gap-2 text-sm font-bold text-[#9fbec2]">
            <ShieldCheck className="h-5 w-5 text-[#61dbe5]" />
            <span>{new Date().getFullYear()} REM Brasil</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
