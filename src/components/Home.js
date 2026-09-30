import React, { useEffect, useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

import { getPets, errorMessage } from '../api';
import { useApp } from './AppContext';
import { Search, AdoptModal } from '.';
import { petImage } from './petImages';
import { money } from './format';

const Home = () => {
  const { user, cart } = useApp();
  const history = useHistory();
  const location = useLocation();
  const [pets, setPets] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [added, setAdded] = useState(null);

  useEffect(() => {
    setLoading(true);
    getPets(search)
      .then((result) => {
        setPets(result);
        setError('');
      })
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, [search]);

  const inBasket = new Set(cart.items.map((item) => item.id));

  const handleAdopt = (pet) => {
    setAdded(null);
    if (!user) {
      history.push('/login', { from: location.pathname, message: 'Log in to adopt a pet.' });
      return;
    }
    setSelected(pet);
  };

  const handleAdded = (pet) => {
    setSelected(null);
    setAdded(pet);
  };

  return (
    <div>
      <div className='catalog-top'>
        <div>
          <h1 className='page-title'>Adoptable pets</h1>
          <p className='text-muted mb-0'>
            {loading ? 'Loading...' : `${pets.length} ${pets.length === 1 ? 'pet' : 'pets'} looking for a home`}
            {search && ` matching "${search}"`}
          </p>
        </div>
        <Search onSearch={setSearch} />
      </div>

      {added && (
        <Alert variant='success' onClose={() => setAdded(null)} dismissible>
          <strong>{added.name}</strong> was added to your basket.{' '}
          <Link to='/basket'>View basket and check out</Link>
        </Alert>
      )}
      {error && <Alert variant='danger'>{error}</Alert>}

      {loading ? (
        <div className='page-loading'>
          <Spinner animation='border' />
        </div>
      ) : (
        <div className='pet-grid'>
          {pets.map((pet) => (
            <Card key={pet.id} className='pet-card'>
              <Card.Img variant='top' src={petImage(pet.breed)} alt={pet.breed} />
              <Card.Body>
                <div className='pet-card-title'>
                  <Card.Title className='petName'>{pet.name}</Card.Title>
                  <span className='price'>{money(pet.price)}</span>
                </div>
                <Card.Text className='pet-facts'>
                  {pet.breed} · {pet.age} {pet.age === 1 ? 'yr' : 'yrs'} · {pet.gender} · {pet.color}
                </Card.Text>
              </Card.Body>
              <Card.Footer>
                {inBasket.has(pet.id) ? (
                  <Button variant='outline-brand' block onClick={() => history.push('/basket')}>
                    <i className='fas fa-check'></i> In your basket
                  </Button>
                ) : (
                  <Button variant='brand' block onClick={() => handleAdopt(pet)}>
                    Adopt Me! <i className='fas fa-dog'></i>
                  </Button>
                )}
              </Card.Footer>
            </Card>
          ))}
        </div>
      )}

      {selected && (
        <AdoptModal pet={selected} onClose={() => setSelected(null)} onAdded={handleAdded} />
      )}
    </div>
  );
};

export default Home;
