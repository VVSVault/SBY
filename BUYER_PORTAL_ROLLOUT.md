# Buyer Portal MVP - Rollout Plan

## Overview
Production-quality buyer portal UX built on mock/seeded listing data, designed to plug in real MLS or ATTOM later.

---

## Phase 1: Search & Discovery ✅ COMPLETED

### Deliverables
- **Database Setup**
  - Prisma schema with SQLite
  - Models: Users, SavedHomes, ShowingRequests, Offers, Transactions

- **Data Layer**
  - `ListingDataProvider` interface - clean abstraction for future MLS integration
  - `MockListingProvider` with full search functionality
  - 30 realistic Phoenix-area listings seeded

- **Search Page** (`/buyer/search`)
  - Filter sidebar (sticky on scroll):
    - Price range (min/max)
    - Beds and baths
    - Square footage
    - City selector
    - Text search (address/city/zip)
  - Pagination: 12 homes per page
  - Page numbers (1, 2, 3...) with Previous/Next
  - "Show All Results" button for continuous scrolling
  - Responsive grid layout (2-3 columns)
  - Real-time filtering
  - Loading skeletons
  - Empty state UI
  - Save/unsave functionality

- **Listing Detail Page** (`/buyer/listings/[id]`)
  - Photo gallery with navigation
  - Full property details
  - Features list with checkmarks
  - Property specs grid
  - Sticky sidebar with CTAs:
    - Save home button
    - Request showing link
    - Make offer link
  - Breadcrumb navigation

- **Saved Homes Page** (`/buyer/saved`)
  - Lists all favorited properties
  - Persists via localStorage (temporary)
  - Empty state with CTA to search
  - Unsave functionality

- **UI/UX Polish**
  - Fixed sidebar navigation (always visible)
  - Sticky filter panel on search page
  - Brand colors: #406f77, #5DD5D9, #FFD700
  - Loading states, empty states, error handling
  - Mobile responsive design

---

## Phase 2: Showing Requests ✅ COMPLETED

### Scope
Create a simple showing request system with internal email notifications (no ShowingTime integration).

### Deliverables

#### 1. Showing Request Form
- **Location**: Modal/form from listing detail page
- **Fields**:
  - Preferred date (date picker)
  - Preferred time window (select or time range)
  - Optional notes (textarea)
- **Validation**: Zod schema
  - Date must be in future
  - Time window required
  - Maximum note length

#### 2. Database & API
- **Schema**: Already exists in Prisma (ShowingRequest model)
- **API Route**: `/api/showings/request`
  - POST: Create new showing request
  - Store in database
  - Send email notification to `showings@soldbyyou.com`

#### 3. Email Notifications
- **Provider**: SendGrid or Resend
- **Template**: Internal notification email with:
  - Listing details (address, price, photo)
  - Buyer information (name, email, phone)
  - Requested date/time
  - Notes
  - Link to listing

#### 4. User Dashboard Integration
- **Dashboard Widget**: Show upcoming showings
  - Status badge (requested, confirmed, completed)
  - Date/time display
  - Listing thumbnail
  - Link to listing detail
- **Filter/Sort**: By date, status

#### 5. Showing Management Page (`/buyer/showings`)
- List all showing requests
- Filter by status
- Sort by date
- Cancel showing option
- Empty state

### Technical Implementation
```typescript
// API Route: /api/showings/request
interface ShowingRequestPayload {
  listingId: string;
  preferredDate: string; // ISO date
  preferredTime: string;
  note?: string;
}

// Email notification using SendGrid/Resend
await sendEmail({
  to: 'showings@soldbyyou.com',
  subject: 'New Showing Request',
  template: 'showing-request',
  data: { listing, buyer, request }
});
```

---

## Phase 3: Offer Builder & Management

### Scope
Guided digital offer creation with validation and internal processing (no DocuSign integration yet).

### Deliverables

#### 1. Multi-Step Offer Form (`/buyer/offers/new`)
- **Step 1: Basics**
  - Offer price (validated against listing price)
  - Earnest money deposit amount

- **Step 2: Financing**
  - Financing type: cash, conventional, FHA, VA, other
  - Down payment percentage
  - Pre-approval status (yes/no + upload)

- **Step 3: Contingencies**
  - Inspection contingency (toggle + days)
  - Appraisal contingency (toggle + days)
  - Financing contingency (toggle + days)

- **Step 4: Closing & Terms**
  - Target closing date
  - Seller concessions requested
  - Additional terms (textarea)

- **Step 5: Review & Submit**
  - Full summary of all terms
  - Edit any section
  - Submit button

#### 2. Form Validation
- React Hook Form + Zod schemas
- Real-time validation
- Field-level error messages
- Progress indicator

#### 3. Offers List Page (`/buyer/offers`)
- Table/card view of all offers
- Columns: Property, Price, Status, Date
- Status badges: draft, submitted, accepted, rejected, withdrawn
- Filter by status
- Detail view for each offer

#### 4. Offer Detail Page (`/buyer/offers/[id]`)
- Formatted display of all terms
- Status history/timeline
- Listing information
- Edit draft offers
- Withdraw submitted offers

#### 5. Email Notifications
- Send offer summary to SBY staff
- Confirmation email to buyer

