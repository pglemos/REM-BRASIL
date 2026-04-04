'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  role: string | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('staff')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (profile) setRole(profile.role);
      }
      setLoading(false);
    }
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('staff')
          .select('role')
          .eq('id', session.user.id)
          .single()
          .then(({ data }) => {
            if (data) setRole(data.role);
          });
      } else {
        setRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const value = { user, role, loading };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
