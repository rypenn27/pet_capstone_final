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

async function createPet({ name, breed, age, gender, color }) {
  try {
    const {
      rows: [petCreated],
    } = await client.query(
      `
    INSERT INTO pets(name, breed, age, gender, color)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
      [name, breed, age, gender, color]
    );
    // return new link
    console.log(petCreated);
    return petCreated;
  } catch (error) {
    throw error;
  }
}

async function getLogInfo() {
  try {
    const { rows } = await client.query(`SELECT * FROM login_info`);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function createLogInfo({ username, orderNum }) {
  try {
    const {
      rows: [loginCreated],
    } = await client.query(
      `
    INSERT INTO login_info(username, orderNum)
    VALUES ($1, $2)
    RETURNING *
    `,
      [username, orderNum]
    );
    // return new link
    console.log(loginCreated);
    return loginCreated;
  } catch (error) {
    throw error;
  }
}

// export
module.exports = {
  client,
  getPets,
  createPet,
  createLogInfo,
  getLogInfo,
  // db methods
};
