const router = require('express').Router();
const { requireUser } = require('./auth');
const { ensureStripeCustomer } = require('./account');
const { stripe, requireStripe } = require('../lib/stripe');
const {
  getPets,
  getPetById,
  getCart,
  addToCart,
  removeFromCart,
  getBillingAddress,
  getPaymentMethod,
  createOrder,
  getOrder,
  getOrders,
  getOrderByPaymentIntent,
} = require('../db');

/////////////////////////// Pets (public) ///////////////////////////

router.get('/pets', async (req, res, next) => {
  try {
    res.json(await getPets({ search: (req.query.search || '').trim() }));
  } catch (error) {
    next(error);
  }
});

router.get('/pets/:id', async (req, res, next) => {
  try {
    const pet = await getPetById(Number(req.params.id) || 0);
    if (!pet) return res.status(404).json({ error: 'Pet not found.' });
    res.json(pet);
  } catch (error) {
    next(error);
  }
});

/////////////////////////// Basket ///////////////////////////

router.get('/cart', requireUser, async (req, res, next) => {
  try {
    res.json(await getCart(req.user.id));
  } catch (error) {
    next(error);
  }
});

router.post('/cart', requireUser, async (req, res, next) => {
  try {
    const pet = await getPetById(Number(req.body.petId) || 0);
    if (!pet) return res.status(404).json({ error: 'Pet not found.' });
    if (!pet.available) {
      return res.status(409).json({ error: `${pet.name} has already been adopted.` });
    }
    res.status(201).json(await addToCart(req.user.id, pet.id));
  } catch (error) {
    next(error);
  }
});

router.delete('/cart/:petId', requireUser, async (req, res, next) => {
  try {
    res.json(await removeFromCart(req.user.id, Number(req.params.petId) || 0));
  } catch (error) {
    next(error);
  }
});

/////////////////////////// Checkout ///////////////////////////

// Stripe's largest single USD charge
const STRIPE_MAX_CHARGE = 999999.99;

// Records the order once Stripe reports the payment succeeded.
// Safe to call twice for the same payment: the second call returns the existing order.
async function finalizeOrder(user, paymentIntent) {
  const existing = await getOrderByPaymentIntent(paymentIntent.id);
  if (existing) {
    if (existing.user_id !== user.id) throw new Error('Payment belongs to another user');
    return { order: existing };
  }

  const petIds = paymentIntent.metadata.petIds.split(',').map(Number);
  const [card, billing] = await Promise.all([
    getPaymentMethod(user.id, paymentIntent.metadata.cardId),
    getBillingAddress(user.id),
  ]);
  const order = await createOrder({
    userId: user.id,
    petIds,
    total: (paymentIntent.amount / 100).toFixed(2),
    paymentIntentId: paymentIntent.id,
    card: card ? { brand: card.brand, last4: card.last4 } : { brand: null, last4: null },
    billing,
  });
  if (!order) {
    // Someone else adopted one of these pets while this payment was processing
    await stripe.refunds.create({ payment_intent: paymentIntent.id });
    return {
      error:
        'One of these pets was just adopted by someone else. Your payment was refunded and your basket was updated.',
    };
  }
  return { order };
}

function sendFinalized(res, result) {
  if (result.error) return res.status(409).json({ error: result.error });
  res.status(201).json({ order: result.order });
}

router.post('/checkout', requireUser, requireStripe, async (req, res, next) => {
  try {
    const cart = await getCart(req.user.id);
    if (!cart.items.length) {
      return res.status(400).json({ error: 'Your basket is empty.' });
    }
    const unavailable = cart.items.filter((pet) => !pet.available);
    if (unavailable.length) {
      return res.status(409).json({
        error: `${unavailable.map((p) => p.name).join(', ')} ${unavailable.length > 1 ? 'have' : 'has'} already been adopted. Remove them from your basket to continue.`,
      });
    }
    if (Number(cart.total) > STRIPE_MAX_CHARGE) {
      return res.status(400).json({
        error: `Card payments are limited to $999,999.99 per order, and this basket totals $${Number(cart.total).toLocaleString('en-US', { minimumFractionDigits: 2 })}. Remove some pets to continue.`,
      });
    }
    const billing = await getBillingAddress(req.user.id);
    if (!billing) {
      return res.status(400).json({ error: 'Add a billing address before checking out.' });
    }
    const card = await getPaymentMethod(req.user.id, Number(req.body.cardId) || 0);
    if (!card) {
      return res.status(400).json({ error: 'Choose a saved card to pay with.' });
    }

    const customer = await ensureStripeCustomer(req.user);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(cart.total) * 100),
      currency: 'usd',
      customer,
      payment_method: card.stripe_payment_method_id,
      payment_method_types: ['card'],
      confirm: true,
      description: `Adoption fees: ${cart.items.map((p) => `${p.name} (${p.breed})`).join(', ')}`,
      receipt_email: req.user.email,
      metadata: {
        userId: String(req.user.id),
        cardId: String(card.id),
        petIds: cart.items.map((p) => p.id).join(','),
      },
    });

    if (paymentIntent.status === 'requires_action') {
      // The card needs 3D Secure; the browser finishes it, then calls /checkout/complete
      return res.json({
        requiresAction: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }
    if (paymentIntent.status !== 'succeeded') {
      return res.status(402).json({ error: 'The payment was not completed. Please try another card.' });
    }
    sendFinalized(res, await finalizeOrder(req.user, paymentIntent));
  } catch (error) {
    if (error.type === 'StripeCardError') {
      return res.status(402).json({ error: error.message });
    }
    next(error);
  }
});

router.post('/checkout/complete', requireUser, requireStripe, async (req, res, next) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      String(req.body.paymentIntentId || '')
    );
    if (paymentIntent.metadata.userId !== String(req.user.id)) {
      return res.status(404).json({ error: 'Payment not found.' });
    }
    if (paymentIntent.status !== 'succeeded') {
      return res.status(402).json({ error: 'The payment was not completed. Please try again.' });
    }
    sendFinalized(res, await finalizeOrder(req.user, paymentIntent));
  } catch (error) {
    if (error.type === 'StripeInvalidRequestError') {
      return res.status(404).json({ error: 'Payment not found.' });
    }
    next(error);
  }
});

/////////////////////////// Orders ///////////////////////////

router.get('/orders', requireUser, async (req, res, next) => {
  try {
    res.json(await getOrders(req.user.id));
  } catch (error) {
    next(error);
  }
});

router.get('/orders/:id', requireUser, async (req, res, next) => {
  try {
    const order = await getOrder(req.user.id, Number(req.params.id) || 0);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
