import { useState, useEffect, useCallback } from 'react';

function buildAuthState() {
  const token = localStorage.getItem('token');
  const userRaw = localStorage.getItem('user');
  let user = null;
  try {
    user = userRaw ? JSON.parse(userRaw) : null;
  } catch {
    user = null;
  }
  const role = user?.role || null;
  return {
    token,
    user,
    isLoggedIn: !!token && token !== 'guest',
    isGuest: token === 'guest' || role === 'GUEST',
    role,
    isAdmin: role === 'ADMIN',
  };
}

export function useAuth() {
  const [authState, setAuthState] = useState(buildAuthState);

  const refresh = useCallback(() => {
    setAuthState(buildAuthState());
  }, []);

  useEffect(() => {
    const handleStorage = () => refresh();
    const handleAuthChange = () => refresh();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('auth-change', handleAuthChange);
    const interval = setInterval(refresh, 1000);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('auth-change', handleAuthChange);
      clearInterval(interval);
    };
  }, [refresh]);

  const login = useCallback((token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    window.dispatchEvent(new Event('auth-change'));
    refresh();
  }, [refresh]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.dispatchEvent(new Event('auth-change'));
    refresh();
    window.location.href = '/login';
  }, [refresh]);

  const enterGuest = useCallback(() => {
    localStorage.setItem('token', 'guest');
    localStorage.setItem('user', JSON.stringify({ username: 'Invitado', role: 'GUEST', nombre: 'Invitado' }));
    window.dispatchEvent(new Event('auth-change'));
    refresh();
    window.location.href = '/dashboard';
  }, [refresh]);

  return {
    ...authState,
    login,
    logout,
    enterGuest,
    refresh,
  };
}
