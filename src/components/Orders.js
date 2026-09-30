import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { getOrders, errorMessage } from '../api';
import { money, formatDate, cardLabel } from './format';

const Orders = () => {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch((err) => setError(errorMessage(err)));
  }, []);

  if (error) return <Alert variant='danger'>{error}</Alert>;
  if (!orders) {
    return (
      <div className='page-loading'>
        <Spinner animation='border' />
      </div>
    );
  }

  return (
    <div>
      <h1 className='page-title'>My adoptions</h1>
      {orders.length === 0 ? (
        <div className='empty-state'>
          <i className='fas fa-home'></i>
          <p>You haven't adopted any pets yet.</p>
          <Button variant='brand' as={Link} to='/'>
            Meet the pets
          </Button>
        </div>
      ) : (
        <ul className='order-list'>
          {orders.map((order) => (
            <li key={order.id}>
              <Link to={`/orders/${order.id}`} className='order-row'>
                <div>
                  <strong>Order #{order.id}</strong>
                  <div className='text-muted small'>
                    {formatDate(order.created_at)} · {cardLabel(order.card_brand, order.card_last4)}
                  </div>
                  <div>{order.items.map((item) => item.pet_name).join(', ')}</div>
                </div>
                <div className='order-row-total'>{money(order.total)}</div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Orders;
