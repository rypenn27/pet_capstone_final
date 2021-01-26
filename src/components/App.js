<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Header, Home } from '.';
=======
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

import { Header, Home } from ".";
>>>>>>> 1a766544035cf6972909cc69a0a8b7669fbacf18

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
