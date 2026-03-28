'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const isAuthPage = pathname === '/login' || pathname === '/register';

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="font-bold text-lg text-white hidden sm:inline">
                Product Investment
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden sm:flex items-center gap-4">
              {!loading && user ? (
                <>
                  <div className="flex gap-4">
                    <Link
                      href="/dashboard"
                      className={`px-4 py-2 rounded-lg transition ${
                        pathname === '/dashboard'
                          ? 'text-amber-400 bg-slate-700'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/products"
                      className={`px-4 py-2 rounded-lg transition ${
                        pathname === '/products'
                          ? 'text-amber-400 bg-slate-700'
                          : 'text-slate-300 hover:text-white'
                      }`}
                    >
                      Products
                    </Link>
                  </div>

                  <div className="flex items-center gap-2 pl-4 border-l border-slate-700">
                    <span className="text-slate-300 text-sm">{user.name}</span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : !isAuthPage ? (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition"
                >
                  Login
                </Link>
              ) : null}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-slate-700 transition"
            >
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={mobileMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && !loading && user && (
        <div className="sm:hidden bg-slate-800 border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 py-4 space-y-2">
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition ${
                pathname === '/dashboard'
                  ? 'text-amber-400 bg-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-2 rounded-lg transition ${
                pathname === '/products'
                  ? 'text-amber-400 bg-slate-700'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              Products
            </Link>
            <div className="pt-2 border-t border-slate-700">
              <p className="px-4 py-2 text-slate-300 text-sm">{user.name}</p>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-slate-700 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
