import { Search, Cart } from '.';
import Button from 'react-bootstrap/Button';
import React, { useState, useEffect } from 'react';
import PetIcon from './PetIcon.jpg';
import PetIcon2 from './PetIcon2.jpg';
import PetIcon3 from './PetIcon3.jpeg';

const Header = (props) => {
  const pets = props.pets;
  const setPets = props.setPets;
  const [show, setShow] = useState(false);

  return (
    <header>
      <h1 className='logo'>
        {' '}
        <i className='fas fa-dog'></i> Pet Rescuers
      </h1>
      <h5 className='friend'>Find Your Forever Friend!</h5>
      <div className='pawCart'>
        <Button variant='flat' className='loginnn'>
          {' '}
          Login <i className='fas fa-paw'></i>{' '}
        </Button>

        <Cart show={show} setShow={setShow} />
      </div>
      <div className='images'>
        <img src={PetIcon} alt='PetIcon' />
        <img src={PetIcon2} alt='PetIcon2' />
        <img src={PetIcon3} alt='PetIcon3' />
      </div>
      <Search pets={pets} setPets={setPets} />
    </header>
  );
};

export default Header;
