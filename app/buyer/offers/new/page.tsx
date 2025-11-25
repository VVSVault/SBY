'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { listingProvider } from '@/lib/listing-service';
import type { Listing } from '@/lib/listing-provider';
import Link from 'next/link';

// Form validation schema
const offerSchema = z.object({
  // Step 1: Basics
  offerPrice: z.number().min(1000, 'Offer price must be at least $1,000'),
  earnestMoney: z.number().min(0, 'Earnest money cannot be negative'),

  // Step 2: Financing
  financingType: z.enum(['cash', 'conventional', 'fha', 'va', 'other']),
  downPaymentPercent: z.number().min(0).max(100).optional(),
  preApproved: z.boolean(),

  // Step 3: Contingencies
  inspectionContingency: z.boolean(),
  inspectionDays: z.number().min(0).max(30).optional(),
  appraisalContingency: z.boolean(),
  appraisalDays: z.number().min(0).max(30).optional(),
  financingContingency: z.boolean(),
  financingDays: z.number().min(0).max(45).optional(),

  // Step 4: Closing & Terms
  targetClosingDate: z.string().optional(),
  sellerConcessions: z.string().max(500).optional(),
  additionalTerms: z.string().max(1000).optional(),
});

type OfferFormData = z.infer<typeof offerSchema>;

