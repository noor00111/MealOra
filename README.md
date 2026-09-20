<div align="center">

# MealOra 🍜

> A full-stack meal delivery platform — real kitchens, real orders, and an AI that knows the menu.

[![Live Site](https://img.shields.io/badge/Live-meal--ora-6C5CE7?style=for-the-badge&logo=vercel&logoColor=green)](https://meal-ora.vercel.app)

</div>

---

<table>
  <tr>
    <td align="center" valign="top" width="50%">
      <sub><b>Explore MealOra</b></sub>
      <br />
      <img src="client/public/images/HOME.png" alt="MealOra home page" width="100%" />
    </td>
    <td align="center" valign="top" width="50%">
      <sub><b>Browse Meals</b></sub>
      <br />
      <img src="client/public/images/MEALS.png" alt="MealOra meals browsing page" width="100%" />
    </td>
  </tr>
  <tr>
    <td align="center" valign="top" width="50%">
      <sub><b>Sign Up</b></sub>
      <br />
      <img src="client/public/images/REG.png" alt="MealOra sign up page" width="100%" />
    </td>
    <td align="center" valign="top" width="50%">
      <sub><b>Admin Dashboard</b></sub>
      <br />
      <img src="client/public/images/ADMIN.png" alt="MealOra admin dashboard" width="100%" />
    </td>
  </tr>
</table>

---

## What it is?

MealOra connects customers with local kitchen providers. Customers browse meals, chat with an AI concierge that reads the live menu, add to cart, and place orders. Providers manage their kitchen, meals, and incoming orders through a dedicated dashboard. Admins oversee the whole platform — users, orders, and categories.

Three roles. One codebase. Everything talks to the same database.

---

## Why it Exists?!

Small and home kitchens rarely get a real storefront. They end up buried in a phone's chat history or a single Instagram post, with no menu page, no order tracking, no way for a stranger to discover them. Customers, meanwhile, default to the big delivery apps not because they prefer them, but because nothing else offers the same one-tap browse → order → track flow for local food.

MealOra closes that gap: providers get a proper dashboard to list meals and manage orders without needing their own website, and customers get a real ordering experience like search, filter, cart, checkout, live status for kitchens that would otherwise have none of it.

- **AI Meal Concierge** — ask what's good instead of scrolling the menu; answers come from the live database, not a hardcoded script.

- **Three-role auth pipeline** — `CUSTOMER`, `PROVIDER`, `ADMIN` each get their own dashboard, guarded on both client and server.

- **Order status pipeline** — `PLACED → PREPARING → READY → DELIVERED`, updated by the provider and tracked live by the customer.

- **Admin dashboard** — revenue and order stats, plus the ability to moderate and suspend accounts.

- **Cloudinary image uploads** — providers add a real kitchen logo and meal photos straight from the dashboard.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js · TypeScript · Tailwind CSS |
| Animation | Framer Motion |
| State | TanStack React Query · Zustand |
| Forms | React Hook Form · Zod |
| Backend | Express.js · TypeScript |
| Database | PostgreSQL (Neon) · Prisma ORM |
| Auth | JWT · bcryptjs |
| AI | Google Gemini |
| Images | Cloudinary |
| Hosting | Vercel (client) · Render (server) |

---

## Project structure

```
MealOra/
├── client/                       # Next.js frontend
│   └── src/
│       ├── app/                  # App Router pages
│       │   ├── (auth)/           # Login, register
│       │   ├── admin/            # Admin: overview, orders, users, categories
│       │   ├── dashboard/        # Role-based dashboard
│       │   ├── meals/            # Meal browse + detail
│       │   ├── providers/        # Public kitchen listing + detail
│       │   ├── provider/         # Provider's own menu + orders dashboard
│       │   ├── cart/, checkout/, orders/, settings/
│       │   └── about/, contact/
│       ├── components/
│       │   ├── shared/           # Navbar, Footer, MealCard, Skeletons, StarRating
│       │   ├── chatbot/          # AI concierge UI (panel, header, messages, input)
│       │   ├── home/             # Hero, Marquee, PromoBanner, FeaturedDeals
│       │   ├── dashboard/        # Customer/provider/admin dashboard pieces
│       │   ├── meals/, provider/ # Domain-specific components
│       │   └── ui/               # shadcn-style primitives (Button, Dialog, Input…)
│       ├── lib/                  # API clients, motion presets, hooks
│       └── types/                # Shared TypeScript types
│
└── server/                       # Express backend
    ├── src/
    │   ├── routes/                # auth, meals, providers, categories, orders,
    │   │                          # provider/meals, provider/orders, admin, reviews, chat
    │   ├── controllers/
    │   ├── middleware/            # requireAuth, requireRole
    │   └── types/                 # AuthRequest, JwtPayload, ChatMessage
    └── prisma/
        └── schema.prisma          # User, ProviderProfile, Category, Meal, Order, OrderItem, Review
```

---

## Local setup

### 1 · Clone

```bash
git clone https://github.com/noor00111/MealOra.git
cd MealOra
```

### 2 · Server

```bash
cd server
npm install
```

Create `server/.env`:

```env
DB_URL="postgresql://USER:PASSWORD@host/dbname?sslmode=require"
PORT=5000
CLIENT_URL="http://localhost:3000"
JWT_SECRET="your-secret"
JWT_EXPIRES_IN="7d"
CHATBOT_API_KEY="your-gemini-api-key"
```

Run migrations and seed:

```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

### 3 · Client

```bash
cd client
npm install
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="your-preset"
```

```bash
npm run dev
```

---

## Getting a Gemini API key

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with a Google account
3. Create a new API key
4. Paste it into `server/.env` as `CHATBOT_API_KEY`

The free tier is enough to run the chatbot in development.

---

## Deployment

The client deploys to **Vercel** with root directory `client`, and the server deploys to **Render** as a web service with root directory `server`.

Server build command: `npm install && npx prisma generate && npm run build`, start command: `npm start`. `CLIENT_URL` on Render must match the deployed Vercel URL exactly (no trailing slash) — the Express CORS config reads it directly and blocks any other origin.

---

## Roles and access

| Role | Can do |
|---|---|
| `CUSTOMER` | Browse meals, chat with AI, cart, checkout, track orders, leave reviews |
| `PROVIDER` | Manage meals, update order status, edit kitchen profile |
| `ADMIN` | View all orders and users, suspend/activate accounts, manage categories |


---

## Key design decisions

- **No mock data in the AI** — The chatbot's system prompt is built from live Prisma queries against meals, providers, and categories on every request, so it always reflects the real menu.

- **Chat runs server-side** — The Gemini integration lives in the Express API (`server/src/controllers/chat.controller.ts`), not a Next.js API route, so it can query the database directly instead of calling back over HTTP.

- **Streaming responses** — The chat endpoint writes chunks to the response as they arrive from Gemini, so text appears progressively instead of after a long wait.
