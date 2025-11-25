'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { listingProvider } from '@/lib/listing-service';
import type { Listing } from '@/lib/listing-provider';
import { STAGE_DEFINITIONS, getStageDefinition, type TransactionStatus } from '@/lib/transaction-stages';

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
    earnestMoney: number;
    financingType: string;
    targetClosingDate?: string | null;
    status: string;
  };
  tasks: Task[];
}

export default function TransactionDetailPage() {
  const params = useParams();
  const transactionId = params.id as string;

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (transactionId) {
      loadTransaction();
    }
  }, [transactionId]);

  const loadTransaction = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/transactions/${transactionId}`);
      if (!response.ok) throw new Error('Failed to fetch transaction');

      const data = await response.json();
      setTransaction(data.transaction);

      // Load listing details
      const listingData = await listingProvider.getListingById(data.transaction.listingId);
      setListing(listingData);
    } catch (error) {
      console.error('Error loading transaction:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) throw new Error('Failed to update task');

      const data = await response.json();

      // Reload transaction to get updated task list and status
      await loadTransaction();

      // Show notification if transaction auto-advanced to next stage
      if (data.advancedToStage) {
        const stageConfig = getStageDefinition(data.advancedToStage as TransactionStatus);
        if (stageConfig) {
          alert(`🎉 All required tasks complete! Advanced to "${stageConfig.label}" stage.`);
        }
      }
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
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
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getProgressPercentage = () => {
    if (!transaction || transaction.tasks.length === 0) return 0;
    const completed = transaction.tasks.filter((t) => t.completed).length;
    return Math.round((completed / transaction.tasks.length) * 100);
  };

  const isTaskOverdue = (task: Task) => {
    if (!task.dueDate || task.completed) return false;
    return new Date(task.dueDate) < new Date();
  };

  const getStageIcon = (iconName: string) => {
    const icons: Record<string, React.ReactElement> = {
      document: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      search: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      dollar: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      'check-circle': (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      checkmark: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    };
    return icons[iconName] || icons.document;
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#406f77]"></div>
            <p className="text-gray-600 mt-4">Loading transaction details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction || !listing) {
    return (
      <div className="p-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Transaction Not Found</h1>
          <p className="text-gray-600 mb-6">This transaction could not be found or you don't have access to it.</p>
          <Link href="/buyer/transactions" className="text-[#406f77] hover:underline">
            Return to My Transactions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/buyer/transactions" className="text-[#406f77] hover:underline mb-4 inline-block">
            ← Back to My Transactions
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Transaction Details</h1>
              <p className="text-gray-600 mt-1">
                Started {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
            {getStatusBadge(transaction.status)}
          </div>
        </div>

        {/* Property Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Property Information</h2>
          <div className="flex gap-6">
            <div className="w-64 h-48 flex-shrink-0">
              <img
                src={listing.photos[0] || '/stockimagehome.jpg'}
                alt={listing.address}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold text-gray-900 mb-2">
                ${transaction.offer.offerPrice.toLocaleString()}
              </div>
              <div className="text-lg text-gray-700 mb-1">{listing.address}</div>
              <div className="text-gray-600 mb-3">
                {listing.city}, {listing.state} {listing.zip}
              </div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Bedrooms</div>
                  <div className="font-semibold text-gray-900">{listing.beds}</div>
                </div>
                <div>
                  <div className="text-gray-600">Bathrooms</div>
                  <div className="font-semibold text-gray-900">{listing.baths}</div>
                </div>
                <div>
                  <div className="text-gray-600">Square Feet</div>
                  <div className="font-semibold text-gray-900">{listing.sqft?.toLocaleString() || 'N/A'}</div>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href={`/buyer/listings/${listing.id}`}
                  className="text-[#406f77] hover:underline text-sm font-medium"
                >
                  View Full Listing →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Transaction Timeline</h2>

          <div className="flex items-start justify-between">
            {STAGE_DEFINITIONS.map((stage, index) => {
              const currentIndex = STAGE_DEFINITIONS.findIndex(s => s.id === transaction.status);
              const isActive = index === currentIndex;
              const isCompleted = index < currentIndex;

              // Count completed tasks for this stage
              const stageTasksCompleted = transaction.tasks.filter(
                task => stage.requiredTaskTitles.includes(task.title) && task.completed
              ).length;
              const stageTasksTotal = stage.requiredTaskTitles.length;

              return (
                <div key={stage.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-all ${
                      isCompleted
                        ? 'bg-[#5DD5D9] text-gray-900'
                        : isActive
                        ? 'bg-[#406f77] text-white ring-4 ring-[#406f77] ring-opacity-20'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {getStageIcon(stage.icon)}
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-sm font-semibold mb-1 ${
                        isCompleted || isActive ? 'text-gray-900' : 'text-gray-500'
                      }`}
                    >
                      {stage.label}
                    </div>
                    {isActive && (
                      <>
                        <div className="text-xs text-[#406f77] font-medium">Current Stage</div>
                        <div className="text-xs text-gray-600 mt-1">
                          {stageTasksCompleted}/{stageTasksTotal} tasks done
                        </div>
                      </>
                    )}
                    {isCompleted && (
                      <div className="text-xs text-gray-600">✓ Completed</div>
                    )}
                    {!isActive && !isCompleted && (
                      <div className="text-xs text-gray-500 mt-1">
                        {stageTasksTotal} tasks
                      </div>
                    )}
                  </div>
                  {index < STAGE_DEFINITIONS.length - 1 && (
                    <div className="hidden md:block absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5">
                      <div className={`h-full ${isCompleted ? 'bg-[#5DD5D9]' : 'bg-gray-200'}`}></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stage Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-gray-700">
              <span className="font-semibold">How it works:</span> Complete the required tasks for each stage to automatically progress through your home purchase journey.
            </div>
          </div>
        </div>

        {/* Key Dates */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Key Dates</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Contract Date</div>
              <div className="font-semibold text-gray-900">
                {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">Target Closing Date</div>
              <div className="font-semibold text-gray-900">
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
              <div className="text-sm text-gray-600 mb-1">Earnest Money</div>
              <div className="font-semibold text-gray-900">
                ${transaction.offer.earnestMoney.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Task Checklist */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Task Checklist</h2>
            <div className="text-sm text-gray-600">
              {transaction.tasks.filter((t) => t.completed).length} of {transaction.tasks.length} completed ({getProgressPercentage()}%)
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-[#406f77] h-3 rounded-full transition-all"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>

          {/* Task List */}
          <div className="space-y-3">
            {transaction.tasks.length === 0 ? (
              <div className="text-gray-500 italic text-center py-8">No tasks assigned yet</div>
            ) : (
              transaction.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`p-4 border-2 rounded-lg transition ${
                    task.completed
                      ? 'border-green-200 bg-green-50'
                      : isTaskOverdue(task)
                      ? 'border-red-200 bg-red-50'
                      : 'border-gray-200 bg-white hover:border-[#406f77]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={(e) => handleToggleTask(task.id, e.target.checked)}
                      className="mt-1 w-5 h-5 text-[#406f77] rounded focus:ring-[#406f77] cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                        {task.title}
                      </div>
                      {task.description && (
                        <div className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                          {task.description}
                        </div>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        {task.dueDate && (
                          <div
                            className={`flex items-center gap-1 ${
                              task.completed
                                ? 'text-gray-400'
                                : isTaskOverdue(task)
                                ? 'text-red-600 font-semibold'
                                : 'text-gray-600'
                            }`}
                          >
                            <span>📅</span>
                            <span>
                              Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </span>
                            {isTaskOverdue(task) && <span className="ml-1">(Overdue)</span>}
                          </div>
                        )}
                        {task.completed && task.completedAt && (
                          <div className="text-green-600 flex items-center gap-1">
                            <span>✓</span>
                            <span>
                              Completed {new Date(task.completedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Related Documents */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Related Information</h2>
          <div className="space-y-3">
            <Link
              href={`/buyer/offers/${transaction.offerId}`}
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-[#406f77] transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">View Accepted Offer</div>
                  <div className="text-sm text-gray-600 mt-1">Review the complete offer details</div>
                </div>
                <span className="text-[#406f77]">→</span>
              </div>
            </Link>
            <Link
              href={`/buyer/listings/${listing.id}`}
              className="block p-4 border-2 border-gray-200 rounded-lg hover:border-[#406f77] transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-semibold text-gray-900">Property Listing</div>
                  <div className="text-sm text-gray-600 mt-1">View full property details and photos</div>
                </div>
                <span className="text-[#406f77]">→</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
