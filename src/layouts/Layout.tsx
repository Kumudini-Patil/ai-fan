import { ReactNode } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        {children}
      </main>
      <Footer />
    </div>
  );
}

export function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center px-4 py-12 pt-24">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
