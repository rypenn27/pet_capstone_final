import React, { useState, useEffect } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';


import corgi from './pet_images/corgi.jpg';
import yorkie from './pet_images/yorkie.jpg';
import sheltie from './pet_images/sheltie.jpg';
import irishSetter from './pet_images/irishSetter.jpg';
import dalmatian from './pet_images/dalmatian.jpg';
import bassetHound from './pet_images/bassetHound.jpg';
import dobermann from './pet_images/dobermann.jpg';
import pomeranian from './pet_images/pomeranian.jpg';
import rottweiler from './pet_images/rottweiler.jpg';
import pitbull from './pet_images/pitbull.jpg';
import poodle from './pet_images/poodle.jpg';
import greatDane from './pet_images/greatDane.jpg';
import labrador from './pet_images/labrador.jpg';
import collie from './pet_images/collie.jpg';
import germanShepherd from './pet_images/germanShepherd.jpg';
import italianGreyhound from './pet_images/italianGreyhound.jpg';
import frenchBulldog from './pet_images/frenchBulldog.jpg';
import englishBulldog from './pet_images/englishBulldog.jpg';
import terrier from './pet_images/terrier.jpg';

import { getPets } from '../api';

import { getPets, createPet } from '../api';





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
              Adopt Me! <i className='fas fa-dog'></i>
            </Button>

            <Button className='likeBtn' variant='flat'>
              {' '}
              ♡{' '}
            </Button>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
};

export default Home;
