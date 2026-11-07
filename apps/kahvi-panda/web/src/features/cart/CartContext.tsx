import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem } from '../../types';
import { BRAND } from '@kahvi-panda/shared';

interface CartContextType {
  items: CartItem[];
  couponCode: string;
  setCouponCode: (code: string) => void;
  addItem: (item: Omit<CartItem, 'key'>, openDrawer?: boolean) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  amountNeededForFreeShipping: number;
  isFreeShipping: boolean;
}

const CART_STORAGE_KEY = 'kahvi_cart_items_v2';
const COUPON_STORAGE_KEY = 'kahvi_cart_coupon';

const isStoredCartItem = (value: unknown): value is CartItem => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Partial<CartItem>;
  return typeof item.key === 'string'
    && typeof item.productId === 'string'
    && typeof item.variantId === 'string'
    && typeof item.name === 'string'
    && typeof item.slug === 'string'
    && typeof item.image === 'string'
    && typeof item.weight === 'string'
    && typeof item.grindType === 'string'
    && typeof item.price === 'number'
    && Number.isFinite(item.price)
    && item.price > 0
    && typeof item.quantity === 'number'
    && Number.isInteger(item.quantity)
    && item.quantity >= 1
    && item.quantity <= 50;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? parsed.filter(isStoredCartItem) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [couponCode, setCouponCodeState] = useState(() => {
    try {
      return localStorage.getItem(COUPON_STORAGE_KEY) || '';
    } catch {
      return '';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  useEffect(() => {
    try {
      if (couponCode) {
        localStorage.setItem(COUPON_STORAGE_KEY, couponCode);
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to save coupon code to localStorage', e);
    }
  }, [couponCode]);

  const setCouponCode = useCallback((code: string) => {
    setCouponCodeState(code.trim().toUpperCase());
  }, []);

  const addItem = (item: Omit<CartItem, 'key'>, shouldOpenDrawer = true) => {
    if (!Number.isFinite(item.quantity) || item.quantity < 1) return;
    const quantity = Math.min(50, Math.floor(item.quantity));
    if (quantity < 1) return;
    const key = `${item.productId}_${item.variantId}_${item.grindType}`;
    setItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: Math.min(50, i.quantity + quantity) } : i
        );
      }
      return [...prev, { ...item, quantity, key }];
    });

    if (shouldOpenDrawer) {
      setIsDrawerOpen(true);
    }
  };

  const removeItem = (key: string) => {
    setItems((prev) => prev.filter((i) => i.key !== key));
  };

  const updateQuantity = (key: string, qty: number) => {
    if (!Number.isFinite(qty)) return;
    const quantity = Math.floor(qty);
    if (quantity <= 0) {
      removeItem(key);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity: Math.min(50, quantity) } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCodeState('');
  };

  const itemCount = useMemo(
    () => items.reduce((acc, item) => acc + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  const isFreeShipping = subtotal >= BRAND.freeShippingThreshold;
  const amountNeededForFreeShipping = Math.max(0, BRAND.freeShippingThreshold - subtotal);

  return (
    <CartContext.Provider
      value={{
        items,
        couponCode,
        setCouponCode,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        amountNeededForFreeShipping,
        isFreeShipping,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