export default function NewOfferPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listingId');
  const editOfferId = searchParams.get('editOfferId');

  const [listing, setListing] = useState<Listing | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isLoadingOffer, setIsLoadingOffer] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<OfferFormData>({
    resolver: zodResolver(offerSchema),
    defaultValues: {
      preApproved: false,
      inspectionContingency: true,
      inspectionDays: 10,
      appraisalContingency: true,
      appraisalDays: 10,
      financingContingency: true,
      financingDays: 21,
      earnestMoney: 5000,
    },
  });

  const formValues = watch();

  useEffect(() => {
    if (listingId) {
      loadListing(listingId);
    }
  }, [listingId]);

  useEffect(() => {
    if (editOfferId) {
      loadExistingOffer(editOfferId);
    }
  }, [editOfferId]);

  // Auto-save draft (debounced)
  useEffect(() => {
    if (!isEditMode || !editOfferId || isLoadingOffer) return;

    const timer = setTimeout(() => {
      saveDraft();
    }, 2000); // Auto-save 2 seconds after user stops typing

    return () => clearTimeout(timer);
  }, [formValues, isEditMode, editOfferId, isLoadingOffer]);

  const saveDraft = async () => {
    if (!editOfferId) return;

    try {
      await fetch(`/api/offers/${editOfferId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formValues,
          targetClosingDate: formValues.targetClosingDate ? new Date(formValues.targetClosingDate).toISOString() : null,
        }),
      });
      // Silent save - no user feedback
    } catch (error) {
      console.error('Error auto-saving draft:', error);
    }
  };

  const loadListing = async (id: string) => {
    const data = await listingProvider.getListingById(id);
    setListing(data);
    if (data && !editOfferId) {
      setValue('offerPrice', data.price);
    }
  };

  const loadExistingOffer = async (offerId: string) => {
    setIsLoadingOffer(true);
    setIsEditMode(true);
    try {
      const response = await fetch(`/api/offers/${offerId}`);
      if (!response.ok) throw new Error('Failed to load offer');

      const data = await response.json();
      const offer = data.offer;

      // Populate form with existing data
      reset({
        offerPrice: offer.offerPrice,
        earnestMoney: offer.earnestMoney,
        financingType: offer.financingType,
        downPaymentPercent: offer.downPaymentPercent || undefined,
        preApproved: offer.preApproved,
        inspectionContingency: offer.inspectionContingency,
        inspectionDays: offer.inspectionDays || undefined,
        appraisalContingency: offer.appraisalContingency,
        appraisalDays: offer.appraisalDays || undefined,
        financingContingency: offer.financingContingency,
        financingDays: offer.financingDays || undefined,
        targetClosingDate: offer.targetClosingDate ? offer.targetClosingDate.split('T')[0] : undefined,
        sellerConcessions: offer.sellerConcessions || undefined,
        additionalTerms: offer.additionalTerms || undefined,
      });
    } catch (error) {
      console.error('Error loading offer:', error);
      alert('Failed to load offer for editing.');
      router.push('/buyer/offers');
    } finally {
      setIsLoadingOffer(false);
    }
  };

  const onSubmit = async (data: OfferFormData) => {
    if (!listingId) return;

    setIsSubmitting(true);
    try {
      if (isEditMode && editOfferId) {
        // Update existing offer
        const response = await fetch(`/api/offers/${editOfferId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            targetClosingDate: data.targetClosingDate ? new Date(data.targetClosingDate).toISOString() : null,
          }),
        });

        if (!response.ok) throw new Error('Failed to update offer');

        const result = await response.json();
        router.push(`/buyer/offers/${result.offer.id}`);
      } else {
        // Create new offer
        const response = await fetch('/api/offers/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...data,
            listingId,
            targetClosingDate: data.targetClosingDate ? new Date(data.targetClosingDate).toISOString() : null,
          }),
        });

        if (!response.ok) throw new Error('Failed to create offer');

        const result = await response.json();
        router.push(`/buyer/offers/${result.offer.id}`);
      }
    } catch (error) {
      console.error('Error saving offer:', error);
      alert(`Failed to ${isEditMode ? 'update' : 'create'} offer. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));
  const goToStep = (step: number) => setCurrentStep(step);

  if (!listingId || !listing) {
    return (
      <div className="p-8">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No Listing Selected</h1>
          <p className="text-gray-600 mb-6">Please select a property to make an offer.</p>
          <Link href="/buyer/search" className="text-[#406f77] hover:underline">
            Return to Search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {isEditMode ? 'Edit Your Offer' : 'Make an Offer'}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? 'Update your offer details' : 'Create your offer for this property'}
          </p>
        </div>

        {/* Listing Info Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <div className="w-32 h-32 flex-shrink-0">
              <img
                src={listing.photos[0] || '/stockimagehome.jpg'}
                alt={listing.address}
                className="w-full h-full object-cover rounded"
              />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">${listing.price.toLocaleString()}</div>
              <div className="text-gray-700 mt-1">{listing.address}</div>
              <div className="text-gray-600">{listing.city}, {listing.state} {listing.zip}</div>
              <div className="mt-2 text-sm text-gray-600">
                {listing.beds} beds • {listing.baths} baths • {listing.sqft?.toLocaleString() || 'N/A'} sqft
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => goToStep(step)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold flex-shrink-0 transition-all cursor-pointer hover:scale-110 ${
                    step === currentStep
                      ? 'bg-[#406f77] text-white'
                      : step < currentStep
                      ? 'bg-[#5DD5D9] text-gray-900 hover:bg-[#4BC5C9]'
                      : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                  }`}
                  title={`Go to step ${step}`}
                >
                  {step}
                </button>
                {step < 5 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step < currentStep ? 'bg-[#5DD5D9]' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <div className="text-xs text-gray-600 text-center" style={{ width: '40px' }}>Basics</div>
            <div className="text-xs text-gray-600 text-center" style={{ width: '40px' }}>Financing</div>
            <div className="text-xs text-gray-600 text-center" style={{ width: '40px' }}>Contingencies</div>
            <div className="text-xs text-gray-600 text-center" style={{ width: '40px' }}>Terms</div>
            <div className="text-xs text-gray-600 text-center" style={{ width: '40px' }}>Review</div>
          </div>
        </div>

        {/* Form Steps */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="bg-white rounded-lg shadow-md p-8 mb-6">
            {/* Step 1: Basics */}
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 1: Basic Information</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Offer Price *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        {...register('offerPrice', { valueAsNumber: true })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900"
                        placeholder="500000"
                      />
                    </div>
                    {errors.offerPrice && (
                      <p className="text-red-600 text-sm mt-1">{errors.offerPrice.message}</p>
                    )}
                    {listing && formValues.offerPrice && (
                      <p className="text-sm text-gray-600 mt-2">
                        {formValues.offerPrice < listing.price
                          ? `${(((listing.price - formValues.offerPrice) / listing.price) * 100).toFixed(1)}% below asking`
                          : formValues.offerPrice > listing.price
                          ? `${(((formValues.offerPrice - listing.price) / listing.price) * 100).toFixed(1)}% above asking`
                          : 'At asking price'}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Earnest Money Deposit *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-500">$</span>
                      <input
                        type="number"
                        {...register('earnestMoney', { valueAsNumber: true })}
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900"
                        placeholder="5000"
                      />
                    </div>
                    {errors.earnestMoney && (
                      <p className="text-red-600 text-sm mt-1">{errors.earnestMoney.message}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-2">
                      Typically 1-3% of offer price (${Math.round((formValues.offerPrice || 0) * 0.01).toLocaleString()} - ${Math.round((formValues.offerPrice || 0) * 0.03).toLocaleString()})
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Financing */}
            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Financing Details</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Financing Type *
                    </label>
                    <select
                      {...register('financingType')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900"
                    >
                      <option value="conventional">Conventional</option>
                      <option value="fha">FHA</option>
                      <option value="va">VA</option>
                      <option value="cash">Cash</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.financingType && (
                      <p className="text-red-600 text-sm mt-1">{errors.financingType.message}</p>
                    )}
                  </div>

                  {formValues.financingType !== 'cash' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Down Payment Percentage
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          {...register('downPaymentPercent', { valueAsNumber: true })}
                          className="w-full pr-8 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900"
                          placeholder="20"
                          min="0"
                          max="100"
                        />
                        <span className="absolute right-3 top-3 text-gray-500">%</span>
                      </div>
                      {formValues.downPaymentPercent && formValues.offerPrice && (
                        <p className="text-sm text-gray-600 mt-2">
                          Down payment: ${Math.round((formValues.offerPrice * formValues.downPaymentPercent) / 100).toLocaleString()}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        {...register('preApproved')}
                        className="w-5 h-5 text-[#406f77] border-gray-300 rounded focus:ring-[#5DD5D9]"
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        I have a pre-approval letter
                      </span>
                    </label>
                    <p className="text-sm text-gray-600 mt-2 ml-8">
                      Pre-approval strengthens your offer significantly
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Contingencies */}
            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Contingencies</h2>

                <div className="space-y-6">
                  {/* Inspection Contingency */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        {...register('inspectionContingency')}
                        className="w-5 h-5 text-[#406f77] border-gray-300 rounded focus:ring-[#5DD5D9]"
                      />
                      <span className="ml-3 text-sm font-semibold text-gray-900">
                        Inspection Contingency
                      </span>
                    </label>
                    {formValues.inspectionContingency && (
                      <div className="ml-8">
                        <label className="block text-sm text-gray-700 mb-2">
                          Number of days to complete inspection
                        </label>
                        <input
                          type="number"
                          {...register('inspectionDays', { valueAsNumber: true })}
                          className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900"
                          placeholder="10"
                          min="0"
                          max="30"
                        />
                        <span className="ml-2 text-sm text-gray-600">days</span>
                      </div>
                    )}
                  </div>

                  {/* Appraisal Contingency */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <label className="flex items-center mb-3">
                      <input
                        type="checkbox"
                        {...register('appraisalContingency')}
                        className="w-5 h-5 text-[#406f77] border-gray-300 rounded focus:ring-[#5DD5D9]"
                      />
                      <span className="ml-3 text-sm font-semibold text-gray-900">
                        Appraisal Contingency
                      </span>
                    </label>
                    {formValues.appraisalContingency && (
                      <div className="ml-8">
                        <label className="block text-sm text-gray-700 mb-2">
                          Number of days to complete appraisal
                        </label>
                        <input
                          type="number"
                          {...register('appraisalDays', { valueAsNumber: true })}
                          className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900"
                          placeholder="10"
                          min="0"
                          max="30"
                        />
                        <span className="ml-2 text-sm text-gray-600">days</span>
                      </div>
                    )}
                  </div>

                  {/* Financing Contingency */}
                  {formValues.financingType !== 'cash' && (
                    <div className="border border-gray-200 rounded-lg p-4">
                      <label className="flex items-center mb-3">
                        <input
                          type="checkbox"
                          {...register('financingContingency')}
                          className="w-5 h-5 text-[#406f77] border-gray-300 rounded focus:ring-[#5DD5D9]"
                        />
                        <span className="ml-3 text-sm font-semibold text-gray-900">
                          Financing Contingency
                        </span>
                      </label>
                      {formValues.financingContingency && (
                        <div className="ml-8">
                          <label className="block text-sm text-gray-700 mb-2">
                            Number of days to secure financing
                          </label>
                          <input
                            type="number"
                            {...register('financingDays', { valueAsNumber: true })}
                            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900"
                            placeholder="21"
                            min="0"
                            max="45"
                          />
                          <span className="ml-2 text-sm text-gray-600">days</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 4: Closing & Terms */}
            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 4: Closing & Terms</h2>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Closing Date
                    </label>
                    <input
                      type="date"
                      {...register('targetClosingDate')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900"
                      min={new Date().toISOString().split('T')[0]}
                    />
                    <p className="text-sm text-gray-600 mt-2">
                      Typically 30-45 days from offer acceptance
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Seller Concessions Requested
                    </label>
                    <textarea
                      {...register('sellerConcessions')}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                      placeholder="e.g., Seller to pay $5,000 towards closing costs"
                      maxLength={500}
                    />
                    {formValues.sellerConcessions && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formValues.sellerConcessions.length}/500 characters
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Terms
                    </label>
                    <textarea
                      {...register('additionalTerms')}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent resize-none text-gray-900 placeholder-gray-400"
                      placeholder="Any other terms or conditions you'd like to include"
                      maxLength={1000}
                    />
                    {formValues.additionalTerms && (
                      <p className="text-sm text-gray-600 mt-1">
                        {formValues.additionalTerms.length}/1000 characters
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Review */}
            {currentStep === 5 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 5: Review Your Offer</h2>

                <div className="space-y-6">
                  {/* Basics */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Offer Price:</span>
                        <div className="font-semibold text-gray-900 text-lg">
                          ${formValues.offerPrice?.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-600">Earnest Money:</span>
                        <div className="font-semibold text-gray-900">
                          ${formValues.earnestMoney?.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Financing */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Financing</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Type:</span>
                        <div className="font-semibold text-gray-900 capitalize">
                          {formValues.financingType}
                        </div>
                      </div>
                      {formValues.downPaymentPercent && (
                        <div>
                          <span className="text-gray-600">Down Payment:</span>
                          <div className="font-semibold text-gray-900">
                            {formValues.downPaymentPercent}% (${Math.round((formValues.offerPrice || 0) * (formValues.downPaymentPercent / 100)).toLocaleString()})
                          </div>
                        </div>
                      )}
                      <div>
                        <span className="text-gray-600">Pre-Approved:</span>
                        <div className="font-semibold text-gray-900">
                          {formValues.preApproved ? 'Yes' : 'No'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Contingencies */}
                  <div className="border-b border-gray-200 pb-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Contingencies</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${formValues.inspectionContingency ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {formValues.inspectionContingency && (
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-900">
                          Inspection: {formValues.inspectionContingency ? `${formValues.inspectionDays} days` : 'Waived'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${formValues.appraisalContingency ? 'bg-green-100' : 'bg-gray-100'}`}>
                          {formValues.appraisalContingency && (
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-900">
                          Appraisal: {formValues.appraisalContingency ? `${formValues.appraisalDays} days` : 'Waived'}
                        </span>
                      </div>
                      {formValues.financingType !== 'cash' && (
                        <div className="flex items-center">
                          <div className={`w-5 h-5 rounded flex items-center justify-center mr-3 ${formValues.financingContingency ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {formValues.financingContingency && (
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </div>
                          <span className="text-gray-900">
                            Financing: {formValues.financingContingency ? `${formValues.financingDays} days` : 'Waived'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Terms */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Terms & Conditions</h3>
                    <div className="space-y-3 text-sm">
                      {formValues.targetClosingDate && (
                        <div>
                          <span className="text-gray-600">Target Closing Date:</span>
                          <div className="font-semibold text-gray-900">
                            {new Date(formValues.targetClosingDate).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </div>
                        </div>
                      )}
                      {formValues.sellerConcessions && (
                        <div>
                          <span className="text-gray-600">Seller Concessions:</span>
                          <div className="text-gray-900 mt-1 whitespace-pre-wrap">
                            {formValues.sellerConcessions}
                          </div>
                        </div>
                      )}
                      {formValues.additionalTerms && (
                        <div>
                          <span className="text-gray-600">Additional Terms:</span>
                          <div className="text-gray-900 mt-1 whitespace-pre-wrap">
                            {formValues.additionalTerms}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-lg font-semibold transition ${
                currentStep === 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Previous
            </button>

            {currentStep < 5 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-[#406f77] text-white rounded-lg font-semibold hover:bg-[#5DD5D9] hover:text-gray-900 transition"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg font-semibold transition ${
                  isSubmitting
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-[#406f77] text-white hover:bg-[#5DD5D9] hover:text-gray-900'
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Offer'}
              </button>
            )}
          </div>
        </form>

        {/* Cancel Link */}
        <div className="text-center mt-6">
          <Link href={`/buyer/listings/${listingId}`} className="text-gray-600 hover:underline">
            Cancel and return to listing
          </Link>
        </div>
      </div>
    </div>
  );
}
