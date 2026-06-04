# FreshRoute 🥦

**Farm-to-Table E-Commerce Platform** — a full-stack web application built with Next.js and Supabase, connecting customers directly with local farms for fresh produce.

## Features

- Browse fresh produce by farm and category
- Shopping cart with real-time updates
- User authentication (sign up / log in)
- Checkout with delivery details
- **Admin dashboard** — manage orders, products, farms, and view analytics
- Role-based access control (admin / customer)
- Responsive UI built with Tailwind CSS v4

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database & Auth:** Supabase (PostgreSQL, Row-Level Security)
- **Styling:** Tailwind CSS v4
- **Charts:** Recharts
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- [Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)

### Local Development

```bash
# Start Supabase locally
supabase start

# Install dependencies
npm install

# Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
app/            # Next.js App Router pages
  admin/        # Admin dashboard (orders, products)
  app/          # Customer-facing pages (cart, checkout, orders)
  api/          # API routes
  login/        # Authentication pages
  signup/
components/     # Reusable UI components
lib/            # Server actions, Supabase clients, types
supabase/       # Migrations, seed data, config
```

## License

MIT
