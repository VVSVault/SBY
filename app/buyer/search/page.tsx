'use client';

import { useState, useEffect } from 'react';
import SearchFilters from '@/components/buyer/SearchFilters';
import ListingCard from '@/components/buyer/ListingCard';
import { listingProvider } from '@/lib/listing-service';
import type { Listing, ListingSearchParams } from '@/lib/listing-provider';

const ITEMS_PER_PAGE = 12;

export default function SearchPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [filters, setFilters] = useState<ListingSearchParams>({});
  const [isLoading, setIsLoading] = useState(true);
  const [savedListings, setSavedListings] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  // Load listings based on filters
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        const results = await listingProvider.searchListings(filters);
        setListings(results);
        setCurrentPage(1); // Reset to page 1 when filters change
        setShowAll(false); // Reset show all when filters change
      } catch (error) {
        console.error('Error loading listings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadListings();
  }, [filters]);

  // Load saved listings from database
  useEffect(() => {
    const loadSavedListings = async () => {
      try {
        const response = await fetch('/api/saved-homes');
        if (!response.ok) return;

        const data = await response.json();
        const savedIds = new Set<string>(data.savedHomes.map((s: { listingId: string }) => s.listingId));
        setSavedListings(savedIds);
      } catch (error) {
        console.error('Error loading saved listings:', error);
      }
    };

    loadSavedListings();
  }, []);

  const handleFilterChange = (newFilters: ListingSearchParams) => {
    setFilters(newFilters);
  };

  const handleSaveToggle = async (listingId: string) => {
    const isSaved = savedListings.has(listingId);

    try {
      if (isSaved) {
        // Unsave
        const response = await fetch(`/api/saved-homes?listingId=${listingId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to unsave home');

        const newSaved = new Set(savedListings);
        newSaved.delete(listingId);
        setSavedListings(newSaved);
      } else {
        // Save
        const response = await fetch('/api/saved-homes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId }),
        });

        if (!response.ok) throw new Error('Failed to save home');

        const newSaved = new Set(savedListings);
        newSaved.add(listingId);
        setSavedListings(newSaved);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      alert('Failed to update saved home. Please try again.');
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(listings.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedListings = showAll ? listings : listings.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 7;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Homes</h1>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters Sidebar - Sticky */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
              <SearchFilters onFilterChange={handleFilterChange} initialFilters={filters} />
            </div>
          </div>

          {/* Results Grid */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="mb-6 flex items-center justify-between">
              <div className="text-lg text-gray-700">
                {isLoading ? (
                  'Loading...'
                ) : (
                  <>
                    <span className="font-semibold">{listings.length}</span> {listings.length === 1 ? 'home' : 'homes'} found
                    {!showAll && totalPages > 1 && (
                      <span className="text-gray-500 ml-2">
                        (Showing {startIndex + 1}-{Math.min(endIndex, listings.length)})
                      </span>
                    )}
                  </>
                )}
              </div>
              {!isLoading && !showAll && totalPages > 1 && (
                <button
                  onClick={handleShowAll}
                  className="px-6 py-2.5 bg-[#5DD5D9] text-gray-900 rounded-lg hover:bg-[#4dc4c8] font-semibold transition shadow-md"
                >
                  Show All Results
                </button>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
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
            {!isLoading && listings.length === 0 && (
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
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No homes found</h3>
                <p className="text-gray-600">
                  Try adjusting your search filters to find more results.
                </p>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && listings.length > 0 && (
              <>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {paginatedListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      onSaveToggle={handleSaveToggle}
                      isSaved={savedListings.has(listing.id)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {!showAll && totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    {/* Previous Button */}
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        currentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-[#406f77] hover:text-white border border-gray-300'
                      }`}
                    >
                      Previous
                    </button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => typeof page === 'number' && handlePageChange(page)}
                        disabled={page === '...'}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                          page === currentPage
                            ? 'bg-[#406f77] text-white'
                            : page === '...'
                            ? 'bg-transparent text-gray-400 cursor-default'
                            : 'bg-white text-gray-700 hover:bg-[#406f77] hover:text-white border border-gray-300'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-4 py-2 rounded-lg font-medium transition ${
                        currentPage === totalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-white text-gray-700 hover:bg-[#406f77] hover:text-white border border-gray-300'
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
