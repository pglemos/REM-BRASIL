'use client';

import { useState, useEffect } from 'react';
import { Bell, CheckCircle2, Trash2 } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/hooks/useAuth';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Link from 'next/link';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      setLoading(true);
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
        
      if (data) {
        setNotifications(data);
      }
      setLoading(false);
    };

    fetchNotifications();
  }, [user, supabase]);

  const markAsRead = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('id', id);
      
    if (!error) {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
      );
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    const { error } = await supabase
      .from('notifications')
      .update({ read_at: new Date().toISOString() })
      .eq('user_id', user.id)
      .is('read_at', null);
      
    if (!error) {
      setNotifications(prev => 
        prev.map(n => ({ ...n, read_at: new Date().toISOString() }))
      );
    }
  };

  const deleteNotification = async (id: string) => {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);
      
    if (!error) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-on-surface-variant">Carregando notificações...</div>;
  }

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="technical-label text-pulse-cyan font-bold text-xs uppercase">Comunicação</span>
          <h1 className="text-5xl font-black editorial-title text-on-surface mt-2 uppercase">Notificações</h1>
          <p className="text-on-surface-variant mt-2 font-bold text-sm technical-label uppercase">Seus alertas e avisos do sistema</p>
        </div>
        
        {notifications.some(n => !n.read_at) && (
          <button 
            onClick={markAllAsRead}
            className="bg-surface-container text-on-surface-variant px-6 py-2.5 font-black text-xs technical-label uppercase shadow-sm active:scale-95 transition-all flex items-center gap-2 hover:text-pulse-cyan"
          >
            <CheckCircle2 className="w-4 h-4" /> Marcar todas como lidas
          </button>
        )}
      </header>

      <div className="bg-white border border-outline/30 rounded-sm shadow-sm overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
            <Bell className="w-12 h-12 text-outline mb-4" />
            <h3 className="text-lg font-black uppercase text-on-surface">Nenhuma notificação</h3>
            <p className="text-sm text-on-surface-variant mt-2">Você está em dia com seus avisos.</p>
          </div>
        ) : (
          <ul className="divide-y divide-outline/30">
            {notifications.map(notification => (
              <li 
                key={notification.id} 
                className={`p-6 transition-colors flex flex-col sm:flex-row sm:items-start gap-4 ${!notification.read_at ? 'bg-pulse-cyan/5' : 'hover:bg-surface-container-low'}`}
              >
                <div className="flex-shrink-0 mt-1">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${!notification.read_at ? 'bg-pulse-cyan/20 text-pulse-cyan' : 'bg-surface-container-high text-on-surface-variant'}`}>
                    <Bell className="w-5 h-5" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                    <h4 className={`text-sm font-black uppercase ${!notification.read_at ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs technical-label font-bold text-on-surface-variant whitespace-nowrap">
                      {format(new Date(notification.created_at), "dd 'de' MMM, HH:mm", { locale: ptBR })}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-4 ${!notification.read_at ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {notification.body}
                  </p>
                  
                  <div className="flex items-center gap-4">
                    {notification.reference_type === 'edition' && notification.reference_id && (
                      <Link 
                        href={`/editions/${notification.reference_id}`}
                        className="text-xs technical-label font-bold uppercase text-pulse-cyan hover:text-pulse-cyan-dark"
                      >
                        Ver Edição
                      </Link>
                    )}
                    {notification.reference_type === 'acto' && notification.reference_id && (
                      <Link 
                        href={`/actos/${notification.reference_id}`}
                        className="text-xs technical-label font-bold uppercase text-pulse-cyan hover:text-pulse-cyan-dark"
                      >
                        Ver ACTO
                      </Link>
                    )}
                    
                    {!notification.read_at && (
                      <button 
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs technical-label font-bold uppercase text-on-surface-variant hover:text-pulse-cyan"
                      >
                        Marcar como lida
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex-shrink-0 sm:ml-4">
                  <button 
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-on-surface-variant hover:text-action-red transition-colors"
                    title="Excluir notificação"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
