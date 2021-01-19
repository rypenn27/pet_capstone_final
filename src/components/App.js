import React, { useState, useEffect } from 'react';
import { Header, Home } from '.';

import { getSomething } from '../api';

const App = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    getSomething()
      .then((response) => {
        setMessage(response.message);
      })
      .catch((error) => {
        setMessage(error.message);
      });
  });

  return (
    <div className='App'>
      <h1>Hello, World!</h1>
      <h2>{message}</h2>
    </div>
  );
};

export default App;
