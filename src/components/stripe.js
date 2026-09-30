import { getConfig } from '../api';

let stripePromise = null;

// Resolves to a Stripe.js instance, or null when the server has no sandbox keys
export function getStripe() {
  if (!stripePromise) {
    stripePromise = getConfig().then(({ stripePublishableKey }) =>
      stripePublishableKey && window.Stripe ? window.Stripe(stripePublishableKey) : null
    );
    stripePromise.catch(() => {
      stripePromise = null;
    });
  }
  return stripePromise;
}
