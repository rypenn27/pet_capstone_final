// This is the Web Server
require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');

const server = express();

// create logs for everything
server.use(morgan('dev'));

// handle application/json requests
server.use(express.json());

// here's our API
server.use('/api', require('./routes'));

// here's our static files
server.use(express.static(path.join(__dirname, 'build')));

// by default serve up the react app if we don't recognize the route
server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const { pool } = require('./db');

const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Server is running on ${PORT}!`);
  try {
    await pool.query('SELECT 1');
    console.log('Database is open for business!');
  } catch (error) {
    console.error('Database is closed for repairs!\n', error.message);
  }
});
