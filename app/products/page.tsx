'use client';

import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/lib/products';
import { useState } from 'react';

export default function ProductsPage() {
  const [successMessage, setSuccessMessage] = useState('');

  const handleInvestSuccess = (amount: number) => {
    setSuccessMessage(`Investment of ${amount.toLocaleString()} created successfully!`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-white mb-2">Investment Products</h1>
            <p className="text-slate-400 text-lg">
              Choose from our premium investment products with guaranteed returns
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 bg-green-900 border border-green-700 rounded-lg p-4 text-green-200 flex items-center gap-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {successMessage}
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {PRODUCTS.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onInvest={handleInvestSuccess}
              />
            ))}
          </div>

          {/* Info Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold text-amber-400 mb-2">125%</div>
                <p className="text-slate-400">Entry-level returns for 12 months</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">150%</div>
                <p className="text-slate-400">Mid-tier returns for 18 months</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-400 mb-2">175%</div>
                <p className="text-slate-400">Premium returns for 24 months</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Why Choose Our Products?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-amber-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Guaranteed Returns</h3>
                  <p className="text-slate-400 text-sm">Fixed return rates locked in at investment time</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Flexible Terms</h3>
                  <p className="text-slate-400 text-sm">Choose between 12, 18, or 24-month plans</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Easy Management</h3>
                  <p className="text-slate-400 text-sm">Track and manage all investments from your dashboard</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-lg bg-purple-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  ✓
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Quick Withdrawals</h3>
                  <p className="text-slate-400 text-sm">Withdraw your returns instantly after maturity</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
