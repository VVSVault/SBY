'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { listingProvider } from '@/lib/listing-service';
import type { Listing } from '@/lib/listing-provider';
import ShowingRequestModal from '@/components/buyer/ShowingRequestModal';

export default function ListingDetailPage() {
  const params = useParams();
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isShowingModalOpen, setIsShowingModalOpen] = useState(false);

  useEffect(() => {
    const loadListing = async () => {
      setIsLoading(true);
      try {
        const id = params.id as string;
        const result = await listingProvider.getListingById(id);
        setListing(result);

        // Check if saved in database
        const response = await fetch('/api/saved-homes');
        if (response.ok) {
          const data = await response.json();
          const savedIds = data.savedHomes.map((s: { listingId: string }) => s.listingId);
          setIsSaved(savedIds.includes(id));
        }
      } catch (error) {
        console.error('Error loading listing:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadListing();
  }, [params.id]);

  const handleSaveToggle = async () => {
    const id = params.id as string;

    try {
      if (isSaved) {
        // Unsave
        const response = await fetch(`/api/saved-homes?listingId=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Failed to unsave home');
        setIsSaved(false);
      } else {
        // Save
        const response = await fetch('/api/saved-homes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ listingId: id }),
        });

        if (!response.ok) {
          const data = await response.json();
          if (data.error === 'Home already saved') {
            setIsSaved(true);
            return;
          }
          throw new Error('Failed to save home');
        }
        setIsSaved(true);
      }
    } catch (error) {
      console.error('Error toggling save:', error);
      alert('Failed to update saved home. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6" />
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <div className="aspect-video bg-gray-300 rounded mb-4" />
              <div className="space-y-3">
                <div className="h-6 bg-gray-300 rounded w-1/3" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Listing Not Found</h2>
            <p className="text-gray-600 mb-6">
              We couldn't find the listing you're looking for.
            </p>
            <Link
              href="/buyer/search"
              className="inline-block px-6 py-3 bg-[#406f77] text-white rounded-lg hover:bg-[#355c63] transition"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/buyer/search" className="text-[#406f77] hover:text-[#5DD5D9] transition">
            ← Back to Search
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="relative aspect-video bg-gray-200">
                <img
                  src={listing.photos[currentImageIndex] || '/stockimagehome.jpg'}
                  alt={`${listing.address} - Photo ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />
                {listing.photos.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === 0 ? listing.photos.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentImageIndex((prev) =>
                          prev === listing.photos.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg transition"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {listing.photos.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition ${
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Home</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{listing.description}</p>

              {listing.features && listing.features.length > 0 && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Features</h3>
                  <ul className="grid md:grid-cols-2 gap-2">
                    {listing.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <svg
                          className="w-5 h-5 text-[#5DD5D9] mr-2 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Property Details</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-600">Property Type</div>
                  <div className="font-semibold text-gray-900">{listing.propertyType}</div>
                </div>
                {listing.yearBuilt && (
                  <div>
                    <div className="text-sm text-gray-600">Year Built</div>
                    <div className="font-semibold text-gray-900">{listing.yearBuilt}</div>
                  </div>
                )}
                {listing.lotSizeSqft && (
                  <div>
                    <div className="text-sm text-gray-600">Lot Size</div>
                    <div className="font-semibold text-gray-900">
                      {listing.lotSizeSqft.toLocaleString()} sqft
                    </div>
                  </div>
                )}
                {listing.daysOnMarket !== undefined && (
                  <div>
                    <div className="text-sm text-gray-600">Days on Market</div>
                    <div className="font-semibold text-gray-900">{listing.daysOnMarket}</div>
                  </div>
                )}
                {listing.mlsId && (
                  <div>
                    <div className="text-sm text-gray-600">MLS #</div>
                    <div className="font-semibold text-gray-900">{listing.mlsId}</div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Key Info and CTAs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <div className="text-3xl font-bold text-gray-900 mb-2">
                ${listing.price.toLocaleString()}
              </div>
              <div className="text-gray-700 mb-4">
                {listing.address}
                <br />
                {listing.city}, {listing.state} {listing.zip}
              </div>

              <div className="flex items-center gap-6 mb-6 pb-6 border-b">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{listing.beds}</div>
                  <div className="text-sm text-gray-600">Beds</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{listing.baths}</div>
                  <div className="text-sm text-gray-600">Baths</div>
                </div>
                {listing.sqft && (
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {listing.sqft.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Sqft</div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleSaveToggle}
                  className={`w-full px-6 py-3 rounded-lg font-semibold transition ${
                    isSaved
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {isSaved ? 'Saved' : 'Save Home'}
                </button>
                <button
                  onClick={() => setIsShowingModalOpen(true)}
                  className="w-full px-6 py-3 bg-[#5DD5D9] text-gray-900 rounded-lg hover:bg-[#4dc4c8] transition font-semibold"
                >
                  Request a Showing
                </button>
                <Link
                  href={`/buyer/offers/new?listingId=${listing.id}`}
                  className="block w-full px-6 py-3 bg-[#406f77] text-white rounded-lg hover:bg-[#355c63] transition text-center font-semibold"
                >
                  Make an Offer
                </Link>
              </div>

              <div className="mt-6 pt-6 border-t text-sm text-gray-600">
                <p>
                  Questions about this property? <br />
                  Call us at{' '}
                  <a href="tel:4802390518" className="text-[#406f77] hover:underline font-semibold">
                    (480) 239-0518
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Showing Request Modal */}
        {listing && (
          <ShowingRequestModal
            isOpen={isShowingModalOpen}
            onClose={() => setIsShowingModalOpen(false)}
            listingId={listing.id}
            listingAddress={`${listing.address}, ${listing.city}, ${listing.state} ${listing.zip}`}
          />
        )}
      </div>
    </div>
  );
}
