'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ListingCard from '@/components/buyer/ListingCard';
import { listingProvider } from '@/lib/listing-service';
import type { Listing } from '@/lib/listing-provider';

export default function SavedHomesPage() {
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedListings();
  }, []);

  const loadSavedListings = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/saved-homes');
      if (!response.ok) throw new Error('Failed to fetch saved homes');

      const data = await response.json();

      // Load listing details for each saved home
      const listings = await Promise.all(
        data.savedHomes.map(async (saved: { listingId: string }) => {
          return await listingProvider.getListingById(saved.listingId);
        })
      );

      setSavedListings(listings.filter((l): l is Listing => l !== null));
    } catch (error) {
      console.error('Error loading saved listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsave = async (listingId: string) => {
    try {
      const response = await fetch(`/api/saved-homes?listingId=${listingId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to unsave home');

      // Remove from local state
      setSavedListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (error) {
      console.error('Error unsaving home:', error);
      alert('Failed to unsave home. Please try again.');
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Saved Homes</h1>

        {/* Loading State */}
        {isLoading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                <div className="aspect-video bg-gray-300" />
                <div className="p-4 space-y-3">
                  <div className="h-6 bg-gray-300 rounded w-1/2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && savedListings.length === 0 && (
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Saved Homes Yet</h2>
            <p className="text-gray-600 mb-6">
              Start browsing properties and save your favorites to keep track of homes you love.
            </p>
            <Link
              href="/buyer/search"
              className="inline-block px-6 py-3 bg-[#406f77] text-white rounded-lg hover:bg-[#355c63] transition font-semibold"
            >
              Search Homes
            </Link>
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && savedListings.length > 0 && (
          <>
            <div className="mb-6 text-lg text-gray-700">
              <span className="font-semibold">{savedListings.length}</span>{' '}
              {savedListings.length === 1 ? 'home' : 'homes'} saved
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  listing={listing}
                  onSaveToggle={handleUnsave}
                  isSaved={true}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
