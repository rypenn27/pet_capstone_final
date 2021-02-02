// code to build and initialize DB goes here
const {
  client,
  getPets,
  createPet,

  getUsers,
  getUserById,
  getUserByUsername,
  getPetsById,
  createUser,
  getCart,
  createCart,
  addToCart,
  checkout,

  getLogin,
  createLogin,

  // other db methods
} = require('./index');

async function dropTables() {
  try {
    console.log('Starting to drop tablesssssssss');
    client.query(`
    DROP TABLE if EXISTS pets;
    DROP TABLE if EXISTS login CASCADE;
    DROP TABLE if EXISTS cart;
    DROP TABLE if EXISTS RescueOrders;
    `);
    console.log('Finished dropping tables');
  } catch (error) {
    console.error('Error with dropping tablesssssssssssss');
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
    //product
    await client.query(`
    CREATE TABLE pets(
      id SERIAL PRIMARY KEY,
      name varchar (255) NOT NULL,
      breed varchar (255) NOT NULL,
      age INTEGER NOT NULL,
      gender varchar (255) NOT NULL,

      color varchar (255) NOT NULL,
      quantity INTEGER NOT NULL,
      price DECIMAL NOT NULL,
      count INTEGER NOT NULL,
      "available" BOOLEAN
    );
     CREATE TABLE cart (
      id SERIAL PRIMARY KEY,
      "userId" INTEGER,
      "petId" INTEGER[],
      status TEXT NOT NULL
      );
    CREATE TABLE RescueOrders (
       id SERIAL PRIMARY KEY,
       "userId" INTEGER, 
       "cartId" INTEGER 
);
    CREATE TABLE login (
      id SERIAL PRIMARY KEY,
      username varchar (255) NOT NULL UNIQUE,
      email varchar (255) NOT NULL UNIQUE,
      role TEXT NOT NULL,
      password varchar (255) NOT NULL
    );
    `);
    console.log('finished creating tables');
  } catch (error) {
    throw error;
  }
}

