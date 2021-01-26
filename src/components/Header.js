import { Search } from '.';
import React, { useState, useEffect } from 'react';

import { getSomething } from '../api';

const Header = (props) => {
  const pets = props.pets;
  const setPets = props.setPets;

  return (
    <header>
      <h1 className='logo'>Pet Rescuers</h1>
      <h5>Find Your Forever Friend!</h5>

      <Search pets={pets} setPets={setPets} />
    </header>
  );
};

export default Header;
