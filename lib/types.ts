// User & Auth
export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: Date;
}

export interface Buyer extends User {
  role: 'buyer';
  preferences?: {
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    locations?: string[];
  };
}

// Listings
export interface ListingSummary {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lotSize?: number;
  yearBuilt?: number;
  images: string[];
  status: 'active' | 'pending' | 'sold';
  listingDate: Date;
}

export interface ListingDetail extends ListingSummary {
  description: string;
  features: string[];
  propertyType: string;
  mlsNumber?: string;
  hoaFees?: number;
  taxes?: number;
  daysOnMarket: number;
  virtualTourUrl?: string;
  documents?: Document[];
}

// Showing Requests
export type ShowingStatus = 'requested' | 'confirmed' | 'completed' | 'cancelled';

export interface ShowingRequest {
  id: string;
  listingId: string;
  buyerId: string;
  listing?: ListingSummary;
  requestedTimes: Date[];
  confirmedTime?: Date;
  status: ShowingStatus;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Offers
export type OfferStatus = 'draft' | 'submitted' | 'countered' | 'accepted' | 'rejected' | 'withdrawn';
export type FinancingType = 'conventional' | 'fha' | 'va' | 'cash' | 'other';

export interface BuyerOffer {
  id: string;
  listingId: string;
  buyerId: string;
  listing?: ListingSummary;

  // Offer terms
  offerPrice: number;
  earnestMoneyDeposit: number;
  financingType: FinancingType;
  preApproved: boolean;

  // Contingencies
  contingencies: {
    inspection: boolean;
    appraisal: boolean;
    financing: boolean;
  };

  // Dates
  inspectionDeadline?: Date;
  financingDeadline?: Date;
  closingDate: Date;

  // Additional terms
  sellerConcessions?: number;
  additionalTerms?: string;

  // Status & tracking
  status: OfferStatus;
  submittedAt?: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Transactions
export type TransactionStatus =
  | 'under_contract'
  | 'inspection'
  | 'financing'
  | 'clear_to_close'
  | 'closed'
  | 'cancelled';

export interface Transaction {
  id: string;
  offerId: string;
  buyerId: string;
  offer?: BuyerOffer;
  listing?: ListingSummary;

  status: TransactionStatus;

  // Timeline dates
  contractDate: Date;
  inspectionDeadline?: Date;
  financingDeadline?: Date;
  closingDate: Date;
  actualClosingDate?: Date;

  // Tasks
  tasks: TransactionTask[];

  // Documents
  documents: Document[];

  createdAt: Date;
  updatedAt: Date;
}

export interface TransactionTask {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  completedAt?: Date;
}

// Documents
export type DocumentType =
  | 'contract'
  | 'addendum'
  | 'disclosure'
  | 'inspection_report'
  | 'appraisal'
  | 'loan_docs'
  | 'settlement_statement'
  | 'other';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  url: string;
  uploadedAt: Date;
  uploadedBy?: string;
  transactionId?: string;
  listingId?: string;
}

// Saved Searches
export interface SavedSearch {
  id: string;
  buyerId: string;
  name: string;
  filters: {
    minPrice?: number;
    maxPrice?: number;
    beds?: number;
    baths?: number;
    locations?: string[];
    propertyTypes?: string[];
  };
  notificationsEnabled: boolean;
  createdAt: Date;
}

// Saved Homes (Favorites)
export interface SavedHome {
  id: string;
  buyerId: string;
  listingId: string;
  listing?: ListingSummary;
  notes?: string;
  savedAt: Date;
}
