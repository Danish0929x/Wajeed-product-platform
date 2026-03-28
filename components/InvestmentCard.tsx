'use client';

import { IInvestment } from '@/models/Investment';
import { useState } from 'react';

interface InvestmentCardProps {
  investment: any;
  onWithdraw?: () => void;
}

export default function InvestmentCard({ investment, onWithdraw }: InvestmentCardProps) {
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const maturityDate = new Date(investment.maturityDate);
  const now = new Date();
  const isMatured = maturityDate <= now;
  const daysUntilMaturity = Math.ceil(
    (maturityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleWithdraw = async () => {
    setIsWithdrawing(true);
    try {
      const res = await fetch(`/api/investments/${investment._id}/withdraw`, {
        method: 'POST',
      });

      if (res.ok) {
        onWithdraw?.();
      }
    } catch (error) {
      console.error('Withdraw error:', error);
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getStatusColor = () => {
    if (investment.status === 'withdrawn') return 'bg-slate-700 text-slate-300';
    if (isMatured) return 'bg-amber-900 text-amber-200';
    return 'bg-green-900 text-green-200';
  };

  const getStatusLabel = () => {
    if (investment.status === 'withdrawn') return 'Withdrawn';
    if (isMatured) return 'Matured';
    return 'Active';
  };

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6 hover:border-amber-500 transition">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{investment.productName}</h3>
          <p className="text-slate-400 text-sm">Investment ID: {investment._id.toString().slice(-8)}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>
          {getStatusLabel()}
        </span>
      </div>

      {/* Investment Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <p className="text-slate-400 text-xs mb-1">Investment Amount</p>
          <p className="text-lg font-bold text-white">{investment.amount.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">Expected Return</p>
          <p className="text-lg font-bold text-green-400">+{investment.expectedReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">Return Rate</p>
          <p className="text-lg font-bold text-amber-400">{investment.returnRate}%</p>
        </div>
        <div>
          <p className="text-slate-400 text-xs mb-1">Duration</p>
          <p className="text-lg font-bold text-blue-400">{investment.durationMonths} months</p>
        </div>
      </div>

      {/* Maturity Info */}
      <div className="bg-slate-700 rounded-lg p-4 mb-4">
        <p className="text-slate-400 text-xs mb-2">Maturity Information</p>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-white font-semibold">
              {maturityDate.toLocaleDateString()}
            </p>
            <p className="text-slate-400 text-sm">
              {investment.status === 'withdrawn'
                ? 'Withdrawn on ' + new Date(investment.withdrawnAt).toLocaleDateString()
                : isMatured
                  ? 'Ready to withdraw'
                  : `${daysUntilMaturity} days remaining`}
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      {investment.status !== 'withdrawn' && (
        <button
          onClick={handleWithdraw}
          disabled={!isMatured || isWithdrawing}
          className={`w-full py-2 px-4 font-semibold rounded-lg transition ${
            isMatured
              ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isWithdrawing ? 'Processing...' : isMatured ? 'Withdraw Now' : 'Not Yet Mature'}
        </button>
      )}
    </div>
  );
}
