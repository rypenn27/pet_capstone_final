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
    // return new link
    console.log(petCreated);
    return petCreated;
  } catch (error) {
    throw error;
  }
}

async function getUsers() {
  try {
    const { rows } = await client.query(`
      SELECT * FROM "Users"
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function createUser({ username, email, role, password }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO "Users"(username, email, role, password)
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

async function updateUser(fieldsObject, userId) {
  console.log('parameters', fieldsObject, userId);
  try {
    const retrievedUser = await getUserById(userId);
    console.log('retrieved user successfully', retrievedUser);
    if (retrievedUser === null) {
      throw new Error('A User with that id does not exist.');
    }
    const setString = Object.keys(fieldsObject)
      .map((key, index) => `"${key}"=$${index + 1}`)
      .join(', ');
    console.log('setString in DB', setString);
    const {
      rows: [user],
    } = await client.query(
      `
        UPDATE "Users"
        SET ${setString}
        WHERE id = ${userId}
        RETURNING *
    `,
      Object.values(fieldsObject)
    );
    return user;
  } catch (error) {
    throw error;
  }
}

async function promoteUser(userId, role) {
  try {
    role === 'user'
      ? await client.query(
          `
      UPDATE "Users"
      SET role='admin'
      WHERE id=$1;
    `,
          [userId]
        )
      : await client.query(
          `
      UPDATE "Users"
      SET role='user'
      WHERE id=$1;
    `,
          [userId]
        );

    const { rows } = await client.query(`
      SELECT * FROM "Users"
    `);
    return rows;
  } catch (error) {
    throw error;
  }
}

// select single user
async function getUserById(userId) {
  try {
    const {
      rows: [user],
    } = await client.query(`
      SELECT * FROM "Users"
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

async function getUserByUsername(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT * FROM "Users"
      WHERE username=$1
    `,
      [username]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

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

async function updatePet(petId, fields = {}) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(', ');
  console.log('Here is the setString: ', setString);
  // update products table
  try {
    // update any fields that need to be updated
    if (setString.length > 0) {
      await client.query(
        `
          UPDATE pets
          SET ${setString}
          WHERE id=${petId};
        `,
        Object.values(fields)
      );

      const { rows } = await client.query(`
        SELECT * FROM pets;
        `);
      return rows;
    }
  } catch (error) {
    throw error;
  }
}

// cart created, pets added = processing and checkout = completed
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

// not grabbing completed carts only created and processing.
// grab user specific cart
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

// user adds item to cart > status = processing
// result is all completed orders
// helper function - no need to export
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

// list of orders for admin
async function getRescueOrder(userId) {
  try {
    const { rows } = await client.query(
      `
      SELECT * FROM RescueOrders
      WHERE "userId" = $1
    `,
      [userId]
    );

    const cartArr = [];
    for (let i = 0; i < rows.length; i++) {
      console.log('user id', rows[i].userId);
      const cart = await getCompletedCart({ userId: rows[i].cartId });
      console.log('cart', cart, cart.length);
      const totalArr = [];

      if (cart !== []) {
        cart.pets.map((pet) => {
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

// add to cart function
// check if cart has pets
async function addToCart({ userId, petId }) {
  // get cart for user
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

// who is checking out and which cart
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

async function deleteUser(userId) {
  console.log('userId', userId);
  try {
    const {
      rows: [order],
    } = await client.query(
      `
      DELETE FROM RescueOrders
      WHERE id = $1
      RETURNING *
    `,
      [userId]
    );

    const {
      rows: [cart],
    } = await client.query(
      `
      DELETE FROM cart
      WHERE id = $1
      RETURNING *
    `,
      [userId]
    );
    const {
      rows: [user],
    } = await client.query(
      `
      DELETE FROM "Users"
      WHERE id = $1
      RETURNING *
    `,
      [userId]
    );

    console.log('user', user);
    return { RescueOrder, cart, user };
  } catch (error) {
    throw error;
  }
}

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

async function deleteRescueOrdersAndCart(userId) {
  try {
    await client.query(
      `
    DELETE FROM RescueOrders
    WHERE "userId"=$1;
    `,
      [userId]
    );

    const { rows } = await client.query(
      `
    DELETE FROM cart
    WHERE "userId"=$1
    RETURNING *;
    `,
      [userId]
    );

    return rows;
  } catch (error) {
    throw error;
  }
}

// export
module.exports = {
  client,
  getUsers,
  createUser,
  getUserById,
  getUserByUsername,
  getPets,
  createPet,
  updateUser,
  promoteUser,
  getPetById,
  updatePet,
  deleteUser,
  deletePet,
  deleteRescueOrdersAndCart,
  getCart,
  createCart,
  addToCart,
  checkout,
  getRescueOrder,
  getRescueOrders,
  addCount,
  subtractCount,

  // db methods
};
