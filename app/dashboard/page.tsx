'use client';

import Navbar from '@/components/Navbar';
import InvestmentCard from '@/components/InvestmentCard';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [investments, setInvestments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, investmentsRes] = await Promise.all([
          fetch('/api/me'),
          fetch('/api/investments'),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }

        if (investmentsRes.ok) {
          const investmentsData = await investmentsRes.json();
          setInvestments(investmentsData.investments);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleWithdraw = async () => {
    setRefreshing(true);
    const res = await fetch('/api/investments');
    if (res.ok) {
      const data = await res.json();
      setInvestments(data.investments);
    }
    setRefreshing(false);
  };

  const activeInvestments = investments.filter((inv) => inv.status === 'active');
  const maturedInvestments = investments.filter((inv) => inv.status === 'matured');
  const withdrawnInvestments = investments.filter((inv) => inv.status === 'withdrawn');

  const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalExpectedReturn = activeInvestments.reduce((sum, inv) => sum + inv.expectedReturn, 0);
  const totalWithdrawn = withdrawnInvestments.reduce(
    (sum, inv) => sum + inv.amount + inv.expectedReturn,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 rounded-full border-4 border-slate-700 border-t-amber-500 animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name}!</h1>
            <p className="text-slate-400">Manage your investments and track your returns</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6">
              <p className="text-slate-400 text-sm mb-2">Total Invested</p>
              <p className="text-3xl font-bold text-white">{totalInvested.toLocaleString()}</p>
              <p className="text-slate-500 text-xs mt-2">{activeInvestments.length} active</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6">
              <p className="text-slate-400 text-sm mb-2">Expected Returns</p>
              <p className="text-3xl font-bold text-green-400">+{totalExpectedReturn.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-slate-500 text-xs mt-2">Upon maturity</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6">
              <p className="text-slate-400 text-sm mb-2">Matured (Ready)</p>
              <p className="text-3xl font-bold text-amber-400">{maturedInvestments.length}</p>
              <p className="text-slate-500 text-xs mt-2">Available to withdraw</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-slate-700 p-6">
              <p className="text-slate-400 text-sm mb-2">Total Withdrawn</p>
              <p className="text-3xl font-bold text-blue-400">{totalWithdrawn.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
              <p className="text-slate-500 text-xs mt-2">{withdrawnInvestments.length} completed</p>
            </div>
          </div>

          {/* Active Investments */}
          {activeInvestments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Active Investments</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeInvestments.map((investment) => (
                  <InvestmentCard
                    key={investment._id}
                    investment={investment}
                    onWithdraw={handleWithdraw}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Matured Investments */}
          {maturedInvestments.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Ready to Withdraw</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {maturedInvestments.map((investment) => (
                  <InvestmentCard
                    key={investment._id}
                    investment={investment}
                    onWithdraw={handleWithdraw}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Withdrawn Investments */}
          {withdrawnInvestments.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Completed Withdrawals</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {withdrawnInvestments.map((investment) => (
                  <InvestmentCard key={investment._id} investment={investment} />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {investments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-slate-400 mb-4">
                <svg
                  className="w-16 h-16 mx-auto mb-4 opacity-50"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-slate-400 mb-4">You haven't made any investments yet.</p>
              <a
                href="/products"
                className="inline-block px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-semibold rounded-lg transition"
              >
                Explore Products
              </a>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
