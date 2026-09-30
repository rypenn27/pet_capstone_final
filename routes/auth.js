const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { createUser, getUserById, getUserByUsernameOrEmail, publicUser } = require('../db');

const { JWT_SECRET } = process.env;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is missing from .env');
}

function signToken(user) {
  return jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '1d',
  });
}

// Middleware: rejects the request unless it carries a valid "Bearer <token>" header
async function requireUser(req, res, next) {
  const [scheme, token] = (req.headers.authorization || '').split(' ');
  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: 'Please log in first.' });
  }
  try {
    const { id } = jwt.verify(token, JWT_SECRET);
    const user = await getUserById(id);
    if (!user) return res.status(401).json({ error: 'Please log in again.' });
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Your session expired. Please log in again.' });
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_RE = /^[A-Za-z0-9_.-]{3,50}$/;

router.post('/register', async (req, res, next) => {
  const { username = '', email = '', password = '', firstName = '', lastName = '', phone } = req.body;
  const errors = [];
  if (!USERNAME_RE.test(username)) errors.push('Username must be 3 to 50 letters, numbers, dots, dashes or underscores.');
  if (!EMAIL_RE.test(email)) errors.push('Enter a valid email address.');
  if (password.length < 8) errors.push('Password must be at least 8 characters.');
  if (!firstName.trim() || !lastName.trim()) errors.push('First and last name are required.');
  if (errors.length) return res.status(400).json({ error: errors.join(' ') });

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await createUser({
      username,
      email,
      passwordHash,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone,
    });
    res.status(201).json({ user: publicUser(user), token: signToken(user) });
  } catch (error) {
    if (error.code === '23505') {
      const field = error.constraint === 'users_email_key' ? 'email' : 'username';
      return res.status(409).json({ error: `That ${field} is already registered.` });
    }
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  const { username = '', password = '' } = req.body;
  try {
    const user = await getUserByUsernameOrEmail(username.trim());
    const ok = user && (await bcrypt.compare(password, user.password_hash));
    if (!ok) {
      return res.status(401).json({ error: 'Username or password is incorrect.' });
    }
    res.json({ user: publicUser(user), token: signToken(user) });
  } catch (error) {
    next(error);
  }
});

module.exports = { router, requireUser };