async function createInitialPets() {
  try {
    // create useful starting data
    console.log('Attempting to create');
    const petOne = await createPet({
      name: 'Frenchie',
      breed: 'French Bulldog',
      age: '5',
      gender: 'Female',
      color: 'Brindle',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTwo = await createPet({
      name: 'Vinnie',
      breed: 'Italian Greyhound',
      age: '2',
      gender: 'Male',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petThree = await createPet({
      name: 'Maxx',
      breed: 'German Shepherd',
      age: '8',
      gender: 'Female',
      color: 'Gold',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFour = await createPet({
      breed: 'French Bulldog',
      age: '2',
      name: 'Ace',
      gender: 'Male',
      color: 'Black',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFive = await createPet({
      breed: 'Italian Greyhound',
      age: '4',
      name: 'Apollo',
      gender: 'Male',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSix = await createPet({
      breed: 'German Shepherd',
      age: '6',
      name: 'Bailey',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSeven = await createPet({
      breed: 'Collie',
      age: '2',
      name: 'Bandit',
      gender: 'Male',
      color: 'Gold',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEight = await createPet({
      breed: 'Labrador',
      age: '8',
      name: 'Baxter',
      gender: 'Male',
      color: 'Black',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petNine = await createPet({
      breed: 'Yorkie',
      age: '10',
      name: 'Bear',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTen = await createPet({
      breed: 'Terrier',
      age: '13',
      name: 'Beau',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEleven = await createPet({
      breed: 'English Bulldog',
      age: '16',
      name: 'Benji',
      gender: 'Male',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTwelve = await createPet({
      breed: 'Great Dane',
      age: '3',
      name: 'Benny',
      gender: 'Male',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petThirteen = await createPet({
      breed: 'Poodle',
      age: '11',
      name: 'Izzy',
      gender: 'Female',
      color: 'Black',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFourteen = await createPet({
      breed: 'Pitbull',
      age: '6',
      name: 'Jasmine',
      gender: 'Female',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFifteen = await createPet({
      breed: 'Rottweiler',
      age: '9',
      name: 'Josie',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSixteen = await createPet({
      breed: 'Pomeranian',
      age: '2',
      name: 'Katie',
      gender: 'Female',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSeventeen = await createPet({
      breed: 'Dobermann',
      age: '5',
      name: 'Kona',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEighteen = await createPet({
      breed: 'Basset Hound',
      age: '8',
      name: 'Lacey',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petNineteen = await createPet({
      breed: 'Irish Setter',
      age: '13',
      name: 'Lady',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTwenty = await createPet({
      breed: 'Dalmatian',
      age: '16',
      name: 'Layla',
      gender: 'Female',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTwentyOne = await createPet({
      breed: 'Sheltie',
      age: '13',
      name: 'Lexi',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTwentyTwo = await createPet({
      breed: 'Corgi',
      age: '7',
      name: 'Lexie',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTwentyThree = await createPet({
      breed: 'French Bulldog',
      age: '9',
      name: 'Lilly',
      gender: 'Female',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTwentyFour = await createPet({
      breed: 'Italian Greyhound',
      age: '2',
      name: 'Lily',
      gender: 'Female',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTwentyFive = await createPet({
      breed: 'German Shepherd',
      age: '3',
      name: 'Lola',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTwentySix = await createPet({
      breed: 'Collie',
      age: '18',
      name: 'Lucky',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTwentySeven = await createPet({
      breed: 'Labrador',
      age: '4',
      name: 'Lucy',
      gender: 'Female',
      color: 'Black',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTwentyEight = await createPet({
      breed: 'Yorkie',
      age: '9',
      name: 'Lulu',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petTwentyNine = await createPet({
      breed: 'Terrier',
      age: '2',
      name: 'Luna',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petThirty = await createPet({
      breed: 'Sheltie',
      age: '13',
      name: 'Frankie',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petThirtyOne = await createPet({
      breed: 'Corgi',
      age: '2',
      name: 'George',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petThirtyTwo = await createPet({
      breed: 'French Bulldog',
      age: '10',
      name: 'Gizmo',
      gender: 'Male',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petThirtyThree = await createPet({
      breed: 'Italian Greyhound',
      age: '12',
      name: 'Gunner',
      gender: 'Male',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petThirtyFour = await createPet({
      breed: 'German Shepherd',
      age: '6',
      name: 'Gus',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petThirtyFive = await createPet({
      breed: 'Collie',
      age: '2',
      name: 'Hank',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petThirtySix = await createPet({
      breed: 'Labrador',
      age: '8',
      name: 'Harley',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petThirtySeven = await createPet({
      breed: 'Yorkie',
      age: '9',
      name: 'Henry',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petThirtyEight = await createPet({
      breed: 'Terrier',
      age: '13',
      name: 'Hunter',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petThirtyNine = await createPet({
      breed: 'English Bulldog',
      age: '2',
      name: 'Jack',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFourty = await createPet({
      breed: 'Great Dane',
      age: '7',
      name: 'Jackson',
      gender: 'Male',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFourtyOne = await createPet({
      breed: 'Poodle',
      age: '3',
      name: 'Jake',
      gender: 'Male',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFourtyTwo = await createPet({
      breed: 'Pitbull',
      age: '8',
      name: 'Molly',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFourtyThree = await createPet({
      breed: 'Rottweiler',
      age: '5',
      name: 'Nala',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFourtyFour = await createPet({
      breed: 'Pomeranian',
      age: '2',
      name: 'Nikki',
      gender: 'Female',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFourtyFive = await createPet({
      breed: 'Dobermann',
      age: '3',
      name: 'Olive',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFourtySix = await createPet({
      breed: 'Basset Hound',
      age: '9',
      name: 'Peanut',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFourtySeven = await createPet({
      breed: 'Irish Setter',
      age: '3',
      name: 'Pebbles',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFiourtyEight = await createPet({
      breed: 'Dalmatian',
      age: '7',
      name: 'Penny',
      gender: 'Female',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFourtyNine = await createPet({
      breed: 'Sheltie',
      age: '5',
      name: 'Pepper',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFifty = await createPet({
      breed: 'Corgi',
      age: '4',
      name: 'Luke',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFiftyOne = await createPet({
      breed: 'French Bulldog',
      age: '11',
      name: 'Mac',
      gender: 'Male',
      color: 'Black',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFiftyTwo = await createPet({
      breed: 'Italian Greyhound',
      age: '17',
      name: 'Marley',
      gender: 'Male',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFiftyThree = await createPet({
      breed: 'German Shepherd',
      age: '13',
      name: 'Max',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFiftyFour = await createPet({
      breed: 'Collie',
      age: '14',
      name: 'Mickey',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFiftyFive = await createPet({
      breed: 'Labrador',
      age: '5',
      name: 'Milo',
      gender: 'Male',
      color: 'Gold',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFiftySix = await createPet({
      breed: 'Yorkie',
      age: '2',
      name: 'Moose',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFiftySeven = await createPet({
      breed: 'Terrier',
      age: '3',
      name: 'Murphy',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFiftyEight = await createPet({
      breed: 'English Bulldog',
      age: '2',
      name: 'Oliver',
      gender: 'Male',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petFiftyNine = await createPet({
      breed: 'Great Dane',
      age: '8',
      name: 'Ollie',
      gender: 'Male',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSixty = await createPet({
      breed: 'Poodle',
      age: '6',
      name: 'Oreo',
      gender: 'Male',
      color: 'Black',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSixtyOne = await createPet({
      breed: 'Pitbull',
      age: '11',
      name: 'Oscar',
      gender: 'Male',
      color: 'Black',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSixtyTwo = await createPet({
      breed: 'Rottweiler',
      age: '5',
      name: 'Princess',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSixtyThree = await createPet({
      breed: 'Pomeranian',
      age: '15',
      name: 'Riley',
      gender: 'Female',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSixtyFour = await createPet({
      breed: 'Dobermann',
      age: '7',
      name: 'Rosie',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSixtyFive = await createPet({
      breed: 'Basset Hound',
      age: '13',
      name: 'Roxie',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSixtySix = await createPet({
      breed: 'Irish Setter',
      age: '7',
      name: 'Roxy',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSixtySeven = await createPet({
      breed: 'Dalmatian',
      age: '2',
      name: 'Ruby',
      gender: 'Female',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSixtyEight = await createPet({
      breed: 'Sheltie',
      age: '6',
      name: 'Sadie',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSixtyNine = await createPet({
      breed: 'Corgi',
      age: '7',
      name: 'Sally',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSeventy = await createPet({
      breed: 'French Bulldog',
      age: '7',
      name: 'Sandy',
      gender: 'Female',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSeventyOne = await createPet({
      breed: 'Italian Greyhound',
      age: '2',
      name: 'Sasha',
      gender: 'Female',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSeventyTwo = await createPet({
      breed: 'German Shepherd',
      age: '1',
      name: 'Sassy',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSeventyThree = await createPet({
      breed: 'Collie',
      age: '1',
      name: 'Scout',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSeventyFour = await createPet({
      breed: 'Labrador',
      age: '14',
      name: 'Shadow',
      gender: 'Male',
      color: 'Gold',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSeventyFive = await createPet({
      breed: 'Yorkie',
      age: '12',
      name: 'Shelby',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSeventySix = await createPet({
      breed: 'Terrier',
      age: '7',
      name: 'Sierra',
      gender: 'female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSeventySeven = await createPet({
      breed: 'English Bulldog',
      age: '5',
      name: 'Scooter',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSeventyEight = await createPet({
      breed: 'Great Dane',
      age: '9',
      name: 'Scout',
      gender: 'Male',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petSeventyNine = await createPet({
      breed: 'Poodle',
      age: '9',
      name: 'Shadow',
      gender: 'Male',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEighty = await createPet({
      breed: 'Pitbull',
      age: '3',
      name: 'Simba',
      gender: 'Male',
      color: 'Black',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEightyOne = await createPet({
      breed: 'Rottweiler',
      age: '4',
      name: 'Sparky',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEightyTwo = await createPet({
      breed: 'Pomeranian',
      age: '5',
      name: 'Spike',
      gender: 'Male',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEightyThree = await createPet({
      breed: 'Dobermann',
      age: '7',
      name: 'Tank',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEightyFour = await createPet({
      breed: 'Basset Hound',
      age: '8',
      name: 'Teddy',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEightyFive = await createPet({
      breed: 'Irish Setter',
      age: '9',
      name: 'Thor',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEightySix = await createPet({
      breed: 'Dalmatian',
      age: '2',
      name: 'Toby',
      gender: 'Male',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEightySeven = await createPet({
      breed: 'Sheltie',
      age: '3',
      name: 'Tucker',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEightyEight = await createPet({
      breed: 'Corgi',
      age: '7',
      name: 'Tyson',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petEightNine = await createPet({
      breed: 'French Bulldog',
      age: '9',
      name: 'Vader',
      gender: 'Male',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petNinety = await createPet({
      breed: 'Italian Greyhound',
      age: '3',
      name: 'Winston',
      gender: 'Male',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petNinetyOne = await createPet({
      breed: 'German Shepherd',
      age: '7',
      name: 'Yoda',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petNinetyTwo = await createPet({
      breed: 'German Shepherd',
      age: '3',
      name: 'Sam',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petNinetyThree = await createPet({
      breed: 'Labrador',
      age: '2',
      name: 'Girlie',
      gender: 'Female',
      color: 'Black',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petNinetyFour = await createPet({
      breed: 'Poodle',
      age: '9',
      name: 'Dude',
      gender: 'Male',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petNinetyFive = await createPet({
      breed: 'Poodle',
      age: '7',
      name: 'Bailey',
      gender: 'Male',
      color: 'Gray',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petNinetySix = await createPet({
      breed: 'Terrier',
      age: '3',
      name: 'Lilly',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petNinetySeven = await createPet({
      breed: 'Yorkie',
      age: '2',
      name: 'Max',
      gender: 'Male',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petNinetyEight = await createPet({
      breed: 'Corgi',
      age: '8',
      name: 'Maxene',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petNinetyNine = await createPet({
      breed: 'Yorkie',
      age: '11',
      name: 'Hope',
      gender: 'Female',
      color: 'Brown',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });
    const petOneHundred = await createPet({
      breed: 'Dalmatian',
      age: '12',
      name: 'Deville',
      gender: 'Male',
      color: 'White',
      quantity: 1,
      price: 150,
      available: true,
      count: 1,
    });

    console.log('Great Success!');
    return [petOne, petTwo, petThree];
  } catch (error) {
    console.error('Error during pet creation');
    throw error;
  }
}

async function createInitialUsers() {
  try {
    // create useful starting data
    console.log('Attempting to create login info');
    const userOne = await createUser({
      username: 'ExampleUser1',
      email: 'exampleuser1@yahoo.com',
      role: 'user',
      password: 'password123',
    });
    const userTwo = await createUser({
      username: 'ExampleUser2',
      email: 'exampleuser2@yahoo.com',
      role: 'user',
      password: 'password123',
    });
    const userThree = await createUser({
      username: 'Admin',
      email: 'admin@gmail.com',
      role: 'admin',
      password: 'password123',
    });
    console.log('Great Success!');
    return [userOne, userTwo, userThree];
  } catch (error) {
    console.error('Error during login creation');
    throw error;
  }
}

async function createInitialCarts() {
  try {
    console.log('attemping to create carts');
    const cartOne = await createCart({
      userId: 1,
      petId: [1, 3, 6],
    });

    const cartTwo = await createCart({
      userId: 2,
      petId: [1, 4, 2],
    });

    const cartThree = await createCart({
      userId: 3,
      pettId: [2, 3, 5],
    });

    const cartFour = await createCart({
      userId: 4,
      petId: [5, 1, 6],
    });

    console.log('Creating Carts Successful!');

    return [cartOne, cartTwo, cartThree, cartFour];
  } catch (error) {
    console.error('error while creating carts');
    throw error;
  }
}

async function populateInitialData() {
  try {
    console.log('Filling database with initial user/product/cart data');
    await createInitialPets();

    await createInitialUsers();
    await createInitialCarts();
    console.log('Getting all pets: \n');

    console.log('Getting all pets: \n', await getPets());
    console.log('Getting all logins: \n', await getLogin());

    console.log('Filled pet database');
    console.log('Finished filling pet database');
    console.log('Finished filling users');
    console.log('Finished filling Carts');
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
