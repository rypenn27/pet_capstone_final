const apiRouter = require('express').Router();
const { publishableKey } = require('../lib/stripe');

// The browser loads the Stripe publishable key from here, so it can change without a rebuild
apiRouter.get('/config', (req, res) => {
  res.json({ stripePublishableKey: publishableKey });
});

apiRouter.use('/', require('./auth').router);
apiRouter.use('/account', require('./account').router);
apiRouter.use('/', require('./shop'));

apiRouter.use((req, res) => {
  res.status(404).json({ error: 'Not found.' });
});

// eslint-disable-next-line no-unused-vars
apiRouter.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

module.exports = apiRouter;
