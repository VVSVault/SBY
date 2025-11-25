import Link from 'next/link';
import type { Listing } from '@/lib/listing-provider';

interface ListingCardProps {
  listing: Listing;
  onSaveToggle?: (listingId: string) => void;
  isSaved?: boolean;
}

export default function ListingCard({ listing, onSaveToggle, isSaved }: ListingCardProps) {
  return (
    <Link
      href={`/buyer/listings/${listing.id}`}
      className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative aspect-video bg-gray-200">
        <img
          src={listing.photos[0] || '/stockimagehome.jpg'}
          alt={listing.address}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-3 right-3">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSaveToggle?.(listing.id);
            }}
            className={`p-2 rounded-full ${
              isSaved
                ? 'bg-red-500 text-white'
                : 'bg-white/90 text-gray-700 hover:bg-white'
            } transition-colors`}
            aria-label={isSaved ? 'Unsave home' : 'Save home'}
          >
            <svg
              className="w-5 h-5"
              fill={isSaved ? 'currentColor' : 'none'}
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
          </button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span className="px-3 py-1 bg-[#5DD5D9] text-gray-900 rounded-full text-sm font-semibold">
            {listing.status === 'active' ? 'Active' : listing.status === 'under_contract' ? 'Pending' : 'Sold'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl font-bold text-gray-900">
            ${listing.price.toLocaleString()}
          </div>
          {listing.daysOnMarket !== undefined && (
            <div className="text-sm text-gray-500">
              {listing.daysOnMarket} {listing.daysOnMarket === 1 ? 'day' : 'days'} on market
            </div>
          )}
        </div>

        <div className="text-gray-700 font-medium mb-1">
          {listing.address}
        </div>
        <div className="text-gray-600 text-sm mb-3">
          {listing.city}, {listing.state} {listing.zip}
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="font-medium">{listing.beds}</span> bed
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="font-medium">{listing.baths}</span> bath
          </div>
          {listing.sqft && (
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
              <span className="font-medium">{listing.sqft.toLocaleString()}</span> sqft
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
