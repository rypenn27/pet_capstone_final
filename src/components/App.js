import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Header, Home } from '.';

const App = () => {
  const [pets, setPets] = useState([]);

  return (
    <>
      <Header pets={pets} setPets={setPets} />
      <Home pets={pets} setPets={setPets} />
    </>
  );
};

export default App;
