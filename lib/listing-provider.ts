// Listing data types
export interface Listing {
  id: string;
  mlsId?: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft?: number;
  lotSizeSqft?: number;
  yearBuilt?: number;
  photos: string[];
  description?: string;
  latitude?: number;
  longitude?: number;
  status: 'active' | 'under_contract' | 'sold';
  features?: string[];
  propertyType?: string;
  daysOnMarket?: number;
}

export interface ListingSearchParams {
  query?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  minSqft?: number;
  maxSqft?: number;
  city?: string;
  state?: string;
  zip?: string;
}

// Abstract interface - allows swapping providers later
export interface ListingDataProvider {
  searchListings(params: ListingSearchParams): Promise<Listing[]>;
  getListingById(id: string): Promise<Listing | null>;
}

// Mock implementation using in-memory data
export class MockListingProvider implements ListingDataProvider {
  private listings: Listing[];

  constructor(listings: Listing[]) {
    this.listings = listings;
  }

  async searchListings(params: ListingSearchParams): Promise<Listing[]> {
    let results = [...this.listings];

    // Filter by price
    if (params.minPrice !== undefined) {
      results = results.filter((l) => l.price >= params.minPrice!);
    }
    if (params.maxPrice !== undefined) {
      results = results.filter((l) => l.price <= params.maxPrice!);
    }

    // Filter by beds
    if (params.beds !== undefined) {
      results = results.filter((l) => l.beds >= params.beds!);
    }

    // Filter by baths
    if (params.baths !== undefined) {
      results = results.filter((l) => l.baths >= params.baths!);
    }

    // Filter by sqft
    if (params.minSqft !== undefined && params.minSqft > 0) {
      results = results.filter((l) => l.sqft && l.sqft >= params.minSqft!);
    }
    if (params.maxSqft !== undefined && params.maxSqft > 0) {
      results = results.filter((l) => l.sqft && l.sqft <= params.maxSqft!);
    }

    // Filter by city
    if (params.city) {
      results = results.filter(
        (l) => l.city.toLowerCase().includes(params.city!.toLowerCase())
      );
    }

    // Filter by state
    if (params.state) {
      results = results.filter(
        (l) => l.state.toLowerCase() === params.state!.toLowerCase()
      );
    }

    // Filter by zip
    if (params.zip) {
      results = results.filter((l) => l.zip === params.zip);
    }

    // Filter by query (address search)
    if (params.query) {
      const query = params.query.toLowerCase();
      results = results.filter(
        (l) =>
          l.address.toLowerCase().includes(query) ||
          l.city.toLowerCase().includes(query) ||
          l.zip.includes(query)
      );
    }

    return results;
  }

  async getListingById(id: string): Promise<Listing | null> {
    const listing = this.listings.find((l) => l.id === id);
    return listing || null;
  }
}
