import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

import { getPets } from '../api';

const Home = (props) => {
  const pets = props.pets;
  const setPets = props.setPets;

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
    <div className='Home'>
      {pets.map((pet) => (
        <Card key={pet.breed + pet.id} className='card'>
          <Card.Header as='h5'>{pet.name}</Card.Header>
          <Card.Body>
            <Card.Text>Breed: {pet.breed}</Card.Text>
            <Card.Text>Age: {pet.age}</Card.Text>
            <Card.Text>Gender: {pet.gender}</Card.Text>
            <Card.Text>Color: {pet.color}</Card.Text>
          </Card.Body>
          <Card.Footer>
            <style type='text/css'>
              {`
    .btn-flat {
      background-color: blueviolet;
      color: white;
    }
  
    `}
            </style>

            <Button styel='font-size: 2px' variant='flat'>
              Adopt Me! <i class='fas fa-dog'></i>
            </Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
};

export default Home;
