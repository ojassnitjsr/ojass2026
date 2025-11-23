# OJASS Campus Ambassador Portal

This is the Campus Ambassador portal for OJASS 2026, where ambassadors can track their referrals and view their statistics.

## Features

- **User Authentication**: Login using the same credentials as the main OJASS portal
- **Referral Tracking**: View all users who registered using your referral code
- **Statistics Dashboard**: See total referrals, paid/unpaid counts, and earnings
- **Real-time Data**: All data is fetched from the main OJASS API

## Getting Started

### Prerequisites

- Node.js 18+ installed
- The main OJASS portal (`ojass.org`) should be running and accessible

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the root directory:
```bash
# For local development
NEXT_PUBLIC_API_URL=http://localhost:3000

# For production (update with your actual domain)
# NEXT_PUBLIC_API_URL=https://ojass.org
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3001](http://localhost:3001) (or the port shown in terminal) with your browser.

### Configuration

The ambassador portal connects to the main OJASS API. Make sure:

1. **API URL**: Set `NEXT_PUBLIC_API_URL` in `.env.local` to point to your OJASS API
   - Local: `http://localhost:3000`
   - Production: `https://ojass.org`

2. **CORS**: If running on different domains, ensure CORS is configured on the main API to allow requests from the ambassador portal domain.

### Usage

1. **Login**: Use your OJASS account credentials (email/phone and password)
2. **Dashboard**: View your referral statistics and list of referred users
3. **Referral Details**: See payment status and registration details for each referral

## API Endpoints Used

The portal uses the following endpoints from the main OJASS API:

- `POST /api/auth/login` - User authentication
- `GET /api/referral/stats` - Get referral statistics and referred users list

## Project Structure

```
ambassador.ojass.org/
├── src/
│   ├── app/
│   │   ├── dashboard/      # Dashboard page
│   │   ├── login/          # Login page
│   │   └── page.tsx        # Landing page
│   ├── components/          # React components
│   ├── contexts/           # React contexts (Auth)
│   └── lib/
│       └── api.ts          # API client
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Next.js Deployment](https://nextjs.org/docs/app/building-your-application/deploying)
