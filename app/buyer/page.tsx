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
  status: string;
  cancellationReason?: string;
  showingNotes?: string;
  listing?: Listing | null;
}

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

interface Transaction {
  id: string;
  offerId: string;
  listingId: string;
  status: string;
  closingDate?: string | null;
  offer: {
    id: string;
    offerPrice: number;
  };
  tasks: Array<{
    id: string;
    title: string;
    dueDate?: string | null;
    completed: boolean;
  }>;
  listing?: Listing | null;
}

interface SavedHome {
  id: string;
  listingId: string;
  notes?: string | null;
  savedAt: string;
  listing?: Listing | null;
}

export default function BuyerDashboard() {
  const [savedHomes, setSavedHomes] = useState<SavedHome[]>([]);
  const [isLoadingSaved, setIsLoadingSaved] = useState(true);
  const [upcomingShowings, setUpcomingShowings] = useState<ShowingRequest[]>([]);
  const [upcomingShowingsCount, setUpcomingShowingsCount] = useState(0);
  const [isLoadingShowings, setIsLoadingShowings] = useState(true);
  const [recentOffers, setRecentOffers] = useState<Offer[]>([]);
  const [isLoadingOffers, setIsLoadingOffers] = useState(true);
  const [activeOffersCount, setActiveOffersCount] = useState(0);
  const [activeTransaction, setActiveTransaction] = useState<Transaction | null>(null);
  const [isLoadingTransaction, setIsLoadingTransaction] = useState(true);

  const hasActiveTransaction = activeTransaction !== null;
  const recentSavedHomes = savedHomes.slice(0, 3);

  useEffect(() => {
    loadSavedHomes();
    loadUpcomingShowings();
    loadRecentOffers();
    loadActiveTransaction();
  }, []);

  const loadSavedHomes = async () => {
    setIsLoadingSaved(true);
    try {
      const response = await fetch('/api/saved-homes');
      if (!response.ok) throw new Error('Failed to fetch saved homes');

      const data = await response.json();

      // Load listing details for each saved home
      const savedWithListings = await Promise.all(
        data.savedHomes.map(async (saved: SavedHome) => {
          const listing = await listingProvider.getListingById(saved.listingId);
          return { ...saved, listing };
        })
      );

      setSavedHomes(savedWithListings);
    } catch (error) {
      console.error('Error loading saved homes:', error);
    } finally {
      setIsLoadingSaved(false);
    }
  };

  const loadUpcomingShowings = async () => {
    setIsLoadingShowings(true);
    try {
      const response = await fetch('/api/showings/list');
      if (!response.ok) throw new Error('Failed to fetch showings');

      const data = await response.json();

      // Filter for upcoming showings (requested or confirmed, and in the future)
      const now = new Date();
      now.setHours(0, 0, 0, 0); // Set to start of today for proper date comparison

      const upcomingAll = data.showings.filter((showing: ShowingRequest) => {
        const showingDate = new Date(showing.preferredDate);
        showingDate.setHours(0, 0, 0, 0); // Normalize to start of day
        return (
          (showing.status === 'requested' || showing.status === 'confirmed') &&
          showingDate >= now
        );
      });

      // Store total count
      setUpcomingShowingsCount(upcomingAll.length);

      // Only load details for first 3
      const upcomingToDisplay = upcomingAll.slice(0, 3);

      // Load listing details
      const showingsWithListings = await Promise.all(
        upcomingToDisplay.map(async (showing: ShowingRequest) => {
          const listing = await listingProvider.getListingById(showing.listingId);
          return { ...showing, listing };
        })
      );

      setUpcomingShowings(showingsWithListings);
    } catch (error) {
      console.error('Error loading showings:', error);
    } finally {
      setIsLoadingShowings(false);
    }
  };

  const loadRecentOffers = async () => {
    setIsLoadingOffers(true);
    try {
      const response = await fetch('/api/offers/list');
      if (!response.ok) throw new Error('Failed to fetch offers');

      const data = await response.json();

      console.log('All offers:', data.offers.length);
      console.log('Offers by status:', data.offers.reduce((acc: any, o: Offer) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
      }, {}));

      // Count active offers (submitted, countered, accepted)
      const activeCount = data.offers.filter(
        (o: Offer) => o.status === 'submitted' || o.status === 'countered' || o.status === 'accepted'
      ).length;
      console.log('Active offers count:', activeCount);
      setActiveOffersCount(activeCount);

      // Get 2 most recent offers
      const recent = data.offers.slice(0, 2);

      // Load listing details
      const offersWithListings = await Promise.all(
        recent.map(async (offer: Offer) => {
          const listing = await listingProvider.getListingById(offer.listingId);
          return { ...offer, listing };
        })
      );

      setRecentOffers(offersWithListings);
    } catch (error) {
      console.error('Error loading offers:', error);
    } finally {
      setIsLoadingOffers(false);
    }
  };

  const loadActiveTransaction = async () => {
    setIsLoadingTransaction(true);
    try {
      const response = await fetch('/api/transactions/list');
      if (!response.ok) throw new Error('Failed to fetch transactions');

      const data = await response.json();

      console.log('All transactions:', data.transactions.length);
      console.log('Transactions by status:', data.transactions.map((t: Transaction) => ({
        id: t.id,
        status: t.status
      })));

      // Get most recent active transaction (not closed)
      const active = data.transactions.find(
        (t: Transaction) => t.status !== 'closed'
      );

      console.log('Active transaction found:', active ? 'Yes' : 'No');

      if (active) {
        // Load listing details
        const listing = await listingProvider.getListingById(active.listingId);
        setActiveTransaction({ ...active, listing });
      }
    } catch (error) {
      console.error('Error loading transaction:', error);
    } finally {
      setIsLoadingTransaction(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
          <p className="text-gray-600 mt-1">Here's what's happening with your home search.</p>
        </div>

        {/* Active Transaction or Empty State */}
        {hasActiveTransaction ? (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-green-500">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Active Transaction</h2>
                <p className="text-gray-600 text-sm mt-1">
                  {activeTransaction.listing?.address}, {activeTransaction.listing?.city}
                </p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold">
                {activeTransaction.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-600">Closing Date</div>
                <div className="font-semibold text-gray-900">
                  {activeTransaction.closingDate
                    ? new Date(activeTransaction.closingDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })
                    : 'TBD'}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Offer Price</div>
                <div className="font-semibold text-gray-900">
                  ${activeTransaction.offer?.offerPrice.toLocaleString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">Tasks Remaining</div>
                <div className="font-semibold text-gray-900">
                  {activeTransaction.tasks.filter((t) => !t.completed).length} of {activeTransaction.tasks.length}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-2">Next Steps</h3>
              <ul className="space-y-2">
                {activeTransaction.tasks
                  .filter((t) => !t.completed)
                  .slice(0, 3)
                  .map((task) => (
                    <li key={task.id} className="flex items-start text-sm">
                      <span className="text-gray-400 mr-2">•</span>
                      <div>
                        <span className="text-gray-900 font-medium">{task.title}</span>
                        {task.dueDate && (
                          <span className="text-gray-500 ml-2">
                            (Due: {new Date(task.dueDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })})
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            <Link
              href={`/buyer/transactions/${activeTransaction.id}`}
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              View Transaction Details
            </Link>
          </div>
        ) : (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-8 mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Find Your Dream Home?</h2>
            <p className="text-gray-600 mb-6">
              Start searching for homes, save your favorites, and make offers—all in one place.
            </p>
            <Link
              href="/buyer/search"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              Start Searching
            </Link>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Saved Homes</div>
            <div className="text-3xl font-bold text-gray-900">
              {isLoadingSaved ? '-' : savedHomes.length}
            </div>
            <Link href="/buyer/saved" className="text-[#406f77] text-sm hover:underline mt-2 inline-block">
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Upcoming Showings</div>
            <div className="text-3xl font-bold text-gray-900">
              {isLoadingShowings ? '-' : upcomingShowingsCount}
            </div>
            <Link href="/buyer/showings" className="text-[#406f77] text-sm hover:underline mt-2 inline-block">
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Active Offers</div>
            <div className="text-3xl font-bold text-gray-900">
              {isLoadingOffers ? '-' : activeOffersCount}
            </div>
            <Link href="/buyer/offers" className="text-[#406f77] text-sm hover:underline mt-2 inline-block">
              View all →
            </Link>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-sm text-gray-600 mb-1">Transactions</div>
            <div className="text-3xl font-bold text-gray-900">{hasActiveTransaction ? '1' : '0'}</div>
            <Link href="/buyer/transactions" className="text-[#406f77] text-sm hover:underline mt-2 inline-block">
              View all →
            </Link>
          </div>
        </div>

        {/* Upcoming Showings */}
        {upcomingShowings.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Upcoming Showings</h2>
              <Link href="/buyer/showings" className="text-[#406f77] hover:underline text-sm">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingShowings.map((showing) => (
                <div key={showing.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex items-start gap-4">
                    {showing.listing && (
                      <Link href={`/buyer/listings/${showing.listing.id}`} className="flex-shrink-0">
                        <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden">
                          <img
                            src={showing.listing.photos[0] || '/stockimagehome.jpg'}
                            alt={showing.listing.address}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </Link>
                    )}
                    <div className="flex-1 min-w-0">
                      {showing.listing && (
                        <Link href={`/buyer/listings/${showing.listing.id}`}>
                          <div className="font-bold text-gray-900 hover:text-[#406f77] transition">
                            ${showing.listing.price.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600 truncate">
                            {showing.listing.address}, {showing.listing.city}
                          </div>
                        </Link>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(showing.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                        <div className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 mr-1 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {showing.preferredTime}
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          showing.status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {showing.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Offers */}
        {recentOffers.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Offers</h2>
              <Link href="/buyer/offers" className="text-[#406f77] hover:underline text-sm">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentOffers.map((offer) => (
                <Link key={offer.id} href={`/buyer/offers/${offer.id}`}>
                  <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                    <div className="flex items-start gap-4">
                      {offer.listing && (
                        <div className="w-24 h-24 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                          <img
                            src={offer.listing.photos[0] || '/stockimagehome.jpg'}
                            alt={offer.listing.address}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        {offer.listing && (
                          <div className="mb-2">
                            <div className="font-bold text-gray-900">
                              {offer.listing.address}
                            </div>
                            <div className="text-sm text-gray-600">
                              {offer.listing.city}, {offer.listing.state}
                            </div>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-gray-600">Your Offer</div>
                            <div className="font-semibold text-[#406f77] text-lg">
                              ${offer.offerPrice.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-600">Status</div>
                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                              offer.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                              offer.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                              offer.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              offer.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              offer.status === 'countered' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-600'
                            }`}>
                              {offer.status}
                            </span>
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          Submitted {new Date(offer.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Saved Homes */}
        {recentSavedHomes.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recently Saved</h2>
              <Link href="/buyer/saved" className="text-[#406f77] hover:underline text-sm">
                View all
              </Link>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {recentSavedHomes.map((saved) => (
                <Link
                  key={saved.id}
                  href={`/buyer/listings/${saved.listingId}`}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <div className="aspect-video bg-gray-200 overflow-hidden">
                    {saved.listing && (
                      <img
                        src={saved.listing.photos[0] || '/stockimagehome.jpg'}
                        alt={saved.listing.address}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="font-semibold text-lg text-gray-900">
                      ${saved.listing?.price.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {saved.listing?.address}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {saved.listing?.beds} bd • {saved.listing?.baths} ba • {saved.listing?.sqft?.toLocaleString()} sqft
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
