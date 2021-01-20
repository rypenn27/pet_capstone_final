import React, { useState, useEffect } from 'react';
import { Header, Home } from '.';

import { getPets } from '../api';

const App = () => {
  //const [message, setMessage] = useState('');
  const [pets, setPets] = useState('');

  // useEffect(() => {
  //   getSomething()
  //     .then((response) => {
  //       setMessage(response.message);
  //     })
  //     .catch((error) => {
  //       setMessage(error.message);
  //     });
  // });

  useEffect(() => {
    getPets()
      .then((response) => {
        console.log(response);
        setPets(response);
      })
      .catch((error) => {
        setPets(error.pets);
      });
  }, []);

  return (
    <div className='App'>
      <h1>Hello, World!</h1>
      {/* {pets.map((pet) => (
        <div>{pet.breed}</div>
      ))} */}
    </div>
  );
};

export default App;
