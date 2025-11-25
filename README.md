# SoldByYou - Buyer Portal

A modern real estate platform featuring a public landing page and buyer dashboard.

## Overview

This is the **buyer-focused side** of SoldByYou, built to complement the existing seller dashboard (hosted separately at `app.soldbyyou.com`).

### What's Included

1. **Landing Page** (`/`)
   - Hero section with dual CTAs ("List Your Home" → external seller app, "Start Your Home Search" → buyer dashboard)
   - Interactive savings calculator comparing $795 flat fee vs. traditional commission
   - Seller vs. Buyer value propositions
   - "How It Works" process overview for both user types
   - FAQ accordion

2. **Buyer Dashboard** (`/buyer/*`)
   - Dashboard home with active transaction summary
   - Search (placeholder)
   - Saved Homes (placeholder)
   - Offers (placeholder)
   - Transactions (placeholder)
   - Documents (placeholder)
   - Profile (placeholder)
   - Help & Support

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 19**

## Getting Started

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the landing page.

Navigate to [http://localhost:3000/buyer](http://localhost:3000/buyer) to view the buyer dashboard.

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
SBYbuyer/
├── app/
│   ├── page.tsx                    # Landing page
│   ├── layout.tsx                  # Root layout
│   └── buyer/                      # Buyer dashboard routes
│       ├── layout.tsx              # Buyer layout with sidebar
│       ├── page.tsx                # Dashboard home
│       ├── search/
│       ├── saved/
│       ├── offers/
│       ├── transactions/
│       ├── documents/
│       ├── profile/
│       └── help/
├── components/
│   ├── landing/                    # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── SavingsCalculator.tsx
│   │   ├── ValueProps.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── FAQ.tsx
│   │   └── Footer.tsx
│   └── buyer/
│       └── Sidebar.tsx             # Buyer dashboard navigation
├── lib/
│   ├── constants.ts                # Config (flat fee, external URLs)
│   ├── types.ts                    # TypeScript interfaces
│   └── mock-data.ts                # Mock listings, offers, transactions
└── public/
    ├── hero-home.webp              # Hero image
    └── sby-logo.png                # Logo
```

## Key Configuration

### External Links

The "List Your Home" button links to the existing seller dashboard:

```typescript
// lib/constants.ts
export const LIST_MY_HOME_URL = "https://app.soldbyyou.com";
```

### Mock Data

The buyer dashboard currently uses mock data for demonstration:

- Sample listings
- Saved homes
- Offers
- Transactions with tasks and documents

See `lib/mock-data.ts` for details.

## Next Steps

### Phase 3: Buyer Dashboard Core Screens (with mock data)
- **Search**: Filters, listing cards, map integration
- **Saved Homes**: Display favorites, add/remove functionality
- **Listing Detail**: Property photos, facts, features, CTAs

### Phase 4: Showing Requests & Offer Builder
- **Showing Requests**: Modal form from listing detail, showing list
- **Offer Builder**: Multi-step form with validation (price, financing, contingencies, closing date)

### Phase 5: Offers & Transactions
- **Offers List & Detail**: Display all offers with status
- **Transactions**: Timeline, task list, document library

### Phase 6: Polish
- Loading states, error states, empty states
- Responsive design improvements
- Accessibility audit

### Phase 7: Backend Integration
- Replace mock data with real API calls
- Authentication (NextAuth or similar)
- Database integration

## Design Notes

- **Colors**: Blue (primary), Green (buyers), Red (traditional comparison)
- **Flat Fee**: $795 (configurable in `lib/constants.ts`)
- **Brand Assets**: Located in `C:\Users\tanne\OneDrive\Desktop\SBYmedia`

## Development Status

✅ **Phase 1**: Discovery & setup - COMPLETE
✅ **Phase 2**: Landing page - COMPLETE
✅ **Phase 3 (partial)**: Buyer dashboard shell - COMPLETE

🚧 **In Progress**: Core buyer dashboard screens with full UX

---

Built with ❤️ for SoldByYou
