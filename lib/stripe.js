// Stripe client, restricted to sandbox (test mode) keys
const Stripe = require('stripe');

const secretKey = process.env.STRIPE_SECRET_KEY || '';
const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';

const configured =
  secretKey.startsWith('sk_test_') && publishableKey.startsWith('pk_test_');

if (secretKey && !secretKey.startsWith('sk_test_')) {
  console.warn('STRIPE_SECRET_KEY is not a test-mode key; Stripe is disabled.');
}
if (!configured) {
  console.warn(
    'Stripe sandbox keys are missing from .env; card and checkout features are disabled.'
  );
}

const stripe = configured ? Stripe(secretKey) : null;

// Route middleware: 503 until sandbox keys are configured
function requireStripe(req, res, next) {
  if (!stripe) {
    return res.status(503).json({
      error:
        'Payments are not set up yet. Add Stripe sandbox keys to .env and restart the server.',
    });
  }
  next();
}

module.exports = { stripe, publishableKey: configured ? publishableKey : null, requireStripe };
