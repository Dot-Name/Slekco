import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useLocalStorage } from '../hooks/useLocalStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useLocalStorage('slekco:token', '');
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setUser(null);
      setChecking(false);
      return;
    }
    let alive = true;
    api
      .get('/users/me', { token })
      .then((res) => alive && setUser(res.user))
      .catch(() => {
        if (!alive) return;
        setToken('');
        setUser(null);
      })
      .finally(() => alive && setChecking(false));
    return () => { alive = false; };
  }, [token, setToken]);

  const signIn = useCallback(
    async (credentials) => {
      const res = await api.post('/users/login', credentials);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    },
    [setToken]
  );

  const register = useCallback(
    async (payload) => {
      const res = await api.post('/users/register', payload);
      setToken(res.token);
      setUser(res.user);
      return res.user;
    },
    [setToken]
  );

  const signOut = useCallback(() => {
    setToken('');
    setUser(null);
  }, [setToken]);

  const value = useMemo(
    () => ({ user, token, checking, signIn, register, signOut }),
    [user, token, checking, signIn, register, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
};
