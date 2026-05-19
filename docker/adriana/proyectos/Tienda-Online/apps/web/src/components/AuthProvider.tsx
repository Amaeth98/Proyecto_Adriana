'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { AuthUser, Cart } from '@/lib/types';

type AuthState = {
  token: string | null;
  user: AuthUser | null;
  ready: boolean;
  cartCount: number;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  refreshCartCount: () => Promise<void>;
  updateUser: (user: AuthUser) => void;
};

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    setToken(localStorage.getItem('token'));
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
    setReady(true);
  }, []);

  async function refreshCartCount() {
    if (!token) {
      setCartCount(0);
      return;
    }

    try {
      const cart = await apiRequest<Cart>('/cart', { token });
      setCartCount(cart.items.reduce((total, item) => total + item.quantity, 0));
    } catch {
      setCartCount(0);
    }
  }

  useEffect(() => {
    void refreshCartCount();
  }, [token]);

  const value = useMemo<AuthState>(
    () => ({
      token,
      user,
      ready,
      cartCount,
      login(nextToken, nextUser) {
        localStorage.setItem('token', nextToken);
        localStorage.setItem('user', JSON.stringify(nextUser));
        setToken(nextToken);
        setUser(nextUser);
      },
      logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
        setCartCount(0);
      },
      refreshCartCount,
      updateUser(nextUser) {
        localStorage.setItem('user', JSON.stringify(nextUser));
        setUser(nextUser);
      },
    }),
    [token, user, ready, cartCount],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}
