import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { removeFromCart, errorMessage } from '../api';
import { useApp } from './AppContext';
import { petImage } from './petImages';
import { money } from './format';

export const BasketItem = ({ pet, children }) => (
  <li className={`basket-item${pet.available ? '' : ' unavailable'}`}>
    <img src={petImage(pet.breed)} alt={pet.breed} />
    <div className='basket-item-info'>
      <strong className='petName'>{pet.name}</strong>
      <div className='text-muted small'>
        {pet.breed} · {pet.age} {pet.age === 1 ? 'yr' : 'yrs'} · {pet.gender}
      </div>
      {!pet.available && <div className='text-danger small'>Adopted by someone else</div>}
      {children}
    </div>
    <div className='basket-item-price'>{money(pet.price)}</div>
  </li>
);

// The basket page: review pets, remove any, then continue to checkout
const Cart = () => {
  const { cart, setCart, refreshCart } = useApp();
  const history = useHistory();
  const [error, setError] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    refreshCart().catch((err) => setError(errorMessage(err)));
  }, [refreshCart]);

  const handleRemove = async (petId) => {
    setBusyId(petId);
    setError('');
    try {
      setCart(await removeFromCart(petId));
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusyId(null);
  };

  const hasUnavailable = cart.items.some((pet) => !pet.available);

  return (
    <div className='basket-page'>
      <h1 className='page-title'>Your basket</h1>
      {error && <Alert variant='danger'>{error}</Alert>}

      {cart.items.length === 0 ? (
        <div className='empty-state'>
          <i className='fas fa-paw'></i>
          <p>Your basket is empty.</p>
          <Button variant='brand' as={Link} to='/'>
            Find a pet to adopt
          </Button>
        </div>
      ) : (
        <div className='basket-layout'>
          <ul className='basket-list'>
            {cart.items.map((pet) => (
              <BasketItem key={pet.id} pet={pet}>
                <Button
                  variant='link'
                  size='sm'
                  className='p-0 text-danger'
                  disabled={busyId === pet.id}
                  onClick={() => handleRemove(pet.id)}
                >
                  Remove
                </Button>
              </BasketItem>
            ))}
          </ul>
          <aside className='order-summary'>
            <h2>Summary</h2>
            <div className='summary-row'>
              <span>
                Adoption fees ({cart.items.filter((p) => p.available).length}{' '}
                {cart.items.length === 1 ? 'pet' : 'pets'})
              </span>
              <span>{money(cart.total)}</span>
            </div>
            <div className='summary-row'>
              <span>Sales tax</span>
              <span>{money(0)}</span>
            </div>
            <div className='summary-row total'>
              <span>Total</span>
              <span>{money(cart.total)}</span>
            </div>
            {hasUnavailable && (
              <Alert variant='warning' className='small'>
                Remove pets that were already adopted to continue.
              </Alert>
            )}
            <Button variant='brand' block disabled={hasUnavailable} onClick={() => history.push('/checkout')}>
              Proceed to checkout
            </Button>
            <Button variant='link' block as={Link} to='/'>
              Keep looking
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Cart;
