import Link from 'next/link';
import { Logo } from '@/components/Logo';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-rem-gray/20 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Logo className="w-24 h-24" layout="vertical" />
        </div>
        <h2 className="mt-8 text-center text-3xl font-serif font-bold text-rem-teal-dark tracking-tight">
          Acesso ao Control Center
        </h2>
        <p className="mt-3 text-center text-sm text-rem-teal font-medium">
          Ou{' '}
          <Link href="/" className="font-bold text-rem-orange hover:text-rem-red transition-colors">
            volte para a página inicial
          </Link>
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-6 shadow-xl shadow-rem-gray/50 sm:rounded-3xl sm:px-12 border border-rem-gray">
          <form className="space-y-6" action="/dashboard">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-rem-teal-dark mb-2 uppercase tracking-wider">
                Endereço de e-mail
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none block w-full px-4 py-3.5 border border-rem-gray rounded-xl shadow-sm placeholder-rem-teal/50 focus:outline-none focus:ring-2 focus:ring-rem-cyan/20 focus:border-rem-cyan sm:text-sm transition-all font-medium text-rem-teal-dark"
                  placeholder="diretor@rembrasil.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-rem-teal-dark mb-2 uppercase tracking-wider">
                Senha
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-4 py-3.5 border border-rem-gray rounded-xl shadow-sm placeholder-rem-teal/50 focus:outline-none focus:ring-2 focus:ring-rem-cyan/20 focus:border-rem-cyan sm:text-sm transition-all font-medium text-rem-teal-dark"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-rem-cyan focus:ring-rem-cyan border-rem-gray rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-rem-teal-dark font-bold">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-bold text-rem-orange hover:text-rem-red transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
            </div>

            <div className="pt-4">
              {/* For MVP demo purposes, we just link to the dashboard */}
              <Link
                href="/dashboard"
                className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-rem-white bg-rem-orange hover:bg-rem-red focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rem-orange transition-all uppercase tracking-wider"
              >
                Entrar no Control Center
              </Link>
            </div>
          </form>
          
          <div className="mt-10">
             <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-rem-gray" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-rem-teal font-bold uppercase tracking-wider text-xs">Acesso de Demonstração</span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Link
                  href="/dashboard"
                  className="w-full inline-flex justify-center py-3 px-4 border border-rem-gray rounded-xl shadow-sm bg-rem-white text-sm font-bold text-rem-teal-dark hover:bg-rem-gray/20 transition-colors"
                >
                  Nacional
                </Link>
                <Link
                  href="/local-dashboard"
                  className="w-full inline-flex justify-center py-3 px-4 border border-rem-gray rounded-xl shadow-sm bg-rem-white text-sm font-bold text-rem-teal-dark hover:bg-rem-gray/20 transition-colors"
                >
                  Local
                </Link>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}
