'use client';

import { useState } from 'react';
import type { ListingSearchParams } from '@/lib/listing-provider';

interface SearchFiltersProps {
  onFilterChange: (filters: ListingSearchParams) => void;
  initialFilters?: ListingSearchParams;
}

export default function SearchFilters({ onFilterChange, initialFilters = {} }: SearchFiltersProps) {
  const [filters, setFilters] = useState<ListingSearchParams>(initialFilters);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleChange = (key: keyof ListingSearchParams, value: any) => {
    const newFilters = { ...filters, [key]: value === '' ? undefined : value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const emptyFilters: ListingSearchParams = {};
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== undefined && v !== '');

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">Search Filters</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="lg:hidden px-4 py-2 text-sm text-[#406f77] hover:text-[#5DD5D9] transition"
        >
          {isExpanded ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      <div className={`space-y-4 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
        {/* Search Query */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search
          </label>
          <input
            type="text"
            value={filters.query || ''}
            onChange={(e) => handleChange('query', e.target.value)}
            placeholder="Address, city, or ZIP"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900"
          />
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Price
            </label>
            <select
              value={filters.minPrice || ''}
              onChange={(e) => handleChange('minPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">No Min</option>
              <option value="100000">$100,000</option>
              <option value="200000">$200,000</option>
              <option value="300000">$300,000</option>
              <option value="400000">$400,000</option>
              <option value="500000">$500,000</option>
              <option value="600000">$600,000</option>
              <option value="700000">$700,000</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Price
            </label>
            <select
              value={filters.maxPrice || ''}
              onChange={(e) => handleChange('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">No Max</option>
              <option value="200000">$200,000</option>
              <option value="300000">$300,000</option>
              <option value="400000">$400,000</option>
              <option value="500000">$500,000</option>
              <option value="600000">$600,000</option>
              <option value="700000">$700,000</option>
              <option value="800000">$800,000</option>
              <option value="1000000">$1,000,000+</option>
            </select>
          </div>
        </div>

        {/* Beds & Baths */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Beds
            </label>
            <select
              value={filters.beds || ''}
              onChange={(e) => handleChange('beds', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Baths
            </label>
            <select
              value={filters.baths || ''}
              onChange={(e) => handleChange('baths', e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900 bg-white"
            >
              <option value="">Any</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="2.5">2.5+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
            </select>
          </div>
        </div>

        {/* Square Footage */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Sqft
            </label>
            <input
              type="number"
              value={filters.minSqft || ''}
              onChange={(e) => handleChange('minSqft', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Any"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Sqft
            </label>
            <input
              type="number"
              value={filters.maxSqft || ''}
              onChange={(e) => handleChange('maxSqft', e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Any"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900"
            />
          </div>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            value={filters.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#5DD5D9] focus:border-transparent text-gray-900 bg-white"
          >
            <option value="">All Cities</option>
            <option value="Phoenix">Phoenix</option>
            <option value="Scottsdale">Scottsdale</option>
            <option value="Tempe">Tempe</option>
            <option value="Mesa">Mesa</option>
            <option value="Chandler">Chandler</option>
            <option value="Gilbert">Gilbert</option>
            <option value="Glendale">Glendale</option>
            <option value="Peoria">Peoria</option>
            <option value="Surprise">Surprise</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-medium"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </div>
  );
}
