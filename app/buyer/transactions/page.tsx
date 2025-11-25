'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { listingProvider } from '@/lib/listing-service';
import type { Listing } from '@/lib/listing-provider';

interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: string | null;
  completed: boolean;
  completedAt?: string | null;
  order: number;
}

interface Transaction {
  id: string;
  offerId: string;
  listingId: string;
  status: string;
  closingDate?: string | null;
  createdAt: string;
  updatedAt: string;
  offer: {
    id: string;
    offerPrice: number;
    status: string;
  };
  tasks: Task[];
  listing?: Listing;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/transactions/list');
      if (!response.ok) throw new Error('Failed to fetch transactions');

      const data = await response.json();

      // Load listing details for each transaction
      const transactionsWithListings = await Promise.all(
        data.transactions.map(async (transaction: Transaction) => {
          const listing = await listingProvider.getListingById(transaction.listingId);
          return { ...transaction, listing };
        })
      );

      setTransactions(transactionsWithListings);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      under_contract: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Under Contract' },
      inspection_period: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Inspection Period' },
      financing: { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Financing' },
      clear_to_close: { bg: 'bg-green-100', text: 'text-green-800', label: 'Clear to Close' },
      closed: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Closed' },
    };

    const config = statusConfig[status] || statusConfig.under_contract;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getProgressPercentage = (tasks: Task[]) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#406f77]"></div>
            <p className="text-gray-600 mt-4">Loading your transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Transactions</h1>
          <p className="text-gray-600 mt-2">
            Track your active home purchases and closing progress
          </p>
        </div>

        {/* Transactions Grid */}
        {transactions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Active Transactions</h2>
            <p className="text-gray-600 mb-6">
              Once you have an accepted offer, a transaction will be created to track your progress to closing.
            </p>
            <Link
              href="/buyer/offers"
              className="inline-block px-6 py-3 bg-[#406f77] text-white rounded-lg font-semibold hover:bg-[#5DD5D9] hover:text-gray-900 transition"
            >
              View My Offers
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                <div className="p-6">
                  <div className="flex gap-6">
                    {/* Property Image */}
                    <div className="w-48 h-36 flex-shrink-0">
                      <img
                        src={transaction.listing?.photos[0] || '/stockimagehome.jpg'}
                        alt={transaction.listing?.address}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>

                    {/* Transaction Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">
                            {transaction.listing?.address}
                          </h2>
                          <p className="text-gray-600">
                            {transaction.listing?.city}, {transaction.listing?.state} {transaction.listing?.zip}
                          </p>
                        </div>
                        {getStatusBadge(transaction.status)}
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-gray-600">Offer Price</div>
                          <div className="text-lg font-bold text-gray-900">
                            ${transaction.offer.offerPrice.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Closing Date</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {transaction.closingDate
                              ? new Date(transaction.closingDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })
                              : 'TBD'}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Tasks Completed</div>
                          <div className="text-lg font-semibold text-gray-900">
                            {transaction.tasks.filter((t) => t.completed).length} / {transaction.tasks.length}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-gray-600">Progress</span>
                          <span className="text-sm font-semibold text-gray-900">
                            {getProgressPercentage(transaction.tasks)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-[#406f77] h-2 rounded-full transition-all"
                            style={{ width: `${getProgressPercentage(transaction.tasks)}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Link
                        href={`/buyer/transactions/${transaction.id}`}
                        className="inline-block px-6 py-2 bg-[#406f77] text-white rounded-lg font-semibold hover:bg-[#5DD5D9] hover:text-gray-900 transition"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
