'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export type UserRole = {
  role_code: string;
  scope_type: string;
  headquarters_id?: string;
  edition_id?: string;
};

type AuthContextType = {
  user: User | null;
  roles: UserRole[];
  loading: boolean;
  signOut: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        headquarters_id,
        edition_id,
        roles (
          code,
          scope_type
        )
      `)
      .eq('user_id', userId)
      .eq('is_active', true);

    if (data && !error) {
      const mappedRoles: UserRole[] = data.map((ur: any) => ({
        role_code: ur.roles.code,
        scope_type: ur.roles.scope_type,
        headquarters_id: ur.headquarters_id,
        edition_id: ur.edition_id,
      }));
      setRoles(mappedRoles);
    } else {
      setRoles([]);
    }
  };

  useEffect(() => {
    async function getSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        await fetchRoles(session.user.id);
      }
      setLoading(false);
    }
    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchRoles(session.user.id);
      } else {
        setRoles([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = { user, roles, loading, signOut };
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
