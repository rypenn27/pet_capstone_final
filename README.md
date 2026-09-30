# Pet Rescuers

A simulated pet adoption store built like an e-commerce site. Visitors browse adoptable pets, register, save a billing address and a card, add pets to a basket after confirming the adoption fee, and check out with Stripe's sandbox. No real money moves.

Built with React, Express, PostgreSQL and Stripe. It started as a class capstone: an e-commerce site adapted as a pet adoption site, built by a group of 3 using Git for version control.

> **About this version:** this branch is a more complete, AI-assisted version of the original capstone. It was built with [Claude Code](https://claude.com/claude-code), which rewrote the backend and most of the React frontend to finish the store: accounts, billing, Stripe sandbox payments, basket, checkout and order history. The original group project is preserved on the `master` branch.
>
> Status: registration, login, billing, the catalog, the basket and the checkout pages have been tested in a browser. The Stripe card-saving and payment flow is implemented but hasn't yet been tested end to end with sandbox keys.

## Features

- **Accounts:** registration and login (bcrypt-hashed passwords, JWT sessions), editable profile
- **Billing:** billing address saved per user
- **Saved cards:** collected with Stripe Elements and stored on a Stripe customer. The database keeps only Stripe's reference plus brand, last 4 digits and expiry; card numbers never reach the server.
- **Catalog:** 100 pets with adoption fees from $500 to $650 (Yorkies are $10,000,000), searchable by breed, name or color
- **Adopt Me:** a confirmation dialog shows the fee before the pet is added to the basket
- **Basket and checkout:** review pets, pick a saved card, confirm and pay. 3D Secure cards are supported.
- **Orders:** each adoption is recorded with its pets, prices, card and a snapshot of the billing address. Adopted pets leave the catalog and every basket.

## Setup

1. Install [PostgreSQL](https://www.postgresql.org/download/) and Node.js 18 or newer.
2. Create the database:
   ```
   createdb -U postgres pet-adoption
   ```
3. Create `.env` in the project root:
   ```
   DATABASE_URL=postgres://postgres:YOUR_PASSWORD@localhost:5432/pet-adoption
   JWT_SECRET=any-long-random-string
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```
   Get the Stripe keys from the [Stripe dashboard](https://dashboard.stripe.com/test/apikeys) in test mode. Only `sk_test_`/`pk_test_` keys are accepted.
4. Install, build the tables and sample data, and start:
   ```
   npm install
   npm run db:build
   npm start
   ```
5. Open http://localhost:5000.

`npm run db:build` wipes and reseeds the database. Sample logins `ExampleUser1`, `ExampleUser2` and `Admin` use the password `password123`.

For frontend development with hot reload, run `npm run server:dev` and `npm run client:dev` together and open http://localhost:3000.

## Test cards

Use any future expiry date, any CVC and any ZIP code.

| Card number | Result |
|---|---|
| 4242 4242 4242 4242 | Pays successfully |
| 4000 0025 0000 3155 | Asks for 3D Secure authentication |
| 4000 0000 0000 0341 | Saves, but is declined at checkout |

## Database

| Table | Holds |
|---|---|
| `users` | Login, profile and Stripe customer ID |
| `billing_addresses` | One billing address per user |
| `payment_methods` | Saved card references (Stripe ID, brand, last 4, expiry, default flag) |
| `pets` | Catalog, adoption fee, and who adopted each pet |
| `cart_items` | Each user's basket |
| `orders` / `order_items` | Completed adoptions, Stripe payment ID and billing snapshot |

## API

| Method | Path | Purpose |
|---|---|---|
| POST | `/api/register`, `/api/login` | Create an account / log in |
| GET | `/api/pets?search=` | Available pets |
| GET, POST, DELETE | `/api/cart`, `/api/cart/:petId` | Basket |
| GET, PATCH | `/api/account` | Profile, billing address and saved cards |
| PUT | `/api/account/billing` | Save billing address |
| POST | `/api/account/cards/setup-intent`, `/api/account/cards` | Save a card with Stripe |
| PATCH, DELETE | `/api/account/cards/:id/default`, `/api/account/cards/:id` | Manage saved cards |
| POST | `/api/checkout`, `/api/checkout/complete` | Pay for the basket |
| GET | `/api/orders`, `/api/orders/:id` | Order history |
