import type {
  ListingSummary,
  ListingDetail,
  BuyerOffer,
  ShowingRequest,
  Transaction,
  SavedHome,
} from './types';

// Mock Listings
export const mockListings: ListingSummary[] = [
  {
    id: '1',
    address: '1234 Oak Street',
    city: 'Portland',
    state: 'OR',
    zip: '97201',
    price: 485000,
    beds: 3,
    baths: 2,
    sqft: 1850,
    lotSize: 5000,
    yearBuilt: 2005,
    images: [
      '/placeholder-home-1.jpg',
      '/placeholder-home-2.jpg',
    ],
    status: 'active',
    listingDate: new Date('2024-11-01'),
  },
  {
    id: '2',
    address: '5678 Maple Avenue',
    city: 'Beaverton',
    state: 'OR',
    zip: '97005',
    price: 625000,
    beds: 4,
    baths: 2.5,
    sqft: 2400,
    lotSize: 7200,
    yearBuilt: 2010,
    images: [
      '/placeholder-home-3.jpg',
    ],
    status: 'active',
    listingDate: new Date('2024-10-28'),
  },
  {
    id: '3',
    address: '910 Pine Lane',
    city: 'Lake Oswego',
    state: 'OR',
    zip: '97034',
    price: 750000,
    beds: 4,
    baths: 3,
    sqft: 2850,
    lotSize: 8500,
    yearBuilt: 2015,
    images: [
      '/placeholder-home-4.jpg',
    ],
    status: 'active',
    listingDate: new Date('2024-11-10'),
  },
];

export const getMockListingById = (id: string): ListingDetail | undefined => {
  const listing = mockListings.find((l) => l.id === id);
  if (!listing) return undefined;

  return {
    ...listing,
    description:
      'Beautiful home in a quiet neighborhood with updated kitchen, hardwood floors, and spacious backyard. Close to schools, parks, and shopping.',
    features: [
      'Updated kitchen with granite countertops',
      'Hardwood floors throughout',
      'Large master suite with walk-in closet',
      'Fenced backyard with patio',
      'Two-car garage',
      'Energy-efficient windows',
    ],
    propertyType: 'Single Family',
    mlsNumber: `MLS${id}23456`,
    hoaFees: 0,
    taxes: listing.price * 0.011,
    daysOnMarket: Math.floor(
      (new Date().getTime() - listing.listingDate.getTime()) / (1000 * 60 * 60 * 24)
    ),
    documents: [],
  };
};

// Mock Saved Homes
export const mockSavedHomes: SavedHome[] = [
  {
    id: 'sh1',
    buyerId: 'buyer1',
    listingId: '1',
    listing: mockListings[0],
    notes: 'Love the location and backyard!',
    savedAt: new Date('2024-11-15'),
  },
  {
    id: 'sh2',
    buyerId: 'buyer1',
    listingId: '2',
    listing: mockListings[1],
    savedAt: new Date('2024-11-18'),
  },
];

// Mock Showing Requests
export const mockShowingRequests: ShowingRequest[] = [
  {
    id: 'sr1',
    listingId: '1',
    buyerId: 'buyer1',
    listing: mockListings[0],
    requestedTimes: [
      new Date('2024-11-25T14:00:00'),
      new Date('2024-11-25T16:00:00'),
    ],
    confirmedTime: new Date('2024-11-25T14:00:00'),
    status: 'confirmed',
    notes: 'Would like to see the backyard and garage.',
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-21'),
  },
];

// Mock Offers
export const mockOffers: BuyerOffer[] = [
  {
    id: 'offer1',
    listingId: '2',
    buyerId: 'buyer1',
    listing: mockListings[1],
    offerPrice: 615000,
    earnestMoneyDeposit: 10000,
    financingType: 'conventional',
    preApproved: true,
    contingencies: {
      inspection: true,
      appraisal: true,
      financing: true,
    },
    inspectionDeadline: new Date('2024-12-05'),
    financingDeadline: new Date('2024-12-15'),
    closingDate: new Date('2025-01-10'),
    sellerConcessions: 5000,
    status: 'submitted',
    submittedAt: new Date('2024-11-22'),
    createdAt: new Date('2024-11-22'),
    updatedAt: new Date('2024-11-22'),
  },
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: 'tx1',
    offerId: 'offer1',
    buyerId: 'buyer1',
    offer: mockOffers[0],
    listing: mockListings[1],
    status: 'under_contract',
    contractDate: new Date('2024-11-23'),
    inspectionDeadline: new Date('2024-12-05'),
    financingDeadline: new Date('2024-12-15'),
    closingDate: new Date('2025-01-10'),
    tasks: [
      {
        id: 't1',
        title: 'Submit earnest money deposit',
        description: 'Wire $10,000 to escrow company',
        dueDate: new Date('2024-11-27'),
        completed: true,
        completedAt: new Date('2024-11-26'),
      },
      {
        id: 't2',
        title: 'Schedule home inspection',
        description: 'Book inspector for property evaluation',
        dueDate: new Date('2024-12-03'),
        completed: false,
      },
      {
        id: 't3',
        title: 'Submit loan application',
        description: 'Complete application with lender',
        dueDate: new Date('2024-12-01'),
        completed: false,
      },
      {
        id: 't4',
        title: 'Secure homeowner insurance',
        description: 'Get insurance policy in place',
        dueDate: new Date('2024-12-20'),
        completed: false,
      },
    ],
    documents: [
      {
        id: 'd1',
        name: 'Purchase Agreement',
        type: 'contract',
        url: '/docs/purchase-agreement.pdf',
        uploadedAt: new Date('2024-11-23'),
        transactionId: 'tx1',
      },
      {
        id: 'd2',
        name: 'Seller Disclosures',
        type: 'disclosure',
        url: '/docs/disclosures.pdf',
        uploadedAt: new Date('2024-11-23'),
        transactionId: 'tx1',
      },
    ],
    createdAt: new Date('2024-11-23'),
    updatedAt: new Date('2024-11-26'),
  },
];
