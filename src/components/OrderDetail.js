import React, { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card';
import Spinner from 'react-bootstrap/Spinner';
import { getOrder, errorMessage } from '../api';
import { AddressBlock } from './Account';
import { petImage } from './petImages';
import { money, formatDate, cardLabel } from './format';

const OrderDetail = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrder(id)
      .then(setOrder)
      .catch((err) => setError(errorMessage(err)));
  }, [id]);

  if (error) return <Alert variant='danger'>{error}</Alert>;
  if (!order) {
    return (
      <div className='page-loading'>
        <Spinner animation='border' />
      </div>
    );
  }

  const names = order.items.map((item) => item.pet_name);

  return (
    <div className='order-detail'>
      {state && state.justPlaced && (
        <div className='confirmation-banner'>
          <i className='fas fa-heart'></i>
          <div>
            <h1>Congratulations on your adoption!</h1>
            <p className='mb-0'>
              {names.join(' and ')} {names.length === 1 ? 'is' : 'are'} going home with you. A
              receipt for {money(order.total)} was recorded for order #{order.id}.
            </p>
          </div>
        </div>
      )}
      <p>
        <Link to='/orders'>&larr; All adoptions</Link>
      </p>
      <h2 className='page-title'>Order #{order.id}</h2>
      <p className='text-muted'>Placed {formatDate(order.created_at)}</p>

      <div className='basket-layout'>
        <Card className='account-section'>
          <Card.Header>Pets adopted</Card.Header>
          <ul className='basket-list compact'>
            {order.items.map((item) => (
              <li key={item.pet_id} className='basket-item'>
                <img src={petImage(item.breed)} alt={item.breed} />
                <div className='basket-item-info'>
                  <strong className='petName'>{item.pet_name}</strong>
                  <div className='text-muted small'>{item.breed}</div>
                </div>
                <div className='basket-item-price'>{money(item.price)}</div>
              </li>
            ))}
          </ul>
        </Card>
        <aside className='order-summary'>
          <h2>Payment</h2>
          <div className='summary-row total'>
            <span>Total paid</span>
            <span>{money(order.total)}</span>
          </div>
          <p className='mb-2'>{cardLabel(order.card_brand, order.card_last4)}</p>
          <p className='small text-muted text-break'>Stripe payment {order.stripe_payment_intent_id}</p>
          <h2>Billed to</h2>
          <AddressBlock billing={order.billing} />
        </aside>
      </div>
    </div>
  );
};

export default OrderDetail;
