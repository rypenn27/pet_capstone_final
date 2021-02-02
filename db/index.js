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

// get all the Pets from Pet Table
async function getPets() {
  try {
    const { rows } = await client.query(`SELECT * FROM pets`);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getLogin() {
  try {
    const { rows } = await client.query(`SELECT * FROM login`);

    return rows;
  } catch (error) {
    throw error;
  }
}

//create a user and store their profile in Login Table
async function createUser({ username, email, role, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO login(username, email, role, password)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `,
      [username, email, role, password]
    );

    return user;
  } catch (error) {
    console.log('error in DB: ', error.message);
    throw error.message;
  }
}

// select single user
async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT * FROM login
      WHERE id=${userId}
    `);

    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    throw error;
  }
}

// select a single User from Login Table by their Username
async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * FROM login
      WHERE username=$1
    `,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

//get all orders from RescueOrders table
async function getRescueOrders() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM RescueOrders
    `);

    const cartArr = [];
    for (let i = 0; i < rows.length; i++) {
      console.log('user id', rows[i].userId);
      const cart = await getCompletedCart({ userId: rows[i].cartId });
      console.log('cart', cart, cart.length);
      const totalArr = [];

      if (cart !== []) {
        cart.pets.map((product) => {
          totalArr.push(parseFloat(pet.price * pet.count));
        });

        const total = totalArr.reduce((a, b) => a + b, 0).toFixed(2);
        console.log('total', totalArr);
        cartArr.push({ rows: rows[i], cart, total });
      }
    }
    console.log('cart array get orders', cartArr);
    return { cartArr };
  } catch (error) {
    throw error;
  }
}

//get a pet from the pet table by their ID
async function getPetById(petId) {
  try {
    const {
      rows: [pet],
    } = await client.query(`
      SELECT * FROM pets
      WHERE id = ${petId}    
      `);
    if (!pet) {
      return null;
    }
    return pet;
  } catch (error) {
    throw error;
  }
}

async function createPet({
  name,
  breed,
  age,
  gender,
  color,
  price,
  available,
  quantity,
  count,
}) {
  try {
    const {
      rows: [petCreated],
    } = await client.query(
      `
    INSERT INTO pets(name, breed, age, gender, color,price,available,quantity,count)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
    RETURNING *
    `,
      [name, breed, age, gender, color, price, available, quantity, count]
    );
    // return a new link
    console.log(petCreated);
    return petCreated;
  } catch (error) {
    throw error;
  }
}

// cart  is created, pets added are processing and checkout is complete
// cart for specific user
// petId pushed into pets array
async function createCart({ userId, petId, status = 'created' }) {
  try {
    const {
      rows: [cart],
    } = await client.query(
      `
      INSERT INTO cart("userId", "petId", status)
      VALUES ($1, $2, $3)
      RETURNING *;
    `,
      [userId, petId, status]
    );

    return cart;
  } catch (error) {
    throw error;
  }
}

// only gets carts that are created and processing for a specific cart or "basket"

async function getCart({ userId }) {
  console.log('userId', userId);
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM cart
      WHERE "userId" = $1 AND NOT status = 'completed'
    `,
      [userId]
    );
    console.log('rows', rows);
    const cart = [];
    for (let i = 0; i < rows.length; i++) {
      rows[i].status === 'processing' ? cart.push(rows[i]) : null;
    }
    if (rows.length > 0) {
      if (cart.length > 0) {
        console.log('inside processing cart', cart);
        const pets = cart[0].petId;
        const petArr = [];
        for (i = 0; i < pets.length; i++) {
          console.log('pet Id', pets[i]);
          const {
            rows: [pet],
          } = await client.query(`
            SELECT * FROM pets
            WHERE id = ${pets[i]}
          `);
          petArr.push(pet);
        }
        console.log('list of pets', petArr);
        return { id: cart[0].id, pets: petArr, status: cart[0].status };
      }
      console.log('inside cart', rows);
      const pets = rows[0].petId;
      const petArr = [];
      for (i = 0; i < pets.length; i++) {
        console.log('pet Id', pets[i]);
        const {
          rows: [pet],
        } = await client.query(`
            SELECT * FROM pets
            WHERE id = ${pets[i]}
          `);
        petArr.push(pet);
      }
      console.log('list of pets', petArr);
      return { id: rows[0].id, pets: petArr, status: rows[0].status };
    } else {
      console.log('outside cart', rows);
      return [];
    }
  } catch (error) {
    throw error;
  }
}

// user adds item to cart and changes status to "processing"
// this we can implement with stripe if we can get there

async function getCompletedCart({ userId }) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM cart
      WHERE id = $1 AND status = 'completed'
    `,
      [userId]
    );
    if (rows.length > 0) {
      console.log('inside cart', rows);
      const pets = rows[0].petId;
      const petArr = [];
      for (i = 0; i < pets.length; i++) {
        console.log('pet Id', pets[i]);
        const {
          rows: [pet],
        } = await client.query(`
            SELECT * FROM pets
            WHERE id = ${pets[i]}
          `);
        pettArr.push(pet);
      }
      console.log('list of pets', petArr);
      return { id: rows[0].id, pets: petArr, status: rows[0].status };
    } else {
      console.log('outside cart', rows);
      return [];
    }
  } catch (error) {
    throw error;
  }
}

