import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../features/cart/CartDrawer';
import { PandaAssistant } from '../features/ai-assistant/PandaAssistant';

export const StorefrontLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5EE] text-[#252525]">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <PandaAssistant />
    </div>
  );
};
