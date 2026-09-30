import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getAccount, getCart, getToken, setToken } from '../api';

const AppContext = createContext(null);

export const useApp = () => useContext(AppContext);

const EMPTY_CART = { items: [], total: '0.00' };

// Holds the logged-in user and their basket for every page
export function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(EMPTY_CART);
  const [loading, setLoading] = useState(Boolean(getToken()));

  const refreshCart = useCallback(() => {
    if (!getToken()) return Promise.resolve(setCart(EMPTY_CART));
    return getCart().then(setCart);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    setCart(EMPTY_CART);
  }, []);

  const startSession = useCallback(
    ({ user: newUser, token }) => {
      setToken(token);
      setUser(newUser);
      return refreshCart();
    },
    [refreshCart]
  );

  // Restore the session saved in localStorage
  useEffect(() => {
    if (!getToken()) return;
    Promise.all([getAccount(), getCart()])
      .then(([account, basket]) => {
        setUser(account.user);
        setCart(basket);
      })
      .catch(logout)
      .finally(() => setLoading(false));
  }, [logout]);

  const value = { user, setUser, cart, setCart, refreshCart, startSession, logout, loading };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