// add to cart function
// check if cart or "basket" has pets then get the cart for for the user
async function addToCart({ userId, petId }) {
  const cart = await getCart({ userId });
  const cartId = cart.id;
  const oldPets = cart.pets;
  console.log('add to cart', cart);
  const newPets = [];
  if (oldPets.length > 0) {
    for (i = 0; i < oldPets.length; i++) {
      newPets.push(oldPets[i].id);
    }
    console.log('petId', petId);
    newPets.push(...petId);
  } else {
    newPets.push(...petId);
  }
  console.log('new cart', newPets);
  try {
    const {
      rows: [updatedCart],
    } = await client.query(
      `
      UPDATE cart
      SET "petId" = $1, status = $2
      WHERE "id" = $3
      RETURNING *;
    `,
      [newProducts, 'processing', cartId]
    );
    console.log('updated cart', updatedCart);
    return updatedCart;
  } catch (error) {
    throw error;
  }
}

// a way to identify what user is checking out and what cart is associated
async function checkout({ userId, cartId }) {
  console.log('checkout user cart id', userId, cartId);
  try {
    const {
      rows: [updatedCart],
    } = await client.query(
      `
      UPDATE cart
      SET status = $1
      WHERE "userId" = $2
    `,
      ['completed', userId]
    );
    const {
      rows: [RescueOrder],
    } = await client.query(
      `
      INSERT INTO orders("userId", "cartId")
      VALUES ($1, $2)
      RETURNING *
    `,
      [userId, cartId]
    );

    console.log('created Rescue Order', RescueOrder);
    return RescueOrder;
  } catch (error) {
    throw error;
  }
}

//delete a pet from the pet table
async function deletePet(petId) {
  try {
    const {
      rows: [pet],
    } = await client.query(
      `
      DELETE FROM pets
      WHERE id = $1
      RETURNING *
    `,
      [petId]
    );
    console.log('pet', pet);
    return pet;
  } catch (error) {
    throw error;
  }
}

//add to the count of a pet in the pet table
async function addCount(id) {
  const pet = await getPetById(id);
  console.log('pet count', pet);
  try {
    const { rows } = await client.query(
      `
    UPDATE pets
    SET count = $1
    WHERE id = $2
    RETURNING *
    `,
      [pet.count + 1, id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

//subtract count of a pet from the pet Table
async function subtractCount(id) {
  const pet = await getPetById(id);
  console.log('pet count', pet);
  try {
    const { rows } = await client.query(
      `
    UPDATE pets
    SET count = $1
    WHERE id = $2
    RETURNING *
    `,
      [pet.count - 1, id]
    );
    return rows;
  } catch (error) {
    throw error;
  }
}

async function createLogin({ username, orderid }) {
  try {
    const {
      rows: [loginCreated],
    } = await client.query(
      `
    INSERT INTO login(username, orderid)
    VALUES ($1, $2)
    RETURNING *
    `,
      [username, orderid]
    );
    // return new link
    console.log(loginCreated);
    return loginCreated;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  client,

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
  getLogin,
  createLogin,

  // db methods
};
