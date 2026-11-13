import React from 'react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { AchievementToast } from '../ui/AchievementToast';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 arcade-grid-bg">
      <Navbar />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
      <AchievementToast />
    </div>
  );
};
