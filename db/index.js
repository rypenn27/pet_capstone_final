// Connect to DB
const { Client } = require('pg');
require('dotenv').config();
const { KEY, USER } = process.env;

const DB_NAME = 'pet-adoption';
const DB_URL =
  process.env.DATABASE_URL ||
  `postgres://${USER}:${KEY}@localhost:5432/${DB_NAME}`;

//Creating the client
const client = new Client(DB_URL);

// database methods
async function getPets() {
  try {
    const { rows } = await client.query(`SELECT * FROM pets`);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function createPet({ breed, age, gender, color }) {
  try {
    const {
      rows: [petCreated],
    } = await client.query(
      `
    INSERT INTO pets(breed, age, gender, color)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
      [breed, age, gender, color]
    );
    // return new link
    return petCreated;
  } catch (error) {
    throw error;
  }
}

// export
module.exports = {
  client,
  getPets,
  createPet,
  // db methods
};