---

## Phase 4: Transaction Management

### Scope
Track accepted offers through closing with task checklist and timeline.

### Deliverables

#### 1. Transaction Creation
- Auto-create when offer status → "accepted"
- Predefined task checklist based on transaction type
- Timeline with key milestone dates

#### 2. Task Checklist System
- **Default Tasks**:
  - Send earnest money (due: 3 days)
  - Schedule home inspection (due: 7-10 days)
  - Submit loan application (due: 5 days)
  - Order appraisal (due: 2 weeks)
  - Secure homeowner insurance (due: before close)
  - Final walkthrough (due: 1 day before close)

- **Task Properties**:
  - Title, description
  - Due date
  - Completed status
  - Optional: attachments, notes

#### 3. Transactions Page (`/buyer/transactions`)
- List active transactions
- Status badges
- Key dates display
- Progress indicators

#### 4. Transaction Detail Page (`/buyer/transactions/[id]`)
- **Timeline View**: Visual progress through stages
- **Task Checklist**: Interactive checklist with mark complete
- **Documents Section**: Links to related documents
- **Listing Info**: Property details
- **Offer Details**: Link to accepted offer

#### 5. Status Progression
- under_contract → inspection_period → financing → clear_to_close → closed
- Status badges with colors
- Automated reminders for upcoming tasks

#### 6. Email Reminders (Optional)
- Daily cron job checks for tasks due within 3 days
- Send reminder emails to buyer

---

## Phase 5: Documents, Profile, Help & Final Polish

### Scope
Complete remaining portal sections and polish UX.

### Deliverables

#### 1. Documents Page (`/buyer/documents`)
- Simple file upload (S3/R2/Supabase)
- List all uploaded documents
- Filter by type: pre-approval, bank statements, ID, contracts, etc.
- Download capability
- Organized by transaction (if applicable)

#### 2. Profile Page (`/buyer/profile`)
- **Personal Information**:
  - Name, email, phone
  - Editable fields

- **Notification Preferences**:
  - Email notifications (on/off)
  - SMS notifications (on/off)
  - Notification types

- **Account Settings**:
  - Password change
  - Delete account (future)

#### 3. Help Page (`/buyer/help`)
- **FAQ Section**: Collapsible Q&A
- **Process Guide**: Step-by-step home buying process
- **Video Tutorials**: Embedded videos
- **Glossary**: Real estate terms
- **Contact Support**: Email/phone

#### 4. Dashboard Improvements (`/buyer`)
- **Quick Stats**: Saved homes, active offers, transactions
- **Recent Activity**: Latest searches, saved homes, offers
- **Action Items**: Tasks due soon, showings scheduled
- **Recommended Homes**: Based on saved searches (future)

#### 5. UX Polish
- Consistent loading states across all pages
- Consistent empty states
- Error boundaries and fallbacks
- Form field focus states
- Keyboard navigation
- Accessibility improvements (ARIA labels)
- Mobile responsiveness refinements

---

## Future Enhancements (Post-MVP)

### API Integrations
- **Bridge Interactive MLS** or **ATTOM Data**: Replace MockListingProvider
- **DocuSign**: Digital signatures for offers/contracts
- **ShowingTime**: Professional showing coordination
- **Plaid**: Financial verification
- **Twilio SMS**: Text notifications

### Advanced Features
- Saved searches with email alerts
- Map view for search results
- Neighborhood insights and school ratings
- Mortgage calculator with real rates
- Virtual tour integration
- Comparison tool for multiple properties
- AI-powered home recommendations
- Live chat support
- Mobile app (React Native)

---

## Technical Stack

### Core
- **Frontend**: Next.js 15 (App Router) + React 19
- **Styling**: Tailwind CSS
- **Database**: SQLite (Prisma ORM)
- **Forms**: React Hook Form + Zod
- **Auth**: NextAuth.js or Clerk (TBD)

### External Services (MVP)
- **Email**: SendGrid or Resend
- **File Storage**: Cloudflare R2 or Supabase Storage
- **SMS** (optional): Twilio

### Brand Colors
- Primary: `#406f77` (teal)
- Accent: `#5DD5D9` (cyan)
- Highlight: `#FFD700` (gold)
- Background: `#738286` (gray)

---

## Development Timeline

- ✅ **Phase 1**: Search & Discovery (2 weeks) - COMPLETED
- ⏳ **Phase 2**: Showing Requests (3-4 days) - IN PROGRESS
- **Phase 3**: Offer Builder (1 week)
- **Phase 4**: Transaction Management (1 week)
- **Phase 5**: Documents, Profile, Help, Polish (1 week)

**Total Estimated Time**: 5-6 weeks for complete MVP

---

## Success Metrics

### MVP Launch Goals
- 30 seeded Phoenix listings searchable
- Users can save homes and track favorites
- Users can request showings (internal notification)
- Users can submit offers digitally (internal processing)
- Users can track transaction progress through closing
- 100% mobile responsive
- Sub-2 second page loads

### Post-Launch Goals
- Integrate real MLS data (Bridge/ATTOM)
- Process 10+ offers per month
- 50+ active users
- 90%+ mobile usage satisfaction
- Add DocuSign integration
- Expand to additional markets beyond Phoenix
