'use client';

import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';
import { format } from 'date-fns';

export function NotificationBell() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);
        
      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.read_at).length);
      }
    };

    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev].slice(0, 5));
          setUnreadCount(prev => prev + 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
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
      setUnreadCount(prev => Math.max(0, prev - 1));
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
      setUnreadCount(0);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-on-surface-variant hover:text-pulse-cyan transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-action-red text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-outline/30 rounded-sm shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b border-outline/30 bg-surface-container/30 flex justify-between items-center">
            <h3 className="text-xs technical-label font-black uppercase text-on-surface">Notificações</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-[10px] technical-label font-bold uppercase text-pulse-cyan hover:text-pulse-cyan-dark"
              >
                Marcar todas como lidas
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-sm text-on-surface-variant italic text-center">Nenhuma notificação.</p>
            ) : (
              <ul className="divide-y divide-outline/30">
                {notifications.map(notification => (
                  <li 
                    key={notification.id} 
                    className={`p-4 hover:bg-surface-container-low transition-colors ${!notification.read_at ? 'bg-pulse-cyan/5' : ''}`}
                    onClick={() => !notification.read_at && markAsRead(notification.id)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-xs font-bold uppercase ${!notification.read_at ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-[10px] technical-label text-on-surface-variant flex-shrink-0 ml-2">
                        {format(new Date(notification.created_at), "dd/MM HH:mm")}
                      </span>
                    </div>
                    <p className={`text-sm ${!notification.read_at ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                      {notification.body}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          <div className="p-2 border-t border-outline/30 bg-surface-container/30 text-center">
            <Link 
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-xs technical-label font-bold uppercase text-pulse-cyan hover:text-pulse-cyan-dark block py-2"
            >
              Ver todas as notificações
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
