'use client';

import { Product } from '@/lib/products';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onInvest: (amount: number) => void;
}

interface ConfirmDialogState {
  isOpen: boolean;
  amount: number;
}

export default function ProductCard({ product, onInvest }: ProductCardProps) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    amount: 0,
  });

  const validateAndShowConfirm = () => {
    setError('');
    const investAmount = parseFloat(amount);

    if (!investAmount || investAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (investAmount < product.minInvestment) {
      setError(`Minimum investment is ${product.minInvestment}`);
      return;
    }

    if (investAmount > product.maxInvestment) {
      setError(`Maximum investment is ${product.maxInvestment}`);
      return;
    }

    setConfirmDialog({ isOpen: true, amount: investAmount });
  };

  const handleConfirmInvest = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/investments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          amount: confirmDialog.amount,
        }),
      });

      if (res.ok) {
        setAmount('');
        setConfirmDialog({ isOpen: false, amount: 0 });
        onInvest(confirmDialog.amount);
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create investment');
        setConfirmDialog({ isOpen: false, amount: 0 });
      }
    } catch (error) {
      setError('An error occurred');
      setConfirmDialog({ isOpen: false, amount: 0 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const expectedReturn = confirmDialog.amount
    ? confirmDialog.amount * (product.returnRate / 100)
    : 0;
  const totalAmount = confirmDialog.amount + expectedReturn;

  return (
    <>
      <div
        className={`relative overflow-hidden rounded-xl border border-slate-700 bg-gradient-to-br ${product.color} p-0.5 hover:border-amber-500 transition`}
      >
        <div className="relative bg-slate-900 rounded-lg p-6 h-full flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
            <p className="text-slate-400 text-sm">{product.description}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-800 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Return Rate</p>
              <p className="text-lg font-bold text-amber-400">{product.returnRate}%</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Duration</p>
              <p className="text-lg font-bold text-blue-400">{product.durationMonths}M</p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Min Investment</p>
              <p className="text-lg font-bold text-green-400">
                {product.minInvestment.toLocaleString()}
              </p>
            </div>
            <div className="bg-slate-800 rounded-lg p-3">
              <p className="text-slate-400 text-xs mb-1">Max Investment</p>
              <p className="text-lg font-bold text-purple-400">
                {product.maxInvestment.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Investment Form */}
          <div className="flex-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Investment Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                placeholder={`Min: ${product.minInvestment}`}
                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Expected Return */}
            {amount && (
              <div className="bg-slate-800 rounded-lg p-3 mb-4">
                <p className="text-slate-400 text-xs mb-1">Expected Return</p>
                <p className="text-lg font-bold text-green-400">
                  +{(parseFloat(amount) * (product.returnRate / 100)).toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            )}

            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

            <button
              onClick={validateAndShowConfirm}
              disabled={isSubmitting || !amount}
              className="w-full py-2 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition"
            >
              {isSubmitting ? 'Processing...' : 'Invest Now'}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-slate-700 max-w-md w-full shadow-2xl flex flex-col max-h-[90vh] sm:max-h-none">
            {/* Header */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-700 flex-shrink-0">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Confirm Investment</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">Please review your investment details</p>
            </div>

            {/* Content - Scrollable */}
            <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-3 sm:space-y-4 overflow-y-auto flex-1">
              <div className="bg-slate-700 rounded-lg p-3 sm:p-4">
                <p className="text-slate-400 text-xs sm:text-sm mb-1">Product</p>
                <p className="text-white font-semibold text-base sm:text-lg">{product.name}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 sm:gap-4">
                <div className="bg-slate-700 rounded-lg p-3 sm:p-4">
                  <p className="text-slate-400 text-xs mb-1">Investment Amount</p>
                  <p className="text-white font-bold text-sm sm:text-lg">
                    {confirmDialog.amount.toLocaleString()}
                  </p>
                </div>

                <div className="bg-slate-700 rounded-lg p-3 sm:p-4">
                  <p className="text-slate-400 text-xs mb-1">Return Rate</p>
                  <p className="text-amber-400 font-bold text-sm sm:text-lg">{product.returnRate}%</p>
                </div>
              </div>

              <div className="bg-green-900 border border-green-700 rounded-lg p-3 sm:p-4">
                <p className="text-green-300 text-xs sm:text-sm mb-1">Expected Return</p>
                <p className="text-green-400 font-bold text-lg sm:text-xl">
                  +{expectedReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="bg-blue-900 border border-blue-700 rounded-lg p-3 sm:p-4">
                <p className="text-blue-300 text-xs sm:text-sm mb-1">Total After Maturity</p>
                <p className="text-blue-400 font-bold text-lg sm:text-xl">
                  {totalAmount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="bg-slate-700 rounded-lg p-3 sm:p-4">
                <p className="text-slate-400 text-xs sm:text-sm mb-1">Duration</p>
                <p className="text-white font-semibold text-sm sm:text-base">
                  {product.durationMonths} months (~{Math.floor(product.durationMonths / 12)} year
                  {Math.floor(product.durationMonths / 12) === 1 ? '' : 's'})
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-700 flex gap-2 sm:gap-3 flex-shrink-0">
              <button
                onClick={() => setConfirmDialog({ isOpen: false, amount: 0 })}
                disabled={isSubmitting}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white font-semibold text-sm sm:text-base rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmInvest}
                disabled={isSubmitting}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm sm:text-base rounded-lg transition"
              >
                {isSubmitting ? 'Processing...' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
