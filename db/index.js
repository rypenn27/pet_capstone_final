// Connect to DB
const { Pool } = require('pg');
require('dotenv').config();
const { KEY, USER } = process.env;

const DB_NAME = 'pet-adoption';
const DB_URL =
  process.env.DATABASE_URL ||
  `postgres://${USER}:${KEY}@localhost:5432/${DB_NAME}`;

const pool = new Pool({ connectionString: DB_URL });

// Runs fn inside a transaction on a dedicated connection
async function withTransaction(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
}

// Strips the password hash before a user leaves the server
function publicUser(user) {
  if (!user) return null;
  const { password_hash, ...rest } = user;
  return rest;
}

/////////////////////////// Users ///////////////////////////

async function createUser({
  username,
  email,
  passwordHash,
  firstName,
  lastName,
  phone,
  role = 'user',
}) {
  const {
    rows: [user],
  } = await pool.query(
    `INSERT INTO users(username, email, password_hash, first_name, last_name, phone, role)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [username, email.toLowerCase(), passwordHash, firstName, lastName, phone || null, role]
  );
  return user;
}

async function getUserById(id) {
  const {
    rows: [user],
  } = await pool.query(`SELECT * FROM users WHERE id = $1`, [id]);
  return user || null;
}

async function getUserByUsernameOrEmail(login) {
  const {
    rows: [user],
  } = await pool.query(
    `SELECT * FROM users WHERE lower(username) = lower($1) OR email = lower($1)`,
    [login]
  );
  return user || null;
}

async function updateUserProfile(id, { firstName, lastName, phone, email }) {
  const {
    rows: [user],
  } = await pool.query(
    `UPDATE users
     SET first_name = $2, last_name = $3, phone = $4, email = lower($5)
     WHERE id = $1
     RETURNING *`,
    [id, firstName, lastName, phone || null, email]
  );
  return user;
}

async function setStripeCustomerId(id, customerId) {
  await pool.query(`UPDATE users SET stripe_customer_id = $2 WHERE id = $1`, [
    id,
    customerId,
  ]);
}

/////////////////////////// Billing ///////////////////////////

async function getBillingAddress(userId) {
  const {
    rows: [address],
  } = await pool.query(`SELECT * FROM billing_addresses WHERE user_id = $1`, [
    userId,
  ]);
  return address || null;
}

async function upsertBillingAddress(
  userId,
  { fullName, line1, line2, city, state, postalCode, country }
) {
  const {
    rows: [address],
  } = await pool.query(
    `INSERT INTO billing_addresses(user_id, full_name, line1, line2, city, state, postal_code, country)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     ON CONFLICT (user_id) DO UPDATE SET
       full_name = EXCLUDED.full_name, line1 = EXCLUDED.line1, line2 = EXCLUDED.line2,
       city = EXCLUDED.city, state = EXCLUDED.state, postal_code = EXCLUDED.postal_code,
       country = EXCLUDED.country, updated_at = now()
     RETURNING *`,
    [userId, fullName, line1, line2 || null, city, state, postalCode, country || 'US']
  );
  return address;
}

/////////////////////////// Payment methods ///////////////////////////
// Only Stripe's reference and display details are stored; card numbers stay with Stripe.

async function getPaymentMethods(userId) {
  const { rows } = await pool.query(
    `SELECT * FROM payment_methods WHERE user_id = $1 ORDER BY is_default DESC, created_at`,
    [userId]
  );
  return rows;
}

async function getPaymentMethod(userId, id) {
  const {
    rows: [pm],
  } = await pool.query(
    `SELECT * FROM payment_methods WHERE user_id = $1 AND id = $2`,
    [userId, id]
  );
  return pm || null;
}

async function addPaymentMethod(
  userId,
  { stripePaymentMethodId, brand, last4, expMonth, expYear, cardholderName }
) {
  return withTransaction(async (client) => {
    const {
      rows: [{ count }],
    } = await client.query(
      `SELECT count(*)::int AS count FROM payment_methods WHERE user_id = $1`,
      [userId]
    );
    const {
      rows: [pm],
    } = await client.query(
      `INSERT INTO payment_methods(user_id, stripe_payment_method_id, brand, last4, exp_month, exp_year, cardholder_name, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (stripe_payment_method_id) DO NOTHING
       RETURNING *`,
      [userId, stripePaymentMethodId, brand, last4, expMonth, expYear, cardholderName || null, count === 0]
    );
    return pm;
  });
}

async function setDefaultPaymentMethod(userId, id) {
  return withTransaction(async (client) => {
    await client.query(
      `UPDATE payment_methods SET is_default = (id = $2) WHERE user_id = $1`,
      [userId, id]
    );
  });
}

async function deletePaymentMethod(userId, id) {
  return withTransaction(async (client) => {
    const {
      rows: [pm],
    } = await client.query(
      `DELETE FROM payment_methods WHERE user_id = $1 AND id = $2 RETURNING *`,
      [userId, id]
    );
    // Promote another card when the default is removed
    if (pm && pm.is_default) {
      await client.query(
        `UPDATE payment_methods SET is_default = true
         WHERE id = (SELECT id FROM payment_methods WHERE user_id = $1 ORDER BY created_at LIMIT 1)`,
        [userId]
      );
    }
    return pm || null;
  });
}

/////////////////////////// Pets ///////////////////////////

async function createPet({ name, breed, age, gender, color, price }) {
  const {
    rows: [pet],
  } = await pool.query(
    `INSERT INTO pets(name, breed, age, gender, color, price)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [name, breed, age, gender, color, price]
  );
  return pet;
}

async function getPets({ search } = {}) {
  const params = [];
  let where = 'WHERE available';
  if (search) {
    params.push(`%${search}%`);
    where += ` AND (breed ILIKE $1 OR name ILIKE $1 OR color ILIKE $1)`;
  }
  const { rows } = await pool.query(
    `SELECT id, name, breed, age, gender, color, price, available FROM pets ${where} ORDER BY id`,
    params
  );
  return rows;
}

async function getPetById(id) {
  const {
    rows: [pet],
  } = await pool.query(
    `SELECT id, name, breed, age, gender, color, price, available FROM pets WHERE id = $1`,
    [id]
  );
  return pet || null;
}

/////////////////////////// Basket ///////////////////////////

async function getCart(userId) {
  const { rows } = await pool.query(
    `SELECT p.id, p.name, p.breed, p.age, p.gender, p.color, p.price, p.available, c.added_at
     FROM cart_items c JOIN pets p ON p.id = c.pet_id
     WHERE c.user_id = $1
     ORDER BY c.added_at`,
    [userId]
  );
  const total = rows
    .filter((pet) => pet.available)
    .reduce((sum, pet) => sum + Number(pet.price), 0);
  return { items: rows, total: total.toFixed(2) };
}

async function addToCart(userId, petId) {
  await pool.query(
    `INSERT INTO cart_items(user_id, pet_id) VALUES ($1, $2)
     ON CONFLICT (user_id, pet_id) DO NOTHING`,
    [userId, petId]
  );
  return getCart(userId);
}

async function removeFromCart(userId, petId) {
  await pool.query(`DELETE FROM cart_items WHERE user_id = $1 AND pet_id = $2`, [
    userId,
    petId,
  ]);
  return getCart(userId);
}

/////////////////////////// Orders ///////////////////////////

async function getOrderByPaymentIntent(paymentIntentId) {
  const {
    rows: [order],
  } = await pool.query(
    `SELECT id FROM orders WHERE stripe_payment_intent_id = $1`,
    [paymentIntentId]
  );
  return order ? getOrder(null, order.id) : null;
}

// Marks the pets adopted and records the order in one transaction.
// Returns null (and changes nothing) if any pet was adopted by someone else first.
async function createOrder({
  userId,
  petIds,
  total,
  paymentIntentId,
  card,
  billing,
}) {
  return withTransaction(async (client) => {
    const { rows: pets } = await client.query(
      `UPDATE pets SET available = false, adopted_by = $1, adopted_at = now()
       WHERE id = ANY($2::int[]) AND available
       RETURNING id, name, breed, price`,
      [userId, petIds]
    );
    if (pets.length !== petIds.length) {
      throw Object.assign(new Error('Pet no longer available'), {
        code: 'PET_UNAVAILABLE',
      });
    }
    const {
      rows: [order],
    } = await client.query(
      `INSERT INTO orders(user_id, total, status, stripe_payment_intent_id, card_brand, card_last4, billing)
       VALUES ($1, $2, 'paid', $3, $4, $5, $6)
       RETURNING *`,
      [userId, total, paymentIntentId, card.brand, card.last4, billing]
    );
    for (const pet of pets) {
      await client.query(
        `INSERT INTO order_items(order_id, pet_id, pet_name, breed, price)
         VALUES ($1, $2, $3, $4, $5)`,
        [order.id, pet.id, pet.name, pet.breed, pet.price]
      );
    }
    // Adopted pets leave every basket, not just the buyer's
    await client.query(`DELETE FROM cart_items WHERE pet_id = ANY($1::int[])`, [
      petIds,
    ]);
    return order.id;
  })
    .then((orderId) => getOrder(userId, orderId))
    .catch((error) => {
      if (error.code === 'PET_UNAVAILABLE') return null;
      throw error;
    });
}

// userId null skips the ownership check (internal use only)
async function getOrder(userId, orderId) {
  const {
    rows: [order],
  } = await pool.query(
    `SELECT * FROM orders WHERE id = $1 AND ($2::int IS NULL OR user_id = $2)`,
    [orderId, userId]
  );
  if (!order) return null;
  const { rows: items } = await pool.query(
    `SELECT pet_id, pet_name, breed, price FROM order_items WHERE order_id = $1 ORDER BY id`,
    [orderId]
  );
  return { ...order, items };
}

async function getOrders(userId) {
  const { rows: orders } = await pool.query(
    `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  const { rows: items } = await pool.query(
    `SELECT oi.order_id, oi.pet_id, oi.pet_name, oi.breed, oi.price
     FROM order_items oi JOIN orders o ON o.id = oi.order_id
     WHERE o.user_id = $1 ORDER BY oi.id`,
    [userId]
  );
  return orders.map((order) => ({
    ...order,
    items: items.filter((item) => item.order_id === order.id),
  }));
}

module.exports = {
  pool,
  withTransaction,
  publicUser,

  createUser,
  getUserById,
  getUserByUsernameOrEmail,
  updateUserProfile,
  setStripeCustomerId,

  getBillingAddress,
  upsertBillingAddress,

  getPaymentMethods,
  getPaymentMethod,
  addPaymentMethod,
  setDefaultPaymentMethod,
  deletePaymentMethod,

  createPet,
  getPets,
  getPetById,

  getCart,
  addToCart,
  removeFromCart,

  createOrder,
  getOrder,
  getOrders,
  getOrderByPaymentIntent,
};
