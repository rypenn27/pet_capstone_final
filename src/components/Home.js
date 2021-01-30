import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import corgi from './corgi.jpg';
import yorkie from './yorkie.jpg';
import sheltie from './sheltie.jpg';
import irishSetter from './irishSetter.jpg';
import dalmatian from './dalmatian.jpg';
import bassetHound from './bassetHound.jpg';
import dobermann from './dobermann.jpg';
import pomeranian from './pomeranian.jpg';
import rottweiler from './rottweiler.jpg';
import pitbull from './pitbull.jpg';
import poodle from './poodle.jpg';
import greatDane from './greatDane.jpg';
import labrador from './labrador.jpg';
import collie from './collie.jpg';
import germanShepherd from './germanShepherd.jpg';
import italianGreyhound from './italianGreyhound.jpg';
import frenchBulldog from './frenchBulldog.jpg';
import englishBulldog from './englishBulldog.jpg';
import terrier from './terrier.jpg';

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
          {pet.breed === 'Corgi' ? (
            <Card.Img variant='top' src={corgi} />
          ) : pet.breed === 'Yorkie' ? (
            <Card.Img variant='top' src={yorkie} />
          ) : pet.breed === 'Sheltie' ? (
            <Card.Img variant='top' src={sheltie} />
          ) : pet.breed === 'Irish Setter' ? (
            <Card.Img variant='top' src={irishSetter} />
          ) : pet.breed === 'Dalmatian' ? (
            <Card.Img variant='top' src={dalmatian} />
          ) : pet.breed === 'Basset Hound' ? (
            <Card.Img variant='top' src={bassetHound} />
          ) : pet.breed === 'Dobermann' ? (
            <Card.Img variant='top' src={dobermann} />
          ) : pet.breed === 'Pomeranian' ? (
            <Card.Img variant='top' src={pomeranian} />
          ) : pet.breed === 'Rottweiler' ? (
            <Card.Img variant='top' src={rottweiler} />
          ) : pet.breed === 'Pitbull' ? (
            <Card.Img variant='top' src={pitbull} />
          ) : pet.breed === 'Poodle' ? (
            <Card.Img variant='top' src={poodle} />
          ) : pet.breed === 'Great Dane' ? (
            <Card.Img variant='top' src={greatDane} />
          ) : pet.breed === 'Labrador' ? (
            <Card.Img variant='top' src={labrador} />
          ) : pet.breed === 'Collie' ? (
            <Card.Img variant='top' src={collie} />
          ) : pet.breed === 'German Shepherd' ? (
            <Card.Img variant='top' src={germanShepherd} />
          ) : pet.breed === 'Italian Greyhound' ? (
            <Card.Img variant='top' src={italianGreyhound} />
          ) : pet.breed === 'French Bulldog' ? (
            <Card.Img variant='top' src={frenchBulldog} />
          ) : pet.breed === 'English Bulldog' ? (
            <Card.Img variant='top' src={englishBulldog} />
          ) : pet.breed === 'Terrier' ? (
            <Card.Img variant='top' src={terrier} />
          ) : (
            <Card.Img variant='top' src='...' />
          )}

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
            <Button variant='flat'>
              Adopt Me! <i class='fas fa-dog'></i>
            </Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
};
export default Home;
