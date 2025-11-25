'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { listingProvider } from '@/lib/listing-service';
import type { Listing } from '@/lib/listing-provider';

interface Offer {
  id: string;
  listingId: string;
  offerPrice: number;
  earnestMoney: number;
  financingType: string;
  downPaymentPercent?: number | null;
  preApproved: boolean;
  inspectionContingency: boolean;
  inspectionDays?: number | null;
  appraisalContingency: boolean;
  appraisalDays?: number | null;
  financingContingency: boolean;
  financingDays?: number | null;
  targetClosingDate?: string | null;
  sellerConcessions?: string | null;
  additionalTerms?: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function OfferDetailPage() {
  const params = useParams();
  const router = useRouter();
  const offerId = params.id as string;

  const [offer, setOffer] = useState<Offer | null>(null);
  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (offerId) {
      loadOffer();
    }
  }, [offerId]);

  const loadOffer = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/offers/${offerId}`);
      if (!response.ok) throw new Error('Failed to fetch offer');

      const data = await response.json();
      setOffer(data.offer);

      // Load listing details
      const listingData = await listingProvider.getListingById(data.offer.listingId);
      setListing(listingData);
    } catch (error) {
      console.error('Error loading offer:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitOffer = async () => {
    if (!confirm('Are you sure you want to submit this offer? Once submitted, you cannot edit it.')) {
      return;
    }

    try {
      const response = await fetch(`/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'submitted' }),
      });

      if (!response.ok) throw new Error('Failed to submit offer');

      // Reload offer to get updated status
      await loadOffer();
      alert('Offer submitted successfully!');
    } catch (error) {
      console.error('Error submitting offer:', error);
      alert('Failed to submit offer. Please try again.');
    }
  };

  const handleWithdrawOffer = async () => {
    if (!confirm('Are you sure you want to withdraw this offer? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'withdrawn' }),
      });

      if (!response.ok) throw new Error('Failed to withdraw offer');

      // Reload offer to get updated status
      await loadOffer();
      alert('Offer withdrawn successfully.');
    } catch (error) {
      console.error('Error withdrawing offer:', error);
      alert('Failed to withdraw offer. Please try again.');
    }
  };

  const handleEditOffer = () => {
    router.push(`/buyer/offers/new?listingId=${offer?.listingId}&editOfferId=${offerId}`);
  };

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
      <span className={`px-4 py-2 rounded-full text-sm font-semibold ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#406f77]"></div>
            <p className="text-gray-600 mt-4">Loading offer details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!offer || !listing) {
    return (
      <div className="p-8">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Offer Not Found</h1>
          <p className="text-gray-600 mb-6">This offer could not be found or you don't have access to it.</p>
          <Link href="/buyer/offers" className="text-[#406f77] hover:underline">
            Return to My Offers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link href="/buyer/offers" className="text-[#406f77] hover:underline mb-4 inline-block">
            ← Back to My Offers
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Offer Details</h1>
              <p className="text-gray-600 mt-1">
                Submitted {new Date(offer.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            {getStatusBadge(offer.status)}
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
                ${listing.price.toLocaleString()}
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

        {/* Offer Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Offer Summary</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Price Comparison */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Your Offer Price</div>
              <div className="text-3xl font-bold text-[#406f77]">
                ${offer.offerPrice.toLocaleString()}
              </div>
              {listing.price !== offer.offerPrice && (
                <div className="mt-2 text-sm">
                  {offer.offerPrice < listing.price ? (
                    <span className="text-orange-600 font-medium">
                      ${(listing.price - offer.offerPrice).toLocaleString()} ({(((listing.price - offer.offerPrice) / listing.price) * 100).toFixed(1)}%) below asking
                    </span>
                  ) : (
                    <span className="text-green-600 font-medium">
                      ${(offer.offerPrice - listing.price).toLocaleString()} ({(((offer.offerPrice - listing.price) / listing.price) * 100).toFixed(1)}%) above asking
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Earnest Money */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-sm text-gray-600 mb-2">Earnest Money Deposit</div>
              <div className="text-3xl font-bold text-gray-900">
                ${offer.earnestMoney.toLocaleString()}
              </div>
              <div className="mt-2 text-sm text-gray-600">
                {((offer.earnestMoney / offer.offerPrice) * 100).toFixed(2)}% of offer price
              </div>
            </div>
          </div>
        </div>

        {/* Financing Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Financing Details</h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">Financing Type</div>
              <div className="font-semibold text-gray-900 capitalize text-lg">
                {offer.financingType}
              </div>
            </div>

            {offer.downPaymentPercent && (
              <div>
                <div className="text-sm text-gray-600 mb-1">Down Payment</div>
                <div className="font-semibold text-gray-900 text-lg">
                  {offer.downPaymentPercent}%
                </div>
                <div className="text-sm text-gray-600">
                  ${Math.round((offer.offerPrice * offer.downPaymentPercent) / 100).toLocaleString()}
                </div>
              </div>
            )}

            <div>
              <div className="text-sm text-gray-600 mb-1">Pre-Approval Status</div>
              <div className="flex items-center">
                {offer.preApproved ? (
                  <>
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-semibold text-green-600">Pre-Approved</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <span className="font-semibold text-gray-600">Not Pre-Approved</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contingencies */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Contingencies</h2>

          <div className="space-y-4">
            {/* Inspection */}
            <div className="flex items-start p-4 border border-gray-200 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${offer.inspectionContingency ? 'bg-green-100' : 'bg-gray-100'}`}>
                {offer.inspectionContingency ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Inspection Contingency</div>
                <div className="text-sm text-gray-600 mt-1">
                  {offer.inspectionContingency
                    ? `${offer.inspectionDays} days to complete home inspection`
                    : 'Waived - Buyer is purchasing property as-is'}
                </div>
              </div>
            </div>

            {/* Appraisal */}
            <div className="flex items-start p-4 border border-gray-200 rounded-lg">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${offer.appraisalContingency ? 'bg-green-100' : 'bg-gray-100'}`}>
                {offer.appraisalContingency ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">Appraisal Contingency</div>
                <div className="text-sm text-gray-600 mt-1">
                  {offer.appraisalContingency
                    ? `${offer.appraisalDays} days to complete property appraisal`
                    : 'Waived - Buyer will cover appraisal gap'}
                </div>
              </div>
            </div>

            {/* Financing */}
            {offer.financingType !== 'cash' && (
              <div className="flex items-start p-4 border border-gray-200 rounded-lg">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${offer.financingContingency ? 'bg-green-100' : 'bg-gray-100'}`}>
                  {offer.financingContingency ? (
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Financing Contingency</div>
                  <div className="text-sm text-gray-600 mt-1">
                    {offer.financingContingency
                      ? `${offer.financingDays} days to secure financing approval`
                      : 'Waived - Buyer has guaranteed financing'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Terms & Conditions</h2>

          <div className="space-y-4">
            {offer.targetClosingDate && (
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Target Closing Date</div>
                <div className="text-gray-900">
                  {new Date(offer.targetClosingDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
              </div>
            )}

            {offer.sellerConcessions && (
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Seller Concessions Requested</div>
                <div className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                  {offer.sellerConcessions}
                </div>
              </div>
            )}

            {offer.additionalTerms && (
              <div>
                <div className="text-sm font-medium text-gray-600 mb-1">Additional Terms</div>
                <div className="text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                  {offer.additionalTerms}
                </div>
              </div>
            )}

            {!offer.targetClosingDate && !offer.sellerConcessions && !offer.additionalTerms && (
              <div className="text-gray-500 italic">No additional terms specified</div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
          <div className="flex gap-4">
            {offer.status === 'draft' && (
              <>
                <button
                  onClick={handleSubmitOffer}
                  className="px-6 py-3 bg-[#406f77] text-white rounded-lg font-semibold hover:bg-[#5DD5D9] hover:text-gray-900 transition"
                >
                  Submit Offer
                </button>
                <button
                  onClick={handleEditOffer}
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                >
                  Edit Offer
                </button>
              </>
            )}
            {(offer.status === 'submitted' || offer.status === 'countered') && (
              <button
                onClick={handleWithdrawOffer}
                className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Withdraw Offer
              </button>
            )}
            <Link
              href="/buyer/offers"
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition inline-block"
            >
              Back to All Offers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
