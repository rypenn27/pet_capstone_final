const apiRouter = require('express').Router();

const { default: axios } = require('axios');
const jwt = require('jsonwebtoken');
// token confirmation
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.REACT_APP_CLIENTID);
// google oauth
const passport = require('passport');

apiRouter.get('/', (req, res, next) => {
  res.send({
    message: 'API is under construction!',
  });
});

// verify headers in token
// middleware  token verification

function verifyToken(req, res, next) {
  //get Auth header
  const bearerHeader = req.headers['authorization'];
  console.log('bearerheader', bearerHeader);
  // check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');
    console.log('bearer', bearer);
    // get token on index 1 from array
    const bearerToken = bearer[1];
    console.log('bearertoken', bearerToken);
    // adds token to req object - sets the token
    req.token = bearerToken;
    next();
    // send forbidden error status code
  } else {
    res.sendStatus(403);
  }
}

//////Gets All the Pets from the Pet Table///////////
apiRouter.get('/pets', async (req, res, next) => {
  try {
    const pets = await getPets();
    console.log(pets);
    res.send(pets);
  } catch (error) {
    console.error('getAllPets route error', error);
  }
});

///// Get pet by pet Id/////////////
apiRouter.get('/pets/:petId', async (req, res, next) => {
  const { pettId } = req.params;
  console.log('petId', petId);
  try {
    const pet = await getetById(petId);
    console.log('pet', pet);
    res.send({
      pet,
    });
  } catch (error) {
    next(error);
  }
});

// verify token, checks if user is logged in
apiRouter.get('/cart', verifyToken, async (req, res, next) => {
  try {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        console.log('auth data ', authData);
        const cart = await getCart({ userId: authData.user.id });
        console.log('auth data', authData);
        res.send({ cart });
      }
    });
  } catch (error) {
    next(error);
  }
});
/////////////////////////////gets all the rescue orders from rescue orders table//////////////////////
apiRouter.get('/RescueOrders', verifyToken, async (req, res, next) => {
  try {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        const rescueOrder = await getRescueOrder(authData.user.id);
        console.log('auth data', authData);
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST
// send username and password
// gets user by username
// check if user is in login Table
// checks db in login table if user password and user passwords match
apiRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await getUserByUsername(username);
    console.log('password', password);

    if (user) {
      if (user.password === password) {
        console.log('logged in', user);
        // encrypts user object, requires encrypting method
        // callback handles error or sends token via json
        jwt.sign({ user }, 'secretkey', { expiresIn: '1day' }, (err, token) => {
          if (err) {
            console.log('jwt error', err);
            res.send({ error: err, status: 403 });
          } else {
            res.json({ user, token });
          }
        });
      } else {
        res.send({ message: 'Username or password do not match.' });
      }
    } else {
      res.send({ message: 'User not found!' });
    }
  } catch (error) {
    next(error);
  }
});

///////Post-Login///////////////
//Posts username and password
// gets user by username
// check if user exists
// check if login table in db user password and user passwords match
apiRouter.post('/login', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const login = await getUserByUsername(username);
    console.log('password', password);

    if (login) {
      if (user.password === password) {
        console.log('logged in', login);
        // encrypts user object, requires encrypting method
        // callback to handle error or send token via json
        jwt.sign(
          { login },
          'secretkey',
          { expiresIn: '1day' },
          (err, token) => {
            if (err) {
              console.log('jwt error', err);
              res.send({ error: err, status: 403 });
            } else {
              res.json({ user, token });
            }
          }
        );
      } else {
        res.send({ message: 'Username or password do not match.' });
      }
    } else {
      res.send({ message: 'User not found!' });
    }
  } catch (error) {
    next(error);
  }
});

// REGISTER POST---posts username and password to login table
// has required fields

apiRouter.post('/register', async (req, res, next) => {
  // required fields from table
  const { username, email, password } = req.body;
  try {
    console.log('greetings');
    const login = await createUser({ username, email, password });
    if (login) {
      console.log('created user', login);
      // encrypt user
      jwt.sign(
        { login },
        'secretkey',
        { expiresIn: '1day' },
        async (err, token) => {
          if (err) {
            console.log('jwt error', err);
            res.sendStatus(403);
          } else {
            res.json({ login, token });
            await createCart({ loginId: login.id, petId: [] });
          }
        }
      );
    } else {
      res.send({ message: 'Error creating user.' });
    }
  } catch (error) {
    console.log('error in routes file:', error);

    if (error.includes('users_email_key')) {
      next({
        name: 'Bad Email',
        message: 'Please give a different  email',
      });
    } else if (error.includes('users_username_key')) {
      next({
        name: 'Bad Username',
        message: 'Please give another another username',
      });
    }
  }
});

/////////////// Google OAUTH ////////////////////////////////////////////////

