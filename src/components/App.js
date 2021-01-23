import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import { Header, Home } from ".";

import { getPets } from "../api";

const App = () => {
  //const [message, setMessage] = useState('');
  const [pets, setPets] = useState([]);

  // useEffect(() => {
  //   getSomething()
  //     .then((response) => {
  //       setMessage(response.message);
  //     })
  //     .catch((error) => {
  //       setMessage(error.message);
  //     });
  // });

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

  // return (
  //   <div className='App'>
  //     <h1>Hello, World!</h1>
  //     {pets.map((pet) => (
  //       <div>({pet.breed})</div>
  //     ))}
  //   </div>
  // );

  return (
    <div>
      {pets.map((pet) => (
        <Card key={pet.breed + pet.id} className="card">
          <Card.Header as="h5">{pet.name}</Card.Header>
          <Card.Body>
            <Card.Text>Breed: {pet.breed}</Card.Text>
            <Card.Text>Age: {pet.age}</Card.Text>
            <Card.Text>Gender: {pet.gender}</Card.Text>
            <Card.Text>Color: {pet.color}</Card.Text>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
};

export default App;
