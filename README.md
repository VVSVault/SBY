# SoldByYou - Buyer Portal

A modern real estate platform featuring a public landing page and comprehensive buyer dashboard with full transaction management capabilities.

**Live Production Site**: [https://sby-production.up.railway.app](https://sby-production.up.railway.app)

## Overview

This is the **buyer-focused side** of SoldByYou, built to complement the existing seller dashboard (hosted separately at `app.soldbyyou.com`).

### What's Included

1. **Landing Page** (`/`)
   - Hero section with video background and dual CTAs
   - Interactive savings calculator comparing $795 flat fee vs. traditional commission
   - Value propositions with animated benefit cards
   - "How It Works" process overview
   - FAQ accordion
   - Professional video content hosted on Cloudflare R2

2. **Buyer Dashboard** (`/buyer/*`)
   - **Dashboard Home**: Quick stats, upcoming showings, active offers preview
   - **Property Search**: Advanced filters, real-time MLS data, map integration
   - **Saved Homes**: Persistent favorites with database storage
   - **Listing Details**: Full property information, photo galleries, showing request forms
   - **Showing Requests**: Schedule and manage property showings with email notifications
   - **Offer Management**: Multi-step offer builder with validation, status tracking, counters
   - **Transactions**: Complete transaction timeline with tasks and document management
   - **Documents**: Upload, view, and organize transaction documents
   - **Profile**: User settings and preferences
   - **Help & Support**: Contact forms, FAQs, and resources

## Tech Stack

- **Next.js 15.1.3** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React 19**
- **Prisma ORM** with PostgreSQL
- **Resend** for email notifications
- **Railway** for hosting
- **Cloudflare R2** for video CDN

## Database Schema

The application uses PostgreSQL with the following main models:

- **User**: User accounts with authentication
- **SavedHome**: Property favorites
- **ShowingRequest**: Scheduled property viewings
- **Offer**: Purchase offers with full details
- **Transaction**: Active transactions under contract
- **Task**: Transaction checklist items
- **Document**: Transaction document storage

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database (or use Railway PostgreSQL)
- Resend API key for email notifications

### Environment Variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://..."
RESEND_API_KEY="re_..."
```

### Install Dependencies

```bash
npm install
```

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Optional: Seed with test data
npx prisma db seed
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
│   ├── page.tsx                          # Landing page
│   ├── layout.tsx                        # Root layout
│   ├── api/                              # API routes
│   │   ├── saved-homes/route.ts          # Saved homes CRUD
│   │   ├── showings/
│   │   │   ├── route.ts                  # Create showing
│   │   │   └── list/route.ts             # List showings
│   │   └── offers/
│   │       ├── route.ts                  # Create/list offers
│   │       └── [id]/route.ts             # Get/update offer
│   └── buyer/                            # Buyer dashboard routes
│       ├── layout.tsx                    # Buyer layout with sidebar
│       ├── page.tsx                      # Dashboard home
│       ├── search/page.tsx               # Property search
│       ├── saved/page.tsx                # Saved homes
│       ├── listings/[id]/page.tsx        # Listing details
│       ├── showings/page.tsx             # Showing requests
│       ├── offers/
│       │   ├── page.tsx                  # Offers list
│       │   ├── [id]/page.tsx             # Offer details
│       │   └── new/page.tsx              # Offer builder
│       ├── transactions/
│       │   ├── page.tsx                  # Transactions list
│       │   └── [id]/page.tsx             # Transaction details
│       ├── documents/page.tsx            # Document management
│       ├── profile/page.tsx              # User profile
│       └── help/page.tsx                 # Help & Support
├── components/
│   ├── landing/                          # Landing page sections
│   │   ├── Hero.tsx                      # Hero with video
│   │   ├── SavingsCalculator.tsx         # Interactive calculator
│   │   ├── ValueProps.tsx                # Benefit cards with video
│   │   ├── HowItWorks.tsx                # Process overview
│   │   ├── FAQ.tsx                       # FAQ accordion
│   │   └── Footer.tsx                    # Footer
│   └── buyer/
│       └── Sidebar.tsx                   # Buyer dashboard navigation
├── lib/
│   ├── constants.ts                      # Config (flat fee, external URLs)
│   ├── types.ts                          # TypeScript interfaces
│   ├── listingProvider.ts                # MLS data integration
│   ├── prisma.ts                         # Prisma client instance
│   └── email.ts                          # Email notification service
├── prisma/
│   ├── schema.prisma                     # Database schema
│   └── migrations/                       # Database migrations
└── public/
    ├── sbybackground.avif                # Hero background
    └── sby-logo-new.png                  # Logo
```

## Key Features

### Property Search
- Real-time MLS data integration
- Advanced filtering (price, beds, baths, property type)
- Map view integration
- Persistent saved homes

### Showing Management
- Request showings directly from listing pages
- Automated email notifications to `showings@soldbyyou.com`
- Track showing status (requested, confirmed, completed, cancelled)
- View upcoming and past showings

### Offer Management
- Multi-step offer builder with validation
- Purchase price, financing details, contingencies
- Earnest money and closing date selection
- Offer status tracking (draft, submitted, countered, accepted, rejected)
- Counter offer support

### Transaction Management
- Complete transaction timeline
- Task checklist with due dates
- Document upload and organization
- Status tracking (under contract, pending, closed)
- Buyer and seller agent coordination

## Production Deployment

### Railway Deployment

The application is deployed on Railway with:
- PostgreSQL database
- Automatic deployments from GitHub
- Environment variables managed through Railway dashboard

**Production URL**: https://sby-production.up.railway.app

### Environment Configuration

Required environment variables in Railway:
- `DATABASE_URL`: PostgreSQL connection string (external URL)
- `RESEND_API_KEY`: API key for email notifications

### CORS Configuration

Videos are hosted on Cloudflare R2 with CORS enabled for the production domain.

## API Routes

### Saved Homes
- `GET /api/saved-homes` - List saved homes for current user
- `POST /api/saved-homes` - Save a home
- `DELETE /api/saved-homes?listingId={id}` - Remove saved home

### Showings
- `POST /api/showings` - Create showing request
- `GET /api/showings/list` - List all showings for user
- `PATCH /api/showings` - Update showing status

### Offers
- `POST /api/offers` - Create new offer
- `GET /api/offers` - List all offers for user
- `GET /api/offers/[id]` - Get offer details
- `PATCH /api/offers/[id]` - Update offer (status, counter)

## Development Status

✅ **Phase 1**: Discovery & setup - COMPLETE
✅ **Phase 2**: Landing page - COMPLETE
✅ **Phase 3**: Buyer dashboard core screens - COMPLETE
✅ **Phase 4**: Showing requests & offer builder - COMPLETE
✅ **Phase 5**: Profile section & help/support - COMPLETE
✅ **Phase 6**: Database integration - COMPLETE
✅ **Phase 7**: Production deployment - COMPLETE

## Test User

Default test user credentials:
- **ID**: `user-1`
- **Email**: `john.doe@example.com`
- **Name**: John Doe
- **Phone**: (555) 123-4567

## External Links

The "List Your Home" button links to the existing seller dashboard:
```typescript
export const LIST_MY_HOME_URL = "https://app.soldbyyou.com";
```

## Design Notes

- **Primary Color**: `#5DD5D9` (Cyan)
- **Accent Color**: `#FFD700` (Gold)
- **Background**: `#738286` (Slate gray)
- **Flat Fee**: $795 (configurable in `lib/constants.ts`)

## Contributing

This is a private project. For questions or support, contact the development team.

---

Built with ❤️ for SoldByYou
