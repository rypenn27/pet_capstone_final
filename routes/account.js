const router = require('express').Router();
const { requireUser } = require('./auth');
const { stripe, requireStripe } = require('../lib/stripe');
const {
  publicUser,
  updateUserProfile,
  setStripeCustomerId,
  getBillingAddress,
  upsertBillingAddress,
  getPaymentMethods,
  getPaymentMethod,
  addPaymentMethod,
  setDefaultPaymentMethod,
  deletePaymentMethod,
} = require('../db');

router.use(requireUser);

// Creates the user's Stripe customer the first time it's needed
async function ensureStripeCustomer(user) {
  if (user.stripe_customer_id) return user.stripe_customer_id;
  const customer = await stripe.customers.create({
    email: user.email,
    name: `${user.first_name} ${user.last_name}`,
    metadata: { userId: String(user.id), username: user.username },
  });
  await setStripeCustomerId(user.id, customer.id);
  user.stripe_customer_id = customer.id;
  return customer.id;
}

function formatCard(pm) {
  return {
    id: pm.id,
    brand: pm.brand,
    last4: pm.last4,
    expMonth: pm.exp_month,
    expYear: pm.exp_year,
    cardholderName: pm.cardholder_name,
    isDefault: pm.is_default,
  };
}

async function accountSummary(user) {
  const [billing, cards] = await Promise.all([
    getBillingAddress(user.id),
    getPaymentMethods(user.id),
  ]);
  return { user: publicUser(user), billing, cards: cards.map(formatCard) };
}

router.get('/', async (req, res, next) => {
  try {
    res.json(await accountSummary(req.user));
  } catch (error) {
    next(error);
  }
});

router.patch('/', async (req, res, next) => {
  const { firstName = '', lastName = '', phone, email = '' } = req.body;
  if (!firstName.trim() || !lastName.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'First name, last name and a valid email are required.' });
  }
  try {
    const user = await updateUserProfile(req.user.id, {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone,
      email,
    });
    res.json(await accountSummary(user));
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'That email is already registered.' });
    }
    next(error);
  }
});

router.put('/billing', async (req, res, next) => {
  const fields = ['fullName', 'line1', 'city', 'state', 'postalCode'];
  const missing = fields.filter((f) => !String(req.body[f] || '').trim());
  if (missing.length) {
    return res.status(400).json({ error: 'Please fill in name, street address, city, state and ZIP code.' });
  }
  const country = String(req.body.country || 'US').trim().toUpperCase();
  if (!/^[A-Z]{2}$/.test(country)) {
    return res.status(400).json({ error: 'Country must be a 2-letter code, like US.' });
  }
  try {
    const billing = await upsertBillingAddress(req.user.id, {
      fullName: req.body.fullName.trim(),
      line1: req.body.line1.trim(),
      line2: (req.body.line2 || '').trim(),
      city: req.body.city.trim(),
      state: req.body.state.trim(),
      postalCode: req.body.postalCode.trim(),
      country,
    });
    res.json({ billing });
  } catch (error) {
    next(error);
  }
});

/////////////////////////// Saved cards ///////////////////////////

// Step 1: the browser needs a SetupIntent to collect the card with Stripe Elements
router.post('/cards/setup-intent', requireStripe, async (req, res, next) => {
  try {
    const customer = await ensureStripeCustomer(req.user);
    const setupIntent = await stripe.setupIntents.create({
      customer,
      payment_method_types: ['card'],
      usage: 'on_session',
      metadata: { userId: String(req.user.id) },
    });
    res.json({ clientSecret: setupIntent.client_secret });
  } catch (error) {
    next(error);
  }
});

// Step 2: after Stripe confirms the SetupIntent, record the card's display details
router.post('/cards', requireStripe, async (req, res, next) => {
  const { paymentMethodId } = req.body;
  try {
    const customer = await ensureStripeCustomer(req.user);
    const pm = await stripe.paymentMethods.retrieve(String(paymentMethodId || ''));
    if (pm.customer !== customer || pm.type !== 'card') {
      return res.status(400).json({ error: 'That card could not be saved. Please try again.' });
    }
    await addPaymentMethod(req.user.id, {
      stripePaymentMethodId: pm.id,
      brand: pm.card.brand,
      last4: pm.card.last4,
      expMonth: pm.card.exp_month,
      expYear: pm.card.exp_year,
      cardholderName: pm.billing_details.name,
    });
    res.status(201).json(await accountSummary(req.user));
  } catch (error) {
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(400).json({ error: 'That card could not be saved. Please try again.' });
    }
    next(error);
  }
});

router.patch('/cards/:id/default', async (req, res, next) => {
  try {
    const pm = await getPaymentMethod(req.user.id, req.params.id);
    if (!pm) return res.status(404).json({ error: 'Card not found.' });
    await setDefaultPaymentMethod(req.user.id, pm.id);
    res.json(await accountSummary(req.user));
  } catch (error) {
    next(error);
  }
});

router.delete('/cards/:id', requireStripe, async (req, res, next) => {
  try {
    const pm = await getPaymentMethod(req.user.id, req.params.id);
    if (!pm) return res.status(404).json({ error: 'Card not found.' });
    try {
      await stripe.paymentMethods.detach(pm.stripe_payment_method_id);
    } catch (error) {
      // Already detached on Stripe's side; still remove our record
      if (error.type !== 'StripeInvalidRequestError') throw error;
    }
    await deletePaymentMethod(req.user.id, pm.id);
    res.json(await accountSummary(req.user));
  } catch (error) {
    next(error);
  }
});

module.exports = { router, ensureStripeCustomer };
