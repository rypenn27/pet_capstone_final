import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { getPets } from '../api';

const Search = (props) => {
  const pets = props.pets;
  const setPets = props.setPets;

  const [searchQuery, setSearchQuery] = useState('');
  const [copyOfPets, setCopyOfPets] = useState([]);

  useEffect(() => {
    getPets()
      .then((pets) => {
        setCopyOfPets(pets);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function petFilter(query) {
    const filteredPets = [];

    pets.map((pet) => {
      let b = pet.breed;
      let breed = b.toLowerCase();

      let q = query.toLowerCase();

      if (breed.split(' ').includes(q)) {
        filteredPets.push(pet);
        setPets(filteredPets);
      }
    });

    return filteredPets;
  }

  return (
    <>
      <div className='searching'>
        <Form.Control
          className='search'
          type='text'
          value={searchQuery}
          onChange={(e) => {
            e.preventDefault();
            setSearchQuery(e.target.value);
            if (e.target.value === '') {
              setPets(copyOfPets);
            }
          }}
          placeholder='Search Breeds...'
        />
        <br />
        <Button
          className='searchButton'
          variant='primary'
          onClick={(e) => petFilter(searchQuery)}
        >
          Search
        </Button>
      </div>
    </>
  );
};

export default Search;
