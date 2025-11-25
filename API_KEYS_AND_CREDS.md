# API Keys and Credentials

## Resend Email Service

**Purpose**: Send email notifications for showing requests and other buyer portal communications

**API Key**: `re_ALtaSv9h_BSPb1tqQmGqBkRmZT1pb4dcg`

**Configuration**:
- Environment Variable: `RESEND_API_KEY`
- Location: `.env` file in project root
- From Email: `showings@soldbyyou.com`
- Service URL: https://resend.com

**Usage**:
- Showing request notifications sent to `showings@soldbyyou.com`
- Future: Offer notifications, transaction updates, buyer confirmations

---

## Database

**Type**: SQLite (via Prisma ORM)

**Connection String**: `file:./dev.db`

**Location**: `prisma/dev.db`

**Test User**:
- ID: `user-1`
- Email: `john.doe@example.com`
- Name: `John Doe`
- Phone: `(555) 123-4567`
- Role: `buyer`

---

## Notes

- All API keys are stored in `.env` file which is excluded from git
- `.env.example` file provided as template for new developers
- Resend requires email domain verification before production use
- Current setup uses development mode for testing

---

## Setup Instructions

1. Copy `.env.example` to `.env`
2. Add Resend API key to `RESEND_API_KEY` variable
3. Run `npx prisma migrate dev` to set up database
4. Run `npx prisma db execute --stdin <<< "INSERT OR IGNORE INTO User..."` to seed test user
5. Start dev server with `npm run dev`
