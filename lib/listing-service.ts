import { MockListingProvider } from './listing-provider';
import { seedListings } from './seed-listings';

// Singleton instance of the listing provider
// In the future, this can be swapped with BridgeMLSProvider or AttomProvider
export const listingProvider = new MockListingProvider(seedListings);
