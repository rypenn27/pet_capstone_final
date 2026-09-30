// Rebuilds the database from scratch: drops every table, recreates the schema, and seeds sample data.
const bcrypt = require('bcryptjs');
const { pool, createPet, createUser } = require('./index');
const seedPets = require('./seedPets');

async function dropTables() {
  console.log('Dropping tables...');
  await pool.query(`
    DROP TABLE IF EXISTS order_items, orders, cart_items, payment_methods,
      billing_addresses, pets, users CASCADE;
    -- tables from the original schema
    DROP TABLE IF EXISTS cart, RescueOrders, login CASCADE;
  `);
}

async function buildTables() {
  console.log('Building tables...');
  await pool.query(`
    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      first_name VARCHAR(100) NOT NULL,
      last_name VARCHAR(100) NOT NULL,
      phone VARCHAR(30),
      role TEXT NOT NULL DEFAULT 'user',
      stripe_customer_id TEXT UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE billing_addresses (
      user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
      full_name VARCHAR(200) NOT NULL,
      line1 VARCHAR(255) NOT NULL,
      line2 VARCHAR(255),
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      postal_code VARCHAR(20) NOT NULL,
      country CHAR(2) NOT NULL DEFAULT 'US',
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    -- Card numbers are never stored here; Stripe holds them and we keep its reference
    CREATE TABLE payment_methods (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      stripe_payment_method_id TEXT NOT NULL UNIQUE,
      brand VARCHAR(30) NOT NULL,
      last4 CHAR(4) NOT NULL,
      exp_month INTEGER NOT NULL,
      exp_year INTEGER NOT NULL,
      cardholder_name VARCHAR(200),
      is_default BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE pets (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      breed VARCHAR(255) NOT NULL,
      age INTEGER NOT NULL,
      gender VARCHAR(20) NOT NULL,
      color VARCHAR(100) NOT NULL,
      price NUMERIC(10, 2) NOT NULL CHECK (price >= 500),
      available BOOLEAN NOT NULL DEFAULT true,
      adopted_by INTEGER REFERENCES users(id),
      adopted_at TIMESTAMPTZ
    );

    CREATE TABLE cart_items (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      pet_id INTEGER NOT NULL REFERENCES pets(id) ON DELETE CASCADE,
      added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      UNIQUE (user_id, pet_id)
    );

    CREATE TABLE orders (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id),
      total NUMERIC(10, 2) NOT NULL,
      status TEXT NOT NULL,
      stripe_payment_intent_id TEXT NOT NULL UNIQUE,
      card_brand VARCHAR(30),
      card_last4 CHAR(4),
      billing JSONB NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );

    CREATE TABLE order_items (
      id SERIAL PRIMARY KEY,
      order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      pet_id INTEGER NOT NULL REFERENCES pets(id),
      pet_name VARCHAR(255) NOT NULL,
      breed VARCHAR(255) NOT NULL,
      price NUMERIC(10, 2) NOT NULL
    );
  `);
}

// Breeds with a fixed adoption fee instead of the usual range
const FIXED_FEES = { Yorkie: 10000000 };

// Adoption fees start at $500 and vary slightly by pet ($500 to $650, in $5 steps).
// Deterministic so every rebuild gives each pet the same fee.
function adoptionFee(pet, index) {
  if (FIXED_FEES[pet.breed]) return FIXED_FEES[pet.breed];
  return 500 + ((index * 37 + 11) % 31) * 5;
}

async function createInitialPets() {
  console.log('Creating pets...');
  for (let i = 0; i < seedPets.length; i++) {
    await createPet({ ...seedPets[i], price: adoptionFee(seedPets[i], i) });
  }
}

async function createInitialUsers() {
  console.log('Creating sample users...');
  const passwordHash = await bcrypt.hash('password123', 10);
  const users = [
    { username: 'ExampleUser1', email: 'exampleuser1@yahoo.com', firstName: 'Example', lastName: 'One' },
    { username: 'ExampleUser2', email: 'exampleuser2@yahoo.com', firstName: 'Example', lastName: 'Two' },
    { username: 'Admin', email: 'admin@gmail.com', firstName: 'Site', lastName: 'Admin', role: 'admin' },
  ];
  for (const user of users) {
    await createUser({ ...user, passwordHash });
  }
}

async function rebuildDB() {
  try {
    await dropTables();
    await buildTables();
    await createInitialPets();
    await createInitialUsers();
    const {
      rows: [stats],
    } = await pool.query(
      `SELECT count(*) AS pets, min(price) AS min_price, max(price) AS max_price FROM pets`
    );
    console.log(
      `Done: ${stats.pets} pets ($${stats.min_price} to $${stats.max_price}), 3 sample users (password: password123).`
    );
  } catch (error) {
    console.error('Error rebuilding database:', error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

rebuildDB();
