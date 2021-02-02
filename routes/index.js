const apiRouter = require('express').Router();

const { getPets } = require('../db');

apiRouter.get('/', (req, res, next) => {
  res.send({
    message: 'API is under construction!',
  });
});

apiRouter.get('/pets', async (req, res, next) => {
  try {
    const pets = await getPets();
    console.log(pets);
    res.send(pets);
  } catch (error) {
    console.error('getAllPets route error', error);
  }
});

module.exports = apiRouter;
