import { 
  Calendar, 
  Users, 
  CheckSquare, 
  AlertCircle,
  Clock,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardLocal() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">REM São Paulo</h1>
          <p className="text-sm text-gray-500">Próxima edição: 15 a 17 de Agosto, 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
            Ver Cronograma
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800">
            Modo Execução
          </button>
        </div>
      </div>

      {/* Status Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
        <div>
          <h3 className="text-sm font-medium text-amber-800">Edição em Preparação - Faltam 14 dias</h3>
          <p className="text-sm text-amber-700 mt-1">
            A edição ainda não pode ser marcada como &quot;Pronta&quot;. Faltam 2 responsáveis por ACTO e 5 itens críticos no checklist de compras.
          </p>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Casais</h3>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">45</span>
            <span className="text-sm text-gray-500 ml-2">/ 50 vagas</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
            <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '90%' }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center">
              <Users className="w-4 h-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Staff & Guias</h3>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">12</span>
            <span className="text-sm text-gray-500 ml-2">ativos</span>
          </div>
          <p className="text-xs text-green-600 mt-2 font-medium">Staff mínimo atingido</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center">
              <CheckSquare className="w-4 h-4 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">ACTOS Prontos</h3>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">28</span>
            <span className="text-sm text-gray-500 ml-2">/ 30</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-3">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '93%' }}></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-md bg-red-50 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-700">Pendências</h3>
          </div>
          <div className="mt-2">
            <span className="text-2xl font-bold text-gray-900">7</span>
            <span className="text-sm text-gray-500 ml-2">críticas</span>
          </div>
          <p className="text-xs text-red-600 mt-2 font-medium">Requer atenção imediata</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Próximos Passos / Pendências */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Ação Necessária</h2>
          </div>
          <div className="divide-y divide-gray-200">
            <div className="p-4 hover:bg-gray-50 flex items-start gap-4">
              <div className="mt-1">
                <Users className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Definir responsável: ACTO 14</h4>
                <p className="text-sm text-gray-500 mt-1">O ACTO &quot;Piquenique ao pôr-do-sol&quot; está sem responsável principal.</p>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Resolver</button>
            </div>
            <div className="p-4 hover:bg-gray-50 flex items-start gap-4">
              <div className="mt-1">
                <CheckSquare className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Compras atrasadas: ACTO 27</h4>
                <p className="text-sm text-gray-500 mt-1">Faltam 50 bombons e impressão dos talões de cheque.</p>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Resolver</button>
            </div>
            <div className="p-4 hover:bg-gray-50 flex items-start gap-4">
              <div className="mt-1">
                <BookOpen className="w-5 h-5 text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">Leitura Obrigatória</h4>
                <p className="text-sm text-gray-500 mt-1">Você tem 1 novo manual oficial pendente de leitura.</p>
              </div>
              <button className="text-sm font-medium text-blue-600 hover:text-blue-800">Ler agora</button>
            </div>
          </div>
        </div>

        {/* Resumo do Cronograma */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Trilha de ACTOS (Dia 1)</h2>
            <Link href="/actos" className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center">
              Ver todos <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
          <div className="p-6">
            <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                <p className="text-xs font-medium text-gray-500 mb-1">08:00</p>
                <h4 className="text-sm font-bold text-gray-900">ACTO 1 - Registro / Check-in</h4>
                <p className="text-sm text-gray-500 mt-1">Responsável: João Silva • Status: Pronto</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                <p className="text-xs font-medium text-gray-500 mb-1">09:30</p>
                <h4 className="text-sm font-bold text-gray-900">ACTO 2 - Nosso percurso para lembrar</h4>
                <p className="text-sm text-gray-500 mt-1">Responsável: Maria Souza • Status: Pronto</p>
              </div>
              <div className="relative pl-6">
                <div className="absolute w-3 h-3 bg-amber-500 rounded-full -left-[7px] top-1.5 ring-4 ring-white"></div>
                <p className="text-xs font-medium text-gray-500 mb-1">10:45</p>
                <h4 className="text-sm font-bold text-gray-900">ACTO 3 - Início da caminhada</h4>
                <p className="text-sm text-gray-500 mt-1">Responsável: Pedro Costa • Status: Faltam materiais</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
