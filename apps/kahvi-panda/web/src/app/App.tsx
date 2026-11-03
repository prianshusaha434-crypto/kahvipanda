import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from '../features/cart/CartContext';
import { StorefrontLayout } from '../layouts/StorefrontLayout';

import { HomePage } from '../pages/HomePage';
import { ShopPage } from '../pages/ShopPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CoffeeFinderPage } from '../pages/CoffeeFinderPage';
import { OurStoryPage } from '../pages/OurStoryPage';
import { CoffeeJournalPage } from '../pages/CoffeeJournalPage';
import { WholesalePage } from '../pages/WholesalePage';
import { ContactPage } from '../pages/ContactPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';
import { TrackOrderPage } from '../pages/TrackOrderPage';
import { PolicyPage } from '../pages/PolicyPage';
import { AccountPage } from '../pages/AccountPage';
import { AdminPage } from '../pages/AdminPage';

export const App: React.FC = () => {
  return (
    <CartProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Storefront Routes with Header, Footer, and Panda AI */}
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:categorySlug" element={<ShopPage />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/collections" element={<ShopPage />} />
            <Route path="/bundles" element={<ShopPage />} />
            <Route path="/coffee-finder" element={<CoffeeFinderPage />} />
            <Route path="/our-story" element={<OurStoryPage />} />
            <Route path="/coffee-journal" element={<CoffeeJournalPage />} />
            <Route path="/coffee-journal/:slug" element={<CoffeeJournalPage />} />
            <Route path="/wholesale" element={<WholesalePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            <Route path="/track-order" element={<TrackOrderPage />} />

            {/* Policy & FAQ routes */}
            <Route path="/faq" element={<PolicyPage />} />
            <Route path="/shipping-policy" element={<PolicyPage />} />
            <Route path="/refund-policy" element={<PolicyPage />} />
            <Route path="/privacy-policy" element={<PolicyPage />} />
            <Route path="/terms" element={<PolicyPage />} />

            {/* Customer Account */}
            <Route path="/account/*" element={<AccountPage />} />

            {/* Protected Admin Portal */}
            <Route path="/admin/*" element={<AdminPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </CartProvider>
  );
};

export default App;
