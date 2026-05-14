import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-card py-6 text-center text-sm text-text-light">
        <p>© 2025 挑战西交图寻 · 发现校园之美</p>
      </footer>
    </div>
  );
}
