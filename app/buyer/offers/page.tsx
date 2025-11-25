'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { listingProvider } from '@/lib/listing-service';
import type { Listing } from '@/lib/listing-provider';

interface Offer {
  id: string;
  listingId: string;
  offerPrice: number;
  status: string;
  createdAt: string;
  financingType: string;
  preApproved: boolean;
  listing?: Listing | null;
}

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/offers/list');
      if (!response.ok) throw new Error('Failed to fetch offers');

      const data = await response.json();

      // Load listing details for each offer
      const offersWithListings = await Promise.all(
        data.offers.map(async (offer: Offer) => {
          const listing = await listingProvider.getListingById(offer.listingId);
          return { ...offer, listing };
        })
      );

      setOffers(offersWithListings);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredOffers = offers.filter((offer) => {
    if (filterStatus === 'all') return true;
    return offer.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
      draft: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Draft' },
      submitted: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Submitted' },
      accepted: { bg: 'bg-green-100', text: 'text-green-800', label: 'Accepted' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Rejected' },
      countered: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Countered' },
      withdrawn: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Withdrawn' },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Offers</h1>
            <p className="text-gray-600 mt-1">View and manage all your property offers</p>
          </div>
          <Link
            href="/buyer/search"
            className="px-6 py-3 bg-[#406f77] text-white rounded-lg font-semibold hover:bg-[#5DD5D9] hover:text-gray-900 transition"
          >
            Browse Listings
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {[
              { value: 'all', label: 'All Offers' },
              { value: 'draft', label: 'Drafts' },
              { value: 'submitted', label: 'Submitted' },
              { value: 'accepted', label: 'Accepted' },
              { value: 'countered', label: 'Countered' },
              { value: 'rejected', label: 'Rejected' },
              { value: 'withdrawn', label: 'Withdrawn' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilterStatus(tab.value)}
                className={`px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  filterStatus === tab.value
                    ? 'border-[#406f77] text-[#406f77]'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.label}
                {!isLoading && (
                  <span className="ml-2 text-xs text-gray-500">
                    ({tab.value === 'all' ? offers.length : offers.filter(o => o.status === tab.value).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#406f77]"></div>
            <p className="text-gray-600 mt-4">Loading offers...</p>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredOffers.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {filterStatus === 'all' ? 'No offers yet' : `No ${filterStatus} offers`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filterStatus === 'all'
                ? 'Start making offers on properties you love'
                : `You don't have any ${filterStatus} offers at the moment`}
            </p>
            {filterStatus === 'all' && (
              <Link
                href="/buyer/search"
                className="inline-block px-6 py-3 bg-[#406f77] text-white rounded-lg font-semibold hover:bg-[#5DD5D9] hover:text-gray-900 transition"
              >
                Browse Listings
              </Link>
            )}
          </div>
        )}

        {/* Offers List */}
        {!isLoading && filteredOffers.length > 0 && (
          <div className="space-y-4">
            {filteredOffers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition">
                <Link href={`/buyer/offers/${offer.id}`}>
                  <div className="p-6">
                    <div className="flex gap-6">
                      {/* Listing Image */}
                      {offer.listing && (
                        <div className="w-48 h-32 flex-shrink-0">
                          <img
                            src={offer.listing.photos[0] || '/stockimagehome.jpg'}
                            alt={offer.listing.address}
                            className="w-full h-full object-cover rounded"
                          />
                        </div>
                      )}

                      {/* Offer Details */}
                      <div className="flex-1 min-w-0">
                        {offer.listing && (
                          <div className="mb-3">
                            <div className="text-xl font-bold text-gray-900">
                              {offer.listing.address}
                            </div>
                            <div className="text-sm text-gray-600">
                              {offer.listing.city}, {offer.listing.state} {offer.listing.zip}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {offer.listing.beds} beds • {offer.listing.baths} baths • {offer.listing.sqft?.toLocaleString() || 'N/A'} sqft
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                          <div>
                            <div className="text-xs text-gray-600 mb-1">List Price</div>
                            <div className="font-semibold text-gray-900">
                              ${offer.listing?.price.toLocaleString() || 'N/A'}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Your Offer</div>
                            <div className="font-semibold text-[#406f77] text-lg">
                              ${offer.offerPrice.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Financing</div>
                            <div className="font-semibold text-gray-900 capitalize">
                              {offer.financingType}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600 mb-1">Status</div>
                            {getStatusBadge(offer.status)}
                          </div>
                        </div>

                        <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            Submitted {new Date(offer.createdAt).toLocaleDateString()}
                          </div>
                          {offer.preApproved && (
                            <div className="flex items-center text-green-600">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Pre-Approved
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Arrow Icon */}
                      <div className="flex-shrink-0 self-center">
                        <svg
                          className="w-6 h-6 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
