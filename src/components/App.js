import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Header, Home, Cart } from '.';

const App = () => {
  const [pets, setPets] = useState([]);
  const [show, setShow] = useState(false);

  return (
    <>
      <Header pets={pets} setPets={setPets} />
      <Home pets={pets} setPets={setPets} />

      <Cart show={show} setShow={setShow} />



    </>
  );
};

export default App;
