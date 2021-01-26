// code to build and initialize DB goes here
const {
  client,
  getPets,
  createPet,
  // other db methods
} = require("./index");

async function dropTables() {
  try {
    console.log("Starting to drop tables");
    client.query(`
    DROP TABLE if EXISTS pets;
    `);
    console.log("Finished dropping tables");
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
    console.log("Build tables start");
    await client.query(`CREATE TABLE pets(
      id SERIAL PRIMARY KEY,
      name varchar (255) NOT NULL,
      breed varchar (255) NOT NULL,
      age INTEGER NOT NULL,
      gender varchar (255) NOT NULL,
      color varchar (255) NOT NULL
    )`);
    console.log("Finished table bulding");
  } catch (error) {
    throw error;
  }
}

async function createInitialPets() {
  try {
    // create useful starting data
    console.log("Attempting to create");
    const petOne = await createPet({
<<<<<<< HEAD
      name: "Frenchie",
      breed: "French Bulldog",
      age: "5",
      gender: "Female",
      color: "Brindle",
    });
    const petTwo = await createPet({
      name: "Vinnie",
      breed: "Italian Greyhound",
      age: "2",
      gender: "Male",
      color: "Gray",
    });
    const petThree = await createPet({
      name: "Maxx",
      breed: "German Shepherd",
      age: "8",
      gender: "Female",
      color: "Gold",
    });
    const petFour = await createPet({
      breed: "French Bulldog",
      age: "2",
      name: "Ace",
      gender: "Male",
      color: "Black",
    });
    const petFive = await createPet({
      breed: "Italian Greyhound",
      age: "4",
      name: "Apollo",
      gender: "Male",
      color: "Gray",
    });
    const petSix = await createPet({
      breed: "German Shepherd",
      age: "6",
      name: "Bailey",
      gender: "Male",
      color: "Brown",
    });
    const petSeven = await createPet({
      breed: "Collie",
      age: "2",
      name: "Bandit",
      gender: "Male",
      color: "Gold",
    });
    const petEight = await createPet({
      breed: "Labrador",
      age: "8",
      name: "Baxter",
      gender: "Male",
      color: "Black",
    });
    const petNine = await createPet({
      breed: "Yorkie",
      age: "10",
      name: "Bear",
      gender: "Male",
      color: "Brown",
    });
    const petTen = await createPet({
      breed: "Terrier",
      age: "13",
      name: "Beau",
      gender: "Male",
      color: "Brown",
    });
    const petEleven = await createPet({
      breed: "English Bulldog",
      age: "16",
      name: "Benji",
      gender: "Male",
      color: "White",
    });
    const petTwelve = await createPet({
      breed: "Great Dane",
      age: "3",
      name: "Benny",
      gender: "Male",
      color: "Gray",
    });
    const petThirteen = await createPet({
      breed: "Poodle",
      age: "11",
      name: "Izzy",
      gender: "Female",
      color: "Black",
    });
    const petFourteen = await createPet({
      breed: "Pitbull",
      age: "6",
      name: "Jasmine",
      gender: "Female",
      color: "Gray",
    });
    const petFifteen = await createPet({
      breed: "Rottweiler",
      age: "9",
      name: "Josie",
      gender: "Female",
      color: "Brown",
    });
    const petSixteen = await createPet({
      breed: "Pomeranian",
      age: "2",
      name: "Katie",
      gender: "Female",
      color: "White",
    });
    const petSeventeen = await createPet({
      breed: "Dobermann",
      age: "5",
      name: "Kona",
      gender: "Female",
      color: "Brown",
    });
    const petEighteen = await createPet({
      breed: "Basset Hound",
      age: "8",
      name: "Lacey",
      gender: "Female",
      color: "Brown",
    });
    const petNineteen = await createPet({
      breed: "Irish Setter",
      age: "13",
      name: "Lady",
      gender: "Female",
      color: "Brown",
    });
    const petTwenty = await createPet({
      breed: "Dalmatian",
      age: "16",
      name: "Layla",
      gender: "Female",
      color: "White",
    });
    const petTwentyOne = await createPet({
      breed: "Sheltie",
      age: "13",
      name: "Lexi",
      gender: "Female",
      color: "Brown",
    });
    const petTwentyTwo = await createPet({
      breed: "Corgi",
      age: "7",
      name: "Lexie",
      gender: "Female",
      color: "Brown",
    });
    const petTwentyThree = await createPet({
      breed: "French Bulldog",
      age: "9",
      name: "Lilly",
      gender: "Female",
      color: "Gray",
    });
    const petTwentyFour = await createPet({
      breed: "Italian Greyhound",
      age: "2",
      name: "Lily",
      gender: "Female",
      color: "Gray",
    });
    const petTwentyFive = await createPet({
      breed: "German Shepherd",
      age: "3",
      name: "Lola",
      gender: "Female",
      color: "Brown",
    });
    const petTwentySix = await createPet({
      breed: "Collie",
      age: "18",
      name: "Lucky",
      gender: "Female",
      color: "Brown",
    });
    const petTwentySeven = await createPet({
      breed: "Labrador",
      age: "4",
      name: "Lucy",
      gender: "Female",
      color: "Black",
    });
    const petTwentyEight = await createPet({
      breed: "Yorkie",
      age: "9",
      name: "Lulu",
      gender: "Female",
      color: "Brown",
    });
    const petTwentyNine = await createPet({
      breed: "Terrier",
      age: "2",
      name: "Luna",
      gender: "Female",
      color: "Brown",
    });
    const petThirty = await createPet({
      breed: "Sheltie",
      age: "13",
      name: "Frankie",
      gender: "Male",
      color: "Brown",
    });
    const petThirtyOne = await createPet({
      breed: "Corgi",
      age: "2",
      name: "George",
      gender: "Male",
      color: "Brown",
    });
    const petThirtyTwo = await createPet({
      breed: "French Bulldog",
      age: "10",
      name: "Gizmo",
      gender: "Male",
      color: "Gray",
    });
    const petThirtyThree = await createPet({
      breed: "Italian Greyhound",
      age: "12",
      name: "Gunner",
      gender: "Male",
      color: "Gray",
    });
    const petThirtyFour = await createPet({
      breed: "German Shepherd",
      age: "6",
      name: "Gus",
      gender: "Male",
      color: "Brown",
    });
    const petThirtyFive = await createPet({
      breed: "Collie",
      age: "2",
      name: "Hank",
      gender: "Male",
      color: "Brown",
    });
    const petThirtySix = await createPet({
      breed: "Labrador",
      age: "8",
      name: "Harley",
      gender: "Male",
      color: "Brown",
    });
    const petThirtySeven = await createPet({
      breed: "Yorkie",
      age: "9",
      name: "Henry",
      gender: "Male",
      color: "Brown",
    });
    const petThirtyEight = await createPet({
      breed: "Terrier",
      age: "13",
      name: "Hunter",
      gender: "Male",
      color: "Brown",
    });
    const petThirtyNine = await createPet({
      breed: "English Bulldog",
      age: "2",
      name: "Jack",
      gender: "Male",
      color: "Brown",
    });
    const petFourty = await createPet({
      breed: "Great Dane",
      age: "7",
      name: "Jackson",
      gender: "Male",
      color: "Gray",
    });
    const petFourtyOne = await createPet({
      breed: "Poodle",
      age: "3",
      name: "Jake",
      gender: "Male",
      color: "White",
    });
    const petFourtyTwo = await createPet({
      breed: "Pitbull",
      age: "8",
      name: "Molly",
      gender: "Female",
      color: "Brown",
    });
    const petFourtyThree = await createPet({
      breed: "Rottweiler",
      age: "5",
      name: "Nala",
      gender: "Female",
      color: "Brown",
    });
    const petFourtyFour = await createPet({
      breed: "Pomeranian",
      age: "2",
      name: "Nikki",
      gender: "Female",
      color: "White",
    });
    const petFourtyFive = await createPet({
      breed: "Dobermann",
      age: "3",
      name: "Olive",
      gender: "Female",
      color: "Brown",
    });
    const petFourtySix = await createPet({
      breed: "Basset Hound",
      age: "9",
      name: "Peanut",
      gender: "Female",
      color: "Brown",
    });
    const petFourtySeven = await createPet({
      breed: "Irish Setter",
      age: "3",
      name: "Pebbles",
      gender: "Female",
      color: "Brown",
    });
    const petFiourtyEight = await createPet({
      breed: "Dalmatian",
      age: "7",
      name: "Penny",
      gender: "Female",
      color: "White",
    });
    const petFourtyNine = await createPet({
      breed: "Sheltie",
      age: "5",
      name: "Pepper",
      gender: "Female",
      color: "Brown",
    });
    const petFifty = await createPet({
      breed: "Corgi",
      age: "4",
      name: "Luke",
      gender: "Male",
      color: "Brown",
    });
    const petFiftyOne = await createPet({
      breed: "French Bulldog",
      age: "11",
      name: "Mac",
      gender: "Male",
      color: "Black",
    });
    const petFiftyTwo = await createPet({
      breed: "Italian Greyhound",
      age: "17",
      name: "Marley",
      gender: "Male",
      color: "Gray",
    });
    const petFiftyThree = await createPet({
      breed: "German Shepherd",
      age: "13",
      name: "Max",
      gender: "Male",
      color: "Brown",
    });
    const petFiftyFour = await createPet({
      breed: "Collie",
      age: "14",
      name: "Mickey",
      gender: "Male",
      color: "Brown",
    });
    const petFiftyFive = await createPet({
      breed: "Labrador",
      age: "5",
      name: "Milo",
      gender: "Male",
      color: "Gold",
    });
    const petFiftySix = await createPet({
      breed: "Yorkie",
      age: "2",
      name: "Moose",
      gender: "Male",
      color: "Brown",
    });
    const petFiftySeven = await createPet({
      breed: "Terrier",
      age: "3",
      name: "Murphy",
      gender: "Male",
      color: "Brown",
    });
    const petFiftyEight = await createPet({
      breed: "English Bulldog",
      age: "2",
      name: "Oliver",
      gender: "Male",
      color: "White",
    });
    const petFiftyNine = await createPet({
      breed: "Great Dane",
      age: "8",
      name: "Ollie",
      gender: "Male",
      color: "Gray",
    });
    const petSixty = await createPet({
      breed: "Poodle",
      age: "6",
      name: "Oreo",
      gender: "Male",
      color: "Black",
    });
    const petSixtyOne = await createPet({
      breed: "Pitbull",
      age: "11",
      name: "Oscar",
      gender: "Male",
      color: "Black",
    });
    const petSixtyTwo = await createPet({
      breed: "Rottweiler",
      age: "5",
      name: "Princess",
      gender: "Female",
      color: "Brown",
    });
    const petSixtyThree = await createPet({
      breed: "Pomeranian",
      age: "15",
      name: "Riley",
      gender: "Female",
      color: "White",
    });
    const petSixtyFour = await createPet({
      breed: "Dobermann",
      age: "7",
      name: "Rosie",
      gender: "Female",
      color: "Brown",
    });
    const petSixtyFive = await createPet({
      breed: "Basset Hound",
      age: "13",
      name: "Roxie",
      gender: "Female",
      color: "Brown",
    });
    const petSixtySix = await createPet({
      breed: "Irish Setter",
      age: "7",
      name: "Roxy",
      gender: "Female",
      color: "Brown",
    });
    const petSixtySeven = await createPet({
      breed: "Dalmatian",
      age: "2",
      name: "Ruby",
      gender: "Female",
      color: "White",
    });
    const petSixtyEight = await createPet({
      breed: "Sheltie",
      age: "6",
      name: "Sadie",
      gender: "Female",
      color: "Brown",
    });
    const petSixtyNine = await createPet({
      breed: "Corgi",
      age: "7",
      name: "Sally",
      gender: "Female",
      color: "Brown",
    });
    const petSeventy = await createPet({
      breed: "French Bulldog",
      age: "7",
      name: "Sandy",
      gender: "Female",
      color: "Gray",
    });
    const petSeventyOne = await createPet({
      breed: "Italian Greyhound",
      age: "2",
      name: "Sasha",
      gender: "Female",
      color: "Gray",
    });
    const petSeventyTwo = await createPet({
      breed: "German Shepherd",
      age: "1",
      name: "Sassy",
      gender: "Female",
      color: "Brown",
    });
    const petSeventyThree = await createPet({
      breed: "Collie",
      age: "1",
      name: "Scout",
      gender: "Male",
      color: "Brown",
    });
    const petSeventyFour = await createPet({
      breed: "Labrador",
      age: "14",
      name: "Shadow",
      gender: "Male",
      color: "Gold",
    });
    const petSeventyFive = await createPet({
      breed: "Yorkie",
      age: "12",
      name: "Shelby",
      gender: "Female",
      color: "Brown",
    });
    const petSeventySix = await createPet({
      breed: "Terrier",
      age: "7",
      name: "Sierra",
      gender: "female",
      color: "Brown",
    });
    const petSeventySeven = await createPet({
      breed: "English Bulldog",
      age: "5",
      name: "Scooter",
      gender: "Male",
      color: "Brown",
    });
    const petSeventyEight = await createPet({
      breed: "Great Dane",
      age: "9",
      name: "Scout",
      gender: "Male",
      color: "Gray",
    });
    const petSeventyNine = await createPet({
      breed: "Poodle",
      age: "9",
      name: "Shadow",
      gender: "Male",
      color: "White",
    });
    const petEighty = await createPet({
      breed: "Pitbull",
      age: "3",
      name: "Simba",
      gender: "Male",
      color: "Black",
    });
    const petEightyOne = await createPet({
      breed: "Rottweiler",
      age: "4",
      name: "Sparky",
      gender: "Male",
      color: "Brown",
    });
    const petEightyTwo = await createPet({
      breed: "Pomeranian",
      age: "5",
      name: "Spike",
      gender: "Male",
      color: "White",
    });
    const petEightyThree = await createPet({
      breed: "Dobermann",
      age: "7",
      name: "Tank",
      gender: "Male",
      color: "Brown",
    });
    const petEightyFour = await createPet({
      breed: "Basset Hound",
      age: "8",
      name: "Teddy",
      gender: "Male",
      color: "Brown",
    });
    const petEightyFive = await createPet({
      breed: "Irish Setter",
      age: "9",
      name: "Thor",
      gender: "Male",
      color: "Brown",
    });
    const petEightySix = await createPet({
      breed: "Dalmatian",
      age: "2",
      name: "Toby",
      gender: "Male",
      color: "White",
    });
    const petEightySeven = await createPet({
      breed: "Sheltie",
      age: "3",
      name: "Tucker",
      gender: "Male",
      color: "Brown",
    });
    const petEightyEight = await createPet({
      breed: "Corgi",
      age: "7",
      name: "Tyson",
      gender: "Male",
      color: "Brown",
    });
    const petEightNine = await createPet({
      breed: "French Bulldog",
      age: "9",
      name: "Vader",
      gender: "Male",
      color: "Gray",
    });
    const petNinety = await createPet({
      breed: "Italian Greyhound",
      age: "3",
      name: "Winston",
      gender: "Male",
      color: "Gray",
    });
    const petNinetyOne = await createPet({
      breed: "German Shepherd",
      age: "7",
      name: "Yoda",
      gender: "Male",
      color: "Brown",
    });
    const petNinetyTwo = await createPet({
      breed: "German Shepherd",
      age: "3",
      name: "Sam",
      gender: "Male",
      color: "Brown",
    });
    const petNinetyThree = await createPet({
      breed: "Labrador",
      age: "2",
      name: "Girlie",
      gender: "Female",
      color: "Black",
    });
    const petNinetyFour = await createPet({
      breed: "Poodle",
      age: "9",
      name: "Dude",
      gender: "Male",
      color: "White",
    });
    const petNinetyFive = await createPet({
      breed: "Poodle",
      age: "7",
      name: "Bailey",
      gender: "Male",
      color: "Gray",
    });
    const petNinetySix = await createPet({
      breed: "Terrier",
      age: "3",
      name: "Lilly",
      gender: "Female",
      color: "Brown",
    });
    const petNinetySeven = await createPet({
      breed: "Yorkie",
      age: "2",
      name: "Max",
      gender: "Male",
      color: "Brown",
    });
    const petNinetyEight = await createPet({
      breed: "Corgi",
      age: "8",
      name: "Maxene",
      gender: "Female",
      color: "Brown",
    });
    const petNinetyNine = await createPet({
      breed: "Yorkie",
      age: "11",
      name: "Hope",
      gender: "Female",
      color: "Brown",
    });
    const petOneHundred = await createPet({
      breed: "Dalmation",
      age: "12",
      name: "Deville",
      gender: "Male",
      color: "White",
=======
      name: 'Frenchie',
      breed: 'French Bulldog',
      age: '5',
      gender: 'Female',
      color: 'Brindle',
    });
    const petTwo = await createPet({
      name: 'Vinnie',
      breed: 'Italian Greyhound',
      age: '2',
      gender: 'Male',
      color: 'Gray',
    });
    const petThree = await createPet({
      name: 'Maxx',
      breed: 'German Shepherd',
      age: '8',
      gender: 'Female',
      color: 'Gold',
>>>>>>> 7222da590f370bebf224b11a76fc289d7dbffba7
    });
    const petFour = await createPet({
      breed: 'French Bulldog',
      age: '2',
      name: 'Ace',
      gender: 'Male',
      color: 'Black',
    });
    const petFive = await createPet({
      breed: 'Italian Greyhound',
      age: '4',
      name: 'Apollo',
      gender: 'Male',
      color: 'Gray',
    });
    const petSix = await createPet({
      breed: 'German Shepherd',
      age: '6',
      name: 'Bailey',
      gender: 'Male',
      color: 'Brown',
    });
    const petSeven = await createPet({
      breed: 'Collie',
      age: '2',
      name: 'Bandit',
      gender: 'Male',
      color: 'Gold',
    });
    const petEight = await createPet({
      breed: 'Labrador',
      age: '8',
      name: 'Baxter',
      gender: 'Male',
      color: 'Black',
    });
    const petNine = await createPet({
      breed: 'Yorkie',
      age: '10',
      name: 'Bear',
      gender: 'Male',
      color: 'Brown',
    });
    const petTen = await createPet({
      breed: 'Terrier',
      age: '13',
      name: 'Beau',
      gender: 'Male',
      color: 'Brown',
    });
    const petEleven = await createPet({
      breed: 'English Bulldog',
      age: '16',
      name: 'Benji',
      gender: 'Male',
      color: 'White',
    });
    const petTwelve = await createPet({
      breed: 'Great Dane',
      age: '3',
      name: 'Benny',
      gender: 'Male',
      color: 'Gray',
    });
    const petThirteen = await createPet({
      breed: 'Poodle',
      age: '11',
      name: 'Izzy',
      gender: 'Female',
      color: 'Black',
    });
    const petFourteen = await createPet({
      breed: 'Pitbull',
      age: '6',
      name: 'Jasmine',
      gender: 'Female',
      color: 'Gray',
    });
    const petFifteen = await createPet({
      breed: 'Rottweiler',
      age: '9',
      name: 'Josie',
      gender: 'Female',
      color: 'Brown',
    });
    const petSixteen = await createPet({
      breed: 'Pomeranian',
      age: '2',
      name: 'Katie',
      gender: 'Female',
      color: 'White',
    });
    const petSeventeen = await createPet({
      breed: 'Dobermann',
      age: '5',
      name: 'Kona',
      gender: 'Female',
      color: 'Brown',
    });
    const petEighteen = await createPet({
      breed: 'Basset Hound',
      age: '8',
      name: 'Lacey',
      gender: 'Female',
      color: 'Brown',
    });
    const petNineteen = await createPet({
      breed: 'Irish Setter',
      age: '13',
      name: 'Lady',
      gender: 'Female',
      color: 'Brown',
    });
    const petTwenty = await createPet({
      breed: 'Dalmatian',
      age: '16',
      name: 'Layla',
      gender: 'Female',
      color: 'White',
    });
    const petTwentyOne = await createPet({
      breed: 'Sheltie',
      age: '13',
      name: 'Lexi',
      gender: 'Female',
      color: 'Brown',
    });
    const petTwentyTwo = await createPet({
      breed: 'Corgi',
      age: '7',
      name: 'Lexie',
      gender: 'Female',
      color: 'Brown',
    });
    const petTwentyThree = await createPet({
      breed: 'French Bulldog',
      age: '9',
      name: 'Lilly',
      gender: 'Female',
      color: 'Gray',
    });
    const petTwentyFour = await createPet({
      breed: 'Italian Greyhound',
      age: '2',
      name: 'Lily',
      gender: 'Female',
      color: 'Gray',
    });
    const petTwentyFive = await createPet({
      breed: 'German Shepherd',
      age: '3',
      name: 'Lola',
      gender: 'Female',
      color: 'Brown',
    });
    const petTwentySix = await createPet({
      breed: 'Collie',
      age: '18',
      name: 'Lucky',
      gender: 'Female',
      color: 'Brown',
    });
    const petTwentySeven = await createPet({
      breed: 'Labrador',
      age: '4',
      name: 'Lucy',
      gender: 'Female',
      color: 'Black',
    });
    const petTwentyEight = await createPet({
      breed: 'Yorkie',
      age: '9',
      name: 'Lulu',
      gender: 'Female',
      color: 'Brown',
    });
    const petTwentyNine = await createPet({
      breed: 'Terrier',
      age: '2',
      name: 'Luna',
      gender: 'Female',
      color: 'Brown',
    });
    const petThirty = await createPet({
      breed: 'Sheltie',
      age: '13',
      name: 'Frankie',
      gender: 'Male',
      color: 'Brown',
    });
    const petThirtyOne = await createPet({
      breed: 'Corgi',
      age: '2',
      name: 'George',
      gender: 'Male',
      color: 'Brown',
    });
    const petThirtyTwo = await createPet({
      breed: 'French Bulldog',
      age: '10',
      name: 'Gizmo',
      gender: 'Male',
      color: 'Gray',
    });
    const petThirtyThree = await createPet({
      breed: 'Italian Greyhound',
      age: '12',
      name: 'Gunner',
      gender: 'Male',
      color: 'Gray',
    });
    const petThirtyFour = await createPet({
      breed: 'German Shepherd',
      age: '6',
      name: 'Gus',
      gender: 'Male',
      color: 'Brown',
    });
    const petThirtyFive = await createPet({
      breed: 'Collie',
      age: '2',
      name: 'Hank',
      gender: 'Male',
      color: 'Brown',
    });
    const petThirtySix = await createPet({
      breed: 'Labrador',
      age: '8',
      name: 'Harley',
      gender: 'Male',
      color: 'Brown',
    });
    const petThirtySeven = await createPet({
      breed: 'Yorkie',
      age: '9',
      name: 'Henry',
      gender: 'Male',
      color: 'Brown',
    });
    const petThirtyEight = await createPet({
      breed: 'Terrier',
      age: '13',
      name: 'Hunter',
      gender: 'Male',
      color: 'Brown',
    });
    const petThirtyNine = await createPet({
      breed: 'English Bulldog',
      age: '2',
      name: 'Jack',
      gender: 'Male',
      color: 'Brown',
    });
    const petFourty = await createPet({
      breed: 'Great Dane',
      age: '7',
      name: 'Jackson',
      gender: 'Male',
      color: 'Gray',
    });
    const petFourtyOne = await createPet({
      breed: 'Poodle',
      age: '3',
      name: 'Jake',
      gender: 'Male',
      color: 'White',
    });
    const petFourtyTwo = await createPet({
      breed: 'Pitbull',
      age: '8',
      name: 'Molly',
      gender: 'Female',
      color: 'Brown',
    });
    const petFourtyThree = await createPet({
      breed: 'Rottweiler',
      age: '5',
      name: 'Nala',
      gender: 'Female',
      color: 'Brown',
    });
    const petFourtyFour = await createPet({
      breed: 'Pomeranian',
      age: '2',
      name: 'Nikki',
      gender: 'Female',
      color: 'White',
    });
    const petFourtyFive = await createPet({
      breed: 'Dobermann',
      age: '3',
      name: 'Olive',
      gender: 'Female',
      color: 'Brown',
    });
    const petFourtySix = await createPet({
      breed: 'Basset Hound',
      age: '9',
      name: 'Peanut',
      gender: 'Female',
      color: 'Brown',
    });
    const petFourtySeven = await createPet({
      breed: 'Irish Setter',
      age: '3',
      name: 'Pebbles',
      gender: 'Female',
      color: 'Brown',
    });
    const petFiourtyEight = await createPet({
      breed: 'Dalmatian',
      age: '7',
      name: 'Penny',
      gender: 'Female',
      color: 'White',
    });
    const petFourtyNine = await createPet({
      breed: 'Sheltie',
      age: '5',
      name: 'Pepper',
      gender: 'Female',
      color: 'Brown',
    });
    const petFifty = await createPet({
      breed: 'Corgi',
      age: '4',
      name: 'Luke',
      gender: 'Male',
      color: 'Brown',
    });
    const petFiftyOne = await createPet({
      breed: 'French Bulldog',
      age: '11',
      name: 'Mac',
      gender: 'Male',
      color: 'Black',
    });
    const petFiftyTwo = await createPet({
      breed: 'Italian Greyhound',
      age: '17',
      name: 'Marley',
      gender: 'Male',
      color: 'Gray',
    });
    const petFiftyThree = await createPet({
      breed: 'German Shepherd',
      age: '13',
      name: 'Max',
      gender: 'Male',
      color: 'Brown',
    });
    const petFiftyFour = await createPet({
      breed: 'Collie',
      age: '14',
      name: 'Mickey',
      gender: 'Male',
      color: 'Brown',
    });
    const petFiftyFive = await createPet({
      breed: 'Labrador',
      age: '5',
      name: 'Milo',
      gender: 'Male',
      color: 'Gold',
    });
    const petFiftySix = await createPet({
      breed: 'Yorkie',
      age: '2',
      name: 'Moose',
      gender: 'Male',
      color: 'Brown',
    });
    const petFiftySeven = await createPet({
      breed: 'Terrier',
      age: '3',
      name: 'Murphy',
      gender: 'Male',
      color: 'Brown',
    });
    const petFiftyEight = await createPet({
      breed: 'English Bulldog',
      age: '2',
      name: 'Oliver',
      gender: 'Male',
      color: 'White',
    });
    const petFiftyNine = await createPet({
      breed: 'Great Dane',
      age: '8',
      name: 'Ollie',
      gender: 'Male',
      color: 'Gray',
    });
    const petSixty = await createPet({
      breed: 'Poodle',
      age: '6',
      name: 'Oreo',
      gender: 'Male',
      color: 'Black',
    });
    const petSixtyOne = await createPet({
      breed: 'Pitbull',
      age: '11',
      name: 'Oscar',
      gender: 'Male',
      color: 'Black',
    });
    const petSixtyTwo = await createPet({
      breed: 'Rottweiler',
      age: '5',
      name: 'Princess',
      gender: 'Female',
      color: 'Brown',
    });
    const petSixtyThree = await createPet({
      breed: 'Pomeranian',
      age: '15',
      name: 'Riley',
      gender: 'Female',
      color: 'White',
    });
    const petSixtyFour = await createPet({
      breed: 'Dobermann',
      age: '7',
      name: 'Rosie',
      gender: 'Female',
      color: 'Brown',
    });
    const petSixtyFive = await createPet({
      breed: 'Basset Hound',
      age: '13',
      name: 'Roxie',
      gender: 'Female',
      color: 'Brown',
    });
    const petSixtySix = await createPet({
      breed: 'Irish Setter',
      age: '7',
      name: 'Roxy',
      gender: 'Female',
      color: 'Brown',
    });
    const petSixtySeven = await createPet({
      breed: 'Dalmatian',
      age: '2',
      name: 'Ruby',
      gender: 'Female',
      color: 'White',
    });
    const petSixtyEight = await createPet({
      breed: 'Sheltie',
      age: '6',
      name: 'Sadie',
      gender: 'Female',
      color: 'Brown',
    });
    const petSixtyNine = await createPet({
      breed: 'Corgi',
      age: '7',
      name: 'Sally',
      gender: 'Female',
      color: 'Brown',
    });
    const petSeventy = await createPet({
      breed: 'French Bulldog',
      age: '7',
      name: 'Sandy',
      gender: 'Female',
      color: 'Gray',
    });
    const petSeventyOne = await createPet({
      breed: 'Italian Greyhound',
      age: '2',
      name: 'Sasha',
      gender: 'Female',
      color: 'Gray',
    });
    const petSeventyTwo = await createPet({
      breed: 'German Shepherd',
      age: '1',
      name: 'Sassy',
      gender: 'Female',
      color: 'Brown',
    });
    const petSeventyThree = await createPet({
      breed: 'Collie',
      age: '1',
      name: 'Scout',
      gender: 'Male',
      color: 'Brown',
    });
    const petSeventyFour = await createPet({
      breed: 'Labrador',
      age: '14',
      name: 'Shadow',
      gender: 'Male',
      color: 'Gold',
    });
    const petSeventyFive = await createPet({
      breed: 'Yorkie',
      age: '12',
      name: 'Shelby',
      gender: 'Female',
      color: 'Brown',
    });
    const petSeventySix = await createPet({
      breed: 'Terrier',
      age: '7',
      name: 'Sierra',
      gender: 'female',
      color: 'Brown',
    });
    const petSeventySeven = await createPet({
      breed: 'English Bulldog',
      age: '5',
      name: 'Scooter',
      gender: 'Male',
      color: 'Brown',
    });
    const petSeventyEight = await createPet({
      breed: 'Great Dane',
      age: '9',
      name: 'Scout',
      gender: 'Male',
      color: 'Gray',
    });
    const petSeventyNine = await createPet({
      breed: 'Poodle',
      age: '9',
      name: 'Shadow',
      gender: 'Male',
      color: 'White',
    });
    const petEighty = await createPet({
      breed: 'Pitbull',
      age: '3',
      name: 'Simba',
      gender: 'Male',
      color: 'Black',
    });
    const petEightyOne = await createPet({
      breed: 'Rottweiler',
      age: '4',
      name: 'Sparky',
      gender: 'Male',
      color: 'Brown',
    });
    const petEightyTwo = await createPet({
      breed: 'Pomeranian',
      age: '5',
      name: 'Spike',
      gender: 'Male',
      color: 'White',
    });
    const petEightyThree = await createPet({
      breed: 'Dobermann',
      age: '7',
      name: 'Tank',
      gender: 'Male',
      color: 'Brown',
    });
    const petEightyFour = await createPet({
      breed: 'Basset Hound',
      age: '8',
      name: 'Teddy',
      gender: 'Male',
      color: 'Brown',
    });
    const petEightyFive = await createPet({
      breed: 'Irish Setter',
      age: '9',
      name: 'Thor',
      gender: 'Male',
      color: 'Brown',
    });
    const petEightySix = await createPet({
      breed: 'Dalmatian',
      age: '2',
      name: 'Toby',
      gender: 'Male',
      color: 'White',
    });
    const petEightySeven = await createPet({
      breed: 'Sheltie',
      age: '3',
      name: 'Tucker',
      gender: 'Male',
      color: 'Brown',
    });
    const petEightyEight = await createPet({
      breed: 'Corgi',
      age: '7',
      name: 'Tyson',
      gender: 'Male',
      color: 'Brown',
    });
    const petEightNine = await createPet({
      breed: 'French Bulldog',
      age: '9',
      name: 'Vader',
      gender: 'Male',
      color: 'Gray',
    });
    const petNinety = await createPet({
      breed: 'Italian Greyhound',
      age: '3',
      name: 'Winston',
      gender: 'Male',
      color: 'Gray',
    });
    const petNinetyOne = await createPet({
      breed: 'German Shepherd',
      age: '7',
      name: 'Yoda',
      gender: 'Male',
      color: 'Brown',
    });
    const petNinetyTwo = await createPet({
      breed: 'German Shepherd',
      age: '3',
      name: 'Sam',
      gender: 'Male',
      color: 'Brown',
    });
    const petNinetyThree = await createPet({
      breed: 'Labrador',
      age: '2',
      name: 'Girlie',
      gender: 'Female',
      color: 'Black',
    });
    const petNinetyFour = await createPet({
      breed: 'Poodle',
      age: '9',
      name: 'Dude',
      gender: 'Male',
      color: 'White',
    });
    const petNinetyFive = await createPet({
      breed: 'Poodle',
      age: '7',
      name: 'Bailey',
      gender: 'Male',
      color: 'Gray',
    });
    const petNinetySix = await createPet({
      breed: 'Terrier',
      age: '3',
      name: 'Lilly',
      gender: 'Female',
      color: 'Brown',
    });
    const petNinetySeven = await createPet({
      breed: 'Yorkie',
      age: '2',
      name: 'Max',
      gender: 'Male',
      color: 'Brown',
    });
    const petNinetyEight = await createPet({
      breed: 'Corgi',
      age: '8',
      name: 'Maxene',
      gender: 'Female',
      color: 'Brown',
    });
    const petNinetyNine = await createPet({
      breed: 'Yorkie',
      age: '11',
      name: 'Hope',
      gender: 'Female',
      color: 'Brown',
    });
    const petOneHundred = await createPet({
      breed: 'Dalmation',
      age: '12',
      name: 'Deville',
      gender: 'Male',
      color: 'White',
    });

    console.log("Great Success!");
    return [petOne, petTwo, petThree];
  } catch (error) {
    console.error("Error during pet creation");
    throw error;
  }
}

async function populateInitialData() {
  try {
    console.log("Filling database with initial pet data");
    await createInitialPets();
    console.log("Getting all pets: \n", await getPets());
    console.log("Filled pet database");
    console.log("Finished filling pet database");
  } catch (error) {
    throw error;
  }
}

buildTables()
  .then(populateInitialData)
  .catch(console.error)
  .finally(() => client.end());