apiRouter.post('/google-login', async (req, res, next) => {
  // gets token from body
  const { token } = req.body;
  console.log('token', token);
  try {
    // checks token and client id
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.REACT_APP_CLIENTID,
    });
    console.log('ticket1', ticket);
    // grab required fields from token object
    const { name, email } = ticket.getPayload();
    console.log('ticket payload', ticket.getPayload());
    const role = 'user';
    const password = 'password';
    // gets user by username
    const login = await getUserByUsername(name);
    // check if user exists
    if (login) {
      console.log('google name', name);
      // encrypt user via json webtoken
      jwt.sign(
        { login },
        'secretkey',
        { expiresIn: '1day' },
        async (err, token) => {
          if (err) {
            console.log('jwt error', err);
            res.sendStatus(403);
          } else {
            res.json({ user, token });
          }
        }
      );
    } else {
      // if user doesn't already exist in login table in db, create user
      const login = await createUser({
        username: name,
        email,
        role,
        password,
      });
      console.log('google name', name);
      // encrypt user
      jwt.sign(
        { login },
        'secretkey',
        { expiresIn: '1day' },
        async (err, token) => {
          if (err) {
            console.log('jwt error', err);
            res.sendStatus(403);
          } else {
            res.json({ login, token });
            await createCart({ loginId: login.id, petId: [] });
          }
        }
      );
    }
  } catch (error) {
    console.log('error in routes file:', error);
    // next(error);
    if (error.includes('users_email_key')) {
      next({
        name: 'Bad Email',
        message: 'Please supply another email',
      });
    } else if (error.includes('users_username_key')) {
      next({
        name: 'Bad Username',
        message: 'Please supply another username',
      });
    }
  }
});

// auth Google Logout
apiRouter.get('/googlelogout', (req, res, next) => {
  // handled via pasport
  res.send('logging out');
  // console.log("logging you out of Google")
});

// auth Google Login
// 'google' routes you to google login route , passport object via passport-setup.js
apiRouter.get(
  '/googlelogin',
  passport.authenticate('google', {
    // scope is telling passport what to retrieve from the users profile
    scope: ['profile'],
  })
);

apiRouter.get('/google', (req, res, next) => {
  // handle via passport
  res.send('logging in with google');
  // console.log("logging out of Google")
});
apiRouter.get('google/redirect', (req, res) => {
  res.send("you've arrived at the Google callback URL");
});

////////////////////////////////////////////////////////////

// creates order and cart row
apiRouter.post('/checkout', async (req, res, next) => {
  // required fields from table
  const { loginId, cartId } = req.body;
  try {
    //  index.js db
    const order = await checkout({
      loginId,
      cartId,
    });
    if (order) {
      console.log('order created', order);
      res.json({ order });
    }
    await createCart({ loginId, petId: [] });
  } catch (error) {
    next(error);
  }
});

apiRouter.post('/stripe', async (req, res, next) => {
  // required fields from table
  const { token, total } = req.body;
  try {
    console.log('total', parseFloat(total), Math.ceil(parseFloat(total)) * 100);
    const charge = await stripe.charges.create({
      amount: parseFloat(total) * 100,
      currency: 'USD',
      source: token.id,
      description: 'payment for pets',
      metadata: {
        petId: token.id,
      },
    });
    res.json({ message: 'payment succesful', charge });
  } catch (error) {
    next(error);
  }
});

// updates cart
apiRouter.patch('/cart', verifyToken, async (req, res, next) => {
  const { loginId, petId } = req.body;
  console.log('login id and pet id', loginId, petId);
  try {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        const updatedCart = await addToCart({ loginId, petId });
        console.log('updated cart', updatedCart);
        res.send({ updatedCart });
      }
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.patch('/count', verifyToken, async (req, res, next) => {
  const { id } = req.body;
  console.log('pet id', id);
  try {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        const updatedCount = await addCount(id);
        console.log('updated cart', updatedCount);
        res.send({ updatedCount });
      }
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.patch('/count/subtract', verifyToken, async (req, res, next) => {
  const { id } = req.body;
  console.log('pet id', id);
  try {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        const updatedCount = await subtractCount(id);
        console.log('updated cart', updatedCount);
        res.send({ updatedCount });
      }
    });
  } catch (error) {
    next(error);
  }
});

apiRouter.get('/orders/:loginId', verifyToken, async (req, res, next) => {
  const { loginId } = req.params;
  console.log('the loginid in the routes: ', loginId);
  try {
    jwt.verify(req.token, 'secretkey', async (err, authData) => {
      if (err) {
        res.send({ error: err, status: 403 });
      } else {
        const orders = await deleteOrdersAndCart(userId);
        console.log('deleted orders', orders);
        res.send(orders);
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = apiRouter;

const {
  getUsers,
  createUser,
  getUserById,
  getUserByUsername,
  getPets,
  getPetById,
  deletePet,
  getCart,
  createCart,
  addToCart,
  checkout,
  getRescueOrders,
  addCount,
  subtractCount,
  createPet,
} = require('../db');
