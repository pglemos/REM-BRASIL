import { Users, Plus, Search, UserPlus } from 'lucide-react';

export default function StaffPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Equipes & Casais</h1>
          <p className="text-sm text-gray-500">REM São Paulo - Agosto 2026</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            Adicionar Staff
          </button>
          <button className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-800 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Novo Casal
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <a href="#" className="border-black text-black whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Casais (45)
          </a>
          <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Famílias/Equipes (5)
          </a>
          <a href="#" className="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm">
            Staff (12)
          </a>
        </nav>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-md w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
              placeholder="Buscar casal por nome..."
            />
          </div>
          <div className="flex gap-2">
            <select className="border border-gray-300 rounded-md text-sm py-2 px-3 bg-white focus:outline-none focus:ring-black focus:border-black">
              <option>Todos os Status</option>
              <option>Confirmado</option>
              <option>Pré-inscrito</option>
              <option>Cancelado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Casal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contato
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Família/Equipe
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Saúde/Restrições
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { nameA: 'Carlos Silva', nameB: 'Ana Silva', phone: '(11) 98765-4321', family: 'Família Azul', status: 'Confirmado', health: 'Nenhuma' },
                { nameA: 'Roberto Costa', nameB: 'Juliana Costa', phone: '(11) 91234-5678', family: 'Família Verde', status: 'Confirmado', health: 'Alergia (Ana)' },
                { nameA: 'Marcos Santos', nameB: 'Fernanda Santos', phone: '(11) 99999-8888', family: 'Não alocado', status: 'Pré-inscrito', health: 'Pendente' },
                { nameA: 'Lucas Oliveira', nameB: 'Mariana Oliveira', phone: '(11) 97777-6666', family: 'Família Azul', status: 'Confirmado', health: 'Nenhuma' },
              ].map((couple, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-gray-500" />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{couple.nameA} & {couple.nameB}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{couple.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      couple.family === 'Não alocado' ? 'bg-gray-100 text-gray-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {couple.family}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      couple.status === 'Confirmado' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {couple.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {couple.health === 'Pendente' ? (
                      <span className="text-amber-600 font-medium">Pendente</span>
                    ) : couple.health !== 'Nenhuma' ? (
                      <span className="text-red-600 font-medium">{couple.health}</span>
                    ) : (
                      <span>{couple.health}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Equipes & Casais',
};
