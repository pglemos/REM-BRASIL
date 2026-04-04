import { FolderPlus, UploadCloud, PlayCircle, FileText, Image as ImageIcon, LayoutTemplate, Grid, List, Download, Eye, MoreVertical, Cloud, TrendingUp, Database } from 'lucide-react';

export default function MediaPage() {
  return (
    <div className="space-y-6">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-action-orange font-bold text-xs uppercase">Módulo K</span>
          <h2 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Gestão de Arquivos e Mídia</h2>
          <p className="text-on-surface-variant mt-2 max-w-xl">Biblioteca central de ativos oficiais para coordenação nacional e regional.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 bg-white border border-outline/50 px-6 py-3 font-black text-xs technical-label uppercase hover:bg-surface-container transition-all">
            <FolderPlus className="w-4 h-4" /> Nova Pasta
          </button>
          <button className="flex items-center gap-2 bg-pulse-cyan text-white px-8 py-3 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all">
            <UploadCloud className="w-4 h-4" /> Upload de Ativo
          </button>
        </div>
      </header>

      {/* Pastas Estruturais */}
      <div className="mb-12">
        <h3 className="technical-label text-[10px] font-black uppercase text-on-surface-variant mb-6">Pastas Estruturais</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Folder Card 1 */}
          <div className="bg-white p-6 border-t-4 border-pulse-cyan shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-pulse-cyan/10 rounded-sm">
                <PlayCircle className="w-6 h-6 text-pulse-cyan" />
              </div>
              <span className="text-[10px] technical-label px-2 py-1 bg-pulse-cyan/5 text-pulse-cyan font-black border border-pulse-cyan/20">12 ATIVOS</span>
            </div>
            <h4 className="font-black text-lg uppercase italic mb-1">Vídeos de Abertura</h4>
            <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">Último upload há 2 dias</p>
          </div>
          {/* Folder Card 2 */}
          <div className="bg-white p-6 border-t-4 border-pulse-cyan shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-pulse-cyan/10 rounded-sm">
                <FileText className="w-6 h-6 text-pulse-cyan" />
              </div>
              <span className="text-[10px] technical-label px-2 py-1 bg-pulse-cyan/5 text-pulse-cyan font-black border border-pulse-cyan/20">45 ATIVOS</span>
            </div>
            <h4 className="font-black text-lg uppercase italic mb-1">PDFs de Pregação</h4>
            <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">Último upload hoje</p>
          </div>
          {/* Folder Card 3 */}
          <div className="bg-white p-6 border-t-4 border-pulse-cyan shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-pulse-cyan/10 rounded-sm">
                <ImageIcon className="w-6 h-6 text-pulse-cyan" />
              </div>
              <span className="text-[10px] technical-label px-2 py-1 bg-pulse-cyan/5 text-pulse-cyan font-black border border-pulse-cyan/20">89 ATIVOS</span>
            </div>
            <h4 className="font-black text-lg uppercase italic mb-1">Artes Gráficas</h4>
            <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">Último upload ontem</p>
          </div>
          {/* Folder Card 4 */}
          <div className="bg-white p-6 border-t-4 border-pulse-cyan shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-pulse-cyan/10 rounded-sm">
                <LayoutTemplate className="w-6 h-6 text-pulse-cyan" />
              </div>
              <span className="text-[10px] technical-label px-2 py-1 bg-pulse-cyan/5 text-pulse-cyan font-black border border-pulse-cyan/20">8 ATIVOS</span>
            </div>
            <h4 className="font-black text-lg uppercase italic mb-1">Identidade Visual</h4>
            <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">Último upload há 1 mês</p>
          </div>
        </div>
      </div>

      {/* Ativos Recentes */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="technical-label text-[10px] font-black uppercase text-on-surface-variant">Ativos Recentes</h3>
          <div className="flex gap-2">
            <button className="w-8 h-8 flex items-center justify-center bg-surface-container border border-outline/50 text-pulse-cyan">
              <Grid className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center bg-white border border-outline/50 text-on-surface-variant hover:bg-surface-container transition-all">
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* File Card 1 */}
          <div className="bg-white border border-outline/30 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="relative aspect-video overflow-hidden bg-black/5">
              <img alt="Asset Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90" src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop" referrerPolicy="no-referrer" />
              <div className="absolute top-3 right-3">
                <span className="text-[8px] technical-label px-2 py-1 bg-action-orange text-white font-black uppercase">Conteúdo Obrigatório</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                <button className="w-12 h-12 bg-white text-pulse-cyan rounded-full flex items-center justify-center shadow-xl">
                  <PlayCircle className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h5 className="font-bold text-on-surface text-base mb-1">Abertura_Campanha_2024_v2.mp4</h5>
                  <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">Vídeo de Alta Resolução • 245MB</p>
                </div>
                <button className="text-on-surface-variant hover:text-pulse-cyan"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline/30">
                <div>
                  <p className="text-[8px] technical-label font-black text-on-surface-variant uppercase mb-1">Versão</p>
                  <p className="font-mono font-bold text-pulse-cyan text-xs">v2.4.1</p>
                </div>
                <div>
                  <p className="text-[8px] technical-label font-black text-on-surface-variant uppercase mb-1">Data Upload</p>
                  <p className="text-xs font-bold text-on-surface">12 Out 2023</p>
                </div>
              </div>
            </div>
          </div>
          {/* File Card 2 */}
          <div className="bg-white border border-outline/30 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="relative aspect-video overflow-hidden bg-surface-container flex items-center justify-center">
              <FileText className="w-16 h-16 text-outline/50" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity">
                <button className="w-12 h-12 bg-white text-pulse-cyan rounded-full flex items-center justify-center shadow-xl">
                  <Download className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h5 className="font-bold text-on-surface text-base mb-1">Guia_Lideranca_Regional.pdf</h5>
                  <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">Documento PDF • 12MB</p>
                </div>
                <button className="text-on-surface-variant hover:text-pulse-cyan"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline/30">
                <div>
                  <p className="text-[8px] technical-label font-black text-on-surface-variant uppercase mb-1">Versão</p>
                  <p className="font-mono font-bold text-pulse-cyan text-xs">v1.0.0</p>
                </div>
                <div>
                  <p className="text-[8px] technical-label font-black text-on-surface-variant uppercase mb-1">Data Upload</p>
                  <p className="text-xs font-bold text-on-surface">15 Out 2023</p>
                </div>
              </div>
            </div>
          </div>
          {/* File Card 3 */}
          <div className="bg-white border border-outline/30 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all group">
            <div className="relative aspect-video overflow-hidden bg-black/5">
              <img alt="Asset Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-90" src="https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=800&auto=format&fit=crop" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/20 transition-opacity">
                <button className="w-12 h-12 bg-white text-pulse-cyan rounded-full flex items-center justify-center shadow-xl">
                  <Eye className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h5 className="font-bold text-on-surface text-base mb-1">Poster_Social_Media_HQ.png</h5>
                  <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">Imagem PNG • 4.5MB</p>
                </div>
                <button className="text-on-surface-variant hover:text-pulse-cyan"><MoreVertical className="w-5 h-5" /></button>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline/30">
                <div>
                  <p className="text-[8px] technical-label font-black text-on-surface-variant uppercase mb-1">Versão</p>
                  <p className="font-mono font-bold text-pulse-cyan text-xs">v3.2.0</p>
                </div>
                <div>
                  <p className="text-[8px] technical-label font-black text-on-surface-variant uppercase mb-1">Data Upload</p>
                  <p className="text-xs font-bold text-on-surface">18 Out 2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 border-l-4 border-pulse-cyan shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="technical-label text-[10px] text-on-surface-variant uppercase font-bold">Cloud Health</span>
            <Cloud className="w-6 h-6 text-pulse-cyan" />
          </div>
          <div>
            <div className="text-2xl font-black text-pulse-cyan uppercase">Healthy</div>
            <div className="w-full bg-surface-container h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-pulse-cyan w-[65%] h-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 border-l-4 border-action-orange shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="technical-label text-[10px] text-on-surface-variant uppercase font-bold">Engagement Velocity</span>
            <TrendingUp className="w-6 h-6 text-action-orange" />
          </div>
          <div>
            <div className="text-3xl font-black">+12.5%</div>
            <div className="text-[10px] technical-label text-on-surface-variant font-bold uppercase">This Month</div>
          </div>
        </div>
        <div className="bg-white p-6 border-l-4 border-on-surface shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="technical-label text-[10px] text-on-surface-variant uppercase font-bold">Storage Capacity</span>
            <Database className="w-6 h-6 text-on-surface" />
          </div>
          <div>
            <div className="text-2xl font-black">6.5 <span className="text-sm">/ 10 GB</span></div>
            <div className="text-[10px] technical-label text-on-surface-variant font-bold uppercase">65% Used</div>
          </div>
        </div>
      </div>
    </div>
  );
}
