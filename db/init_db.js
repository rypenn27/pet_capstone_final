// code to build and initialize DB goes here
const {
  client,
  getPets,
  createPet,
  // other db methods
} = require('./index');

async function dropTables() {
  try {
    console.log('Starting to drop tables');
    client.query(`
    DROP TABLE if EXISTS pets;
    `);
    console.log('Finished dropping tables');
  } catch (error) {
    throw error;
  }
}

async function buildTables() {
  try {
    client.connect();

    // drop tables in correct order
    await dropTables();
    // build tables in correct order
    console.log('Build tables start');
    await client.query(`CREATE TABLE pets(
      id SERIAL PRIMARY KEY,
      breed varchar (255) NOT NULL,
      age INTEGER NOT NULL,
      gender varchar (255) NOT NULL,
      color varchar (255) NOT NULL
    )`);
    console.log('Finished table bulding');
  } catch (error) {
    throw error;
  }
}

async function createInitialPets() {
  try {
    // create useful starting data
    console.log('Attempting to create');
    const petOne = await createPet({
      breed: 'French Bulldog',
      age: '5',
      gender: 'Female',
      color: 'Brindle',
    });
    const petTwo = await createPet({
      breed: 'Italian Greyhound',
      age: '2',
      gender: 'Male',
      color: 'Gray',
    });
    const petThree = await createPet({
      breed: 'German Shepherd',
      age: '8',
      gender: 'Female',
      color: 'Gold',
    });

    console.log('Great Success!');
    return [petOne, petTwo, petThree];
  } catch (error) {
    console.error('Error during pet creation');
    throw error;
  }
}

async function populateInitialData() {
  try {
    console.log('Filling database with initial pet data');
    await createInitialPets();
    console.log('Getting all pets: \n', await getPets());
    console.log('Filled pet database');
    console.log('Finished filling pet database');
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
