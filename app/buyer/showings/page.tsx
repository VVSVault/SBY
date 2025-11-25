'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { listingProvider } from '@/lib/listing-service';
import type { Listing } from '@/lib/listing-provider';

interface ShowingRequest {
  id: string;
  listingId: string;
  preferredDate: string;
  preferredTime: string;
  note: string;
  status: string;
  cancellationReason?: string;
  showingNotes?: string;
  createdAt: string;
  listing?: Listing | null;
}

export default function ShowingsPage() {
  const [showings, setShowings] = useState<ShowingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState<string>('');

  useEffect(() => {
    loadShowings();
  }, []);

  const loadShowings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/showings/list');
      if (!response.ok) throw new Error('Failed to fetch showings');

      const data = await response.json();

      console.log('Fetched showings:', data.showings);
      data.showings.forEach((s: ShowingRequest) => {
        if (s.status === 'cancelled') {
          console.log('Cancelled showing:', s.id, 'Reason:', s.cancellationReason, 'Type:', typeof s.cancellationReason);
        }
      });

      // Load listing details for each showing
      const showingsWithListings = await Promise.all(
        data.showings.map(async (showing: ShowingRequest) => {
          const listing = await listingProvider.getListingById(showing.listingId);
          return { ...showing, listing };
        })
      );

      setShowings(showingsWithListings);
    } catch (error) {
      console.error('Error loading showings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelShowing = async (showingId: string) => {
    if (!confirm('Are you sure you want to cancel this showing request?')) return;

    try {
      const response = await fetch(`/api/showings/${showingId}/cancel`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to cancel showing');

      // Reload showings
      loadShowings();
    } catch (error) {
      console.error('Error canceling showing:', error);
      alert('Failed to cancel showing request');
    }
  };

  const handleEditNotes = (showing: ShowingRequest) => {
    setEditingNotes(showing.id);
    setNotesText(showing.showingNotes || '');
  };

  const handleSaveNotes = async (showingId: string) => {
    try {
      const response = await fetch(`/api/showings/${showingId}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ showingNotes: notesText }),
      });

      if (!response.ok) throw new Error('Failed to save notes');

      // Reload showings
      await loadShowings();
      setEditingNotes(null);
      setNotesText('');
    } catch (error) {
      console.error('Error saving notes:', error);
      alert('Failed to save showing notes');
    }
  };

  const handleCancelEditNotes = () => {
    setEditingNotes(null);
    setNotesText('');
  };

  const filteredShowings = filterStatus === 'all'
    ? showings
    : showings.filter(s => s.status === filterStatus);

  const getStatusBadge = (status: string) => {
    const badges = {
      requested: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return badges[status as keyof typeof badges] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">My Showings</h1>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2 flex-wrap">
          {['all', 'requested', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === status
                  ? 'bg-[#406f77] text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status === 'all' && ` (${showings.length})`}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-6 bg-gray-300 rounded w-1/3 mb-4" />
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredShowings.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {filterStatus === 'all' ? 'No Showing Requests Yet' : `No ${filterStatus} showings`}
            </h2>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all'
                ? 'Start browsing properties and request a showing to schedule a visit.'
                : `You don't have any ${filterStatus} showing requests.`}
            </p>
            {filterStatus === 'all' && (
              <Link
                href="/buyer/search"
                className="inline-block px-6 py-3 bg-[#406f77] text-white rounded-lg hover:bg-[#355c63] transition font-semibold"
              >
                Search Homes
              </Link>
            )}
          </div>
        )}

        {/* Showings List */}
        {!isLoading && filteredShowings.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {filteredShowings.map((showing) => (
              <div key={showing.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {showing.listing && (
                  <Link href={`/buyer/listings/${showing.listing.id}`} className="block">
                    <div className="aspect-video bg-gray-200">
                      <img
                        src={showing.listing.photos[0] || '/stockimagehome.jpg'}
                        alt={showing.listing.address}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </Link>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      {showing.listing && (
                        <Link
                          href={`/buyer/listings/${showing.listing.id}`}
                          className="text-xl font-bold text-gray-900 hover:text-[#406f77] transition"
                        >
                          ${showing.listing.price.toLocaleString()}
                        </Link>
                      )}
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(showing.status)}`}>
                      {showing.status}
                    </span>
                  </div>

                  {showing.listing && (
                    <div className="text-gray-700 mb-2">
                      {showing.listing.address}
                      <br />
                      {showing.listing.city}, {showing.listing.state} {showing.listing.zip}
                    </div>
                  )}

                  <div className="border-t pt-4 mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="font-semibold text-gray-900">{formatDate(showing.preferredDate)}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-gray-700">{showing.preferredTime}</span>
                    </div>

                    {showing.note && (
                      <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700">
                        <div className="font-semibold mb-1">Notes:</div>
                        {showing.note}
                      </div>
                    )}

                    {(() => {
                      console.log('Rendering showing:', showing.id, 'Status:', showing.status, 'Reason:', showing.cancellationReason);
                      return null;
                    })()}

                    {showing.status === 'cancelled' && showing.cancellationReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded text-sm text-red-700 border border-red-200">
                        <div className="font-semibold mb-1 flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Cancellation Reason:
                        </div>
                        {showing.cancellationReason}
                      </div>
                    )}

                    {showing.status === 'completed' && (
                      <div className="mt-4 pt-4 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-semibold text-gray-900 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-[#406f77]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Your Showing Notes
                          </div>
                          {editingNotes !== showing.id && (
                            <button
                              onClick={() => handleEditNotes(showing)}
                              className="text-sm text-[#406f77] hover:text-[#5DD5D9] font-medium"
                            >
                              {showing.showingNotes ? 'Edit' : 'Add Notes'}
                            </button>
                          )}
                        </div>

                        {editingNotes === showing.id ? (
                          <div>
                            <textarea
                              value={notesText}
                              onChange={(e) => setNotesText(e.target.value)}
                              placeholder="What did you like or dislike about the property? Any important observations?"
                              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                              rows={6}
                              maxLength={2000}
                            />
                            <div className="flex items-center justify-between mt-2">
                              <div className="text-xs text-gray-500">
                                {notesText.length}/2000 characters
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={handleCancelEditNotes}
                                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSaveNotes(showing.id)}
                                  className="px-4 py-2 bg-[#406f77] text-white rounded-lg hover:bg-[#5DD5D9] hover:text-gray-900 transition font-medium"
                                >
                                  Save Notes
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>
                            {showing.showingNotes ? (
                              <div className="p-3 bg-blue-50 rounded text-sm text-gray-700 border border-blue-200 whitespace-pre-wrap">
                                {showing.showingNotes}
                              </div>
                            ) : (
                              <div className="p-3 bg-gray-50 rounded text-sm text-gray-500 italic">
                                No notes yet. Click "Add Notes" to record your thoughts about this property.
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {showing.status === 'requested' && (
                    <div className="mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleCancelShowing(showing.id)}
                        className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition font-medium"
                      >
                        Cancel Request
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
