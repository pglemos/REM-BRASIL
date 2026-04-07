'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { FolderPlus, UploadCloud, PlayCircle, FileText, Image as ImageIcon, LayoutTemplate, Grid, List, Download, Eye, MoreVertical, Cloud, TrendingUp, Database, File } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function MediaPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [stats, setStats] = useState({
    totalSize: 0,
    videoCount: 0,
    pdfCount: 0,
    imageCount: 0,
    otherCount: 0
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('file_assets')
      .select('*, content_versions(version_number)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching file assets:', error);
    } else if (data) {
      setAssets(data);
      
      let size = 0;
      let video = 0;
      let pdf = 0;
      let image = 0;
      let other = 0;

      data.forEach(asset => {
        size += asset.size_bytes || 0;
        if (asset.asset_type === 'video') video++;
        else if (asset.asset_type === 'pdf') pdf++;
        else if (asset.asset_type === 'image') image++;
        else other++;
      });

      setStats({
        totalSize: size,
        videoCount: video,
        pdfCount: pdf,
        imageCount: image,
        otherCount: other
      });
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      let assetType = 'other';
      if (file.type.startsWith('video/')) assetType = 'video';
      else if (file.type.startsWith('image/')) assetType = 'image';
      else if (file.type.startsWith('audio/')) assetType = 'audio';
      else if (file.type === 'application/pdf') assetType = 'pdf';

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${assetType}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('media-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase.from('file_assets').insert({
        asset_type: assetType,
        storage_path: filePath,
        original_filename: file.name,
        mime_type: file.type,
        size_bytes: file.size,
      });

      if (dbError) throw dbError;

      await fetchAssets();
      alert('Arquivo enviado com sucesso!');
    } catch (error: any) {
      console.error('Erro no upload:', error);
      alert(`Erro ao enviar arquivo: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDownload = async (asset: any) => {
    try {
      const { data, error } = await supabase.storage.from('media-assets').createSignedUrl(asset.storage_path, 60);
      if (error) throw error;
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error: any) {
      console.error('Erro ao gerar link de download:', error);
      alert('Erro ao acessar o arquivo. Verifique as permissões.');
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'video': return <PlayCircle className="w-6 h-6 text-pulse-cyan" />;
      case 'pdf': return <FileText className="w-6 h-6 text-pulse-cyan" />;
      case 'image': return <ImageIcon className="w-6 h-6 text-pulse-cyan" />;
      default: return <File className="w-6 h-6 text-pulse-cyan" />;
    }
  };

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
          <button 
            onClick={handleUploadClick}
            disabled={isUploading}
            className="flex items-center gap-2 bg-pulse-cyan text-white px-8 py-3 font-black text-xs technical-label uppercase shadow-lg shadow-pulse-cyan/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <UploadCloud className="w-4 h-4" /> 
            {isUploading ? 'Enviando...' : 'Upload de Ativo'}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
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
              <span className="text-[10px] technical-label px-2 py-1 bg-pulse-cyan/5 text-pulse-cyan font-black border border-pulse-cyan/20">{stats.videoCount} ATIVOS</span>
            </div>
            <h4 className="font-black text-lg uppercase italic mb-1">Vídeos</h4>
            <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">Conteúdo audiovisual</p>
          </div>
          {/* Folder Card 2 */}
          <div className="bg-white p-6 border-t-4 border-pulse-cyan shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-pulse-cyan/10 rounded-sm">
                <FileText className="w-6 h-6 text-pulse-cyan" />
              </div>
              <span className="text-[10px] technical-label px-2 py-1 bg-pulse-cyan/5 text-pulse-cyan font-black border border-pulse-cyan/20">{stats.pdfCount} ATIVOS</span>
            </div>
            <h4 className="font-black text-lg uppercase italic mb-1">Documentos PDF</h4>
            <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">Manuais e guias</p>
          </div>
          {/* Folder Card 3 */}
          <div className="bg-white p-6 border-t-4 border-pulse-cyan shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-pulse-cyan/10 rounded-sm">
                <ImageIcon className="w-6 h-6 text-pulse-cyan" />
              </div>
              <span className="text-[10px] technical-label px-2 py-1 bg-pulse-cyan/5 text-pulse-cyan font-black border border-pulse-cyan/20">{stats.imageCount} ATIVOS</span>
            </div>
            <h4 className="font-black text-lg uppercase italic mb-1">Artes Gráficas</h4>
            <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">Imagens e fotos</p>
          </div>
          {/* Folder Card 4 */}
          <div className="bg-white p-6 border-t-4 border-pulse-cyan shadow-sm hover:shadow-md transition-all cursor-pointer group">
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-pulse-cyan/10 rounded-sm">
                <LayoutTemplate className="w-6 h-6 text-pulse-cyan" />
              </div>
              <span className="text-[10px] technical-label px-2 py-1 bg-pulse-cyan/5 text-pulse-cyan font-black border border-pulse-cyan/20">{stats.otherCount} ATIVOS</span>
            </div>
            <h4 className="font-black text-lg uppercase italic mb-1">Outros Arquivos</h4>
            <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">Diversos</p>
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
        
        {loading ? (
          <div className="p-8 text-center text-on-surface-variant">Carregando ativos...</div>
        ) : assets.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant bg-white border border-outline/30 rounded-sm">Nenhum ativo encontrado.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assets.map((asset) => (
              <div key={asset.id} className="bg-white border border-outline/30 rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-all group">
                <div className="relative aspect-video overflow-hidden bg-surface-container flex items-center justify-center">
                  {getAssetIcon(asset.asset_type)}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/10 transition-opacity">
                    <button 
                      onClick={() => handleDownload(asset)}
                      className="w-12 h-12 bg-white text-pulse-cyan rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                    >
                      <Download className="w-6 h-6" />
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="truncate pr-4">
                      <h5 className="font-bold text-on-surface text-base mb-1 truncate" title={asset.original_filename || 'Sem Nome'}>
                        {asset.original_filename || 'Sem Nome'}
                      </h5>
                      <p className="text-[10px] technical-label text-on-surface-variant uppercase font-bold">
                        {asset.asset_type} • {formatBytes(asset.size_bytes || 0)}
                      </p>
                    </div>
                    <button className="text-on-surface-variant hover:text-pulse-cyan flex-shrink-0"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline/30">
                    <div>
                      <p className="text-[8px] technical-label font-black text-on-surface-variant uppercase mb-1">Versão</p>
                      <p className="font-mono font-bold text-pulse-cyan text-xs">
                        {asset.content_versions?.version_number ? `v${asset.content_versions.version_number}` : '--'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[8px] technical-label font-black text-on-surface-variant uppercase mb-1">Data Upload</p>
                      <p className="text-xs font-bold text-on-surface">{format(new Date(asset.created_at), 'dd MMM yyyy', { locale: ptBR })}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
            <span className="technical-label text-[10px] text-on-surface-variant uppercase font-bold">Ativos Totais</span>
            <TrendingUp className="w-6 h-6 text-action-orange" />
          </div>
          <div>
            <div className="text-3xl font-black">{assets.length}</div>
            <div className="text-[10px] technical-label text-on-surface-variant font-bold uppercase">Arquivos no sistema</div>
          </div>
        </div>
        <div className="bg-white p-6 border-l-4 border-on-surface shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="technical-label text-[10px] text-on-surface-variant uppercase font-bold">Storage Capacity</span>
            <Database className="w-6 h-6 text-on-surface" />
          </div>
          <div>
            <div className="text-2xl font-black">{formatBytes(stats.totalSize)}</div>
            <div className="text-[10px] technical-label text-on-surface-variant font-bold uppercase">Armazenamento Utilizado</div>
          </div>
        </div>
      </div>
    </div>
  );
}