import React, { useEffect, useState } from 'react';
import { Link, Redirect, useHistory } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';

import { getAccount, checkout, completeCheckout, errorMessage } from '../api';
import { useApp } from './AppContext';
import { BillingForm, AddCardForm } from '.';
import { AddressBlock, CardList } from './Account';
import { BasketItem } from './Cart';
import { getStripe } from './stripe';
import { money } from './format';

const defaultCardId = (cards) => {
  const card = cards.find((c) => c.isDefault) || cards[0];
  return card ? card.id : null;
};

const Checkout = () => {
  const { cart, refreshCart } = useApp();
  const history = useHistory();
  const [account, setAccount] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [editingBilling, setEditingBilling] = useState(false);
  const [addingCard, setAddingCard] = useState(false);
  const [cardId, setCardId] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    Promise.all([getAccount(), refreshCart()])
      .then(([result]) => {
        setAccount(result);
        setCardId(defaultCardId(result.cards));
      })
      .catch((err) => setLoadError(errorMessage(err)));
  }, [refreshCart]);

  if (loadError) return <Alert variant='danger'>{loadError}</Alert>;
  if (!account) {
    return (
      <div className='page-loading'>
        <Spinner animation='border' />
      </div>
    );
  }
  if (cart.items.length === 0 && !paying) return <Redirect to='/basket' />;

  const { user, billing, cards } = account;
  const unavailable = cart.items.filter((pet) => !pet.available);
  const canPay = billing && cardId && confirmed && !unavailable.length && !editingBilling && !paying;

  const handleCardSaved = (next) => {
    const known = new Set(cards.map((c) => c.id));
    const added = next.cards.find((c) => !known.has(c.id));
    setAccount(next);
    setCardId(added ? added.id : defaultCardId(next.cards));
    setAddingCard(false);
  };

  const handlePay = async () => {
    setPaying(true);
    setPayError('');
    try {
      let result = await checkout(cardId);
      if (result.requiresAction) {
        // 3D Secure: Stripe shows its authentication window, then we record the order
        const stripe = await getStripe();
        const { error } = await stripe.confirmCardPayment(result.clientSecret);
        if (error) throw new Error(error.message);
        result = await completeCheckout(result.paymentIntentId);
      }
      await refreshCart();
      history.replace(`/orders/${result.order.id}`, { justPlaced: true });
    } catch (err) {
      setPayError(err.response ? errorMessage(err) : err.message);
      setPaying(false);
      refreshCart();
    }
  };

  return (
    <div className='checkout-page'>
      <h1 className='page-title'>Checkout</h1>
      <div className='basket-layout'>
        <div>
          <Card className='account-section'>
            <Card.Header>
              1. Billing address
              {billing && !editingBilling && (
                <Button size='sm' variant='link' onClick={() => setEditingBilling(true)}>
                  Change
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {!billing || editingBilling ? (
                <BillingForm
                  billing={billing}
                  fallbackName={`${user.first_name} ${user.last_name}`}
                  onSaved={(saved) => {
                    setAccount({ ...account, billing: saved });
                    setEditingBilling(false);
                  }}
                  onCancel={billing ? () => setEditingBilling(false) : null}
                />
              ) : (
                <AddressBlock billing={billing} />
              )}
            </Card.Body>
          </Card>

          <Card className='account-section'>
            <Card.Header>
              2. Payment
              {cards.length > 0 && !addingCard && billing && (
                <Button size='sm' variant='link' onClick={() => setAddingCard(true)}>
                  Use a new card
                </Button>
              )}
            </Card.Header>
            <Card.Body>
              {cards.length > 0 && (
                <CardList
                  cards={cards}
                  selectable
                  selectedId={cardId}
                  onSelect={setCardId}
                  onChange={setAccount}
                />
              )}
              {!billing ? (
                <p className='text-muted mb-0'>Save your billing address first.</p>
              ) : addingCard || cards.length === 0 ? (
                <AddCardForm
                  billing={billing}
                  email={user.email}
                  onSaved={handleCardSaved}
                  onCancel={cards.length ? () => setAddingCard(false) : null}
                />
              ) : null}
            </Card.Body>
          </Card>

          <Card className='account-section'>
            <Card.Header>3. Review your adoption</Card.Header>
            <Card.Body>
              <ul className='basket-list compact'>
                {cart.items.map((pet) => (
                  <BasketItem key={pet.id} pet={pet} />
                ))}
              </ul>
              {unavailable.length > 0 && (
                <Alert variant='warning' className='mb-0'>
                  Some pets were adopted by someone else. <Link to='/basket'>Update your basket</Link>
                </Alert>
              )}
            </Card.Body>
          </Card>
        </div>

        <aside className='order-summary'>
          <h2>Order total</h2>
          <div className='summary-row'>
            <span>
              Adoption fees ({cart.items.length} {cart.items.length === 1 ? 'pet' : 'pets'})
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
          <Form.Check
            className='confirm-check'
            id='confirm-adoption'
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            label={`I want to adopt ${cart.items.length === 1 ? 'this pet' : 'these pets'} and authorize a charge of ${money(cart.total)}.`}
          />
          {payError && (
            <Alert variant='danger' className='small'>
              {payError}
            </Alert>
          )}
          <Button variant='brand' size='lg' block disabled={!canPay} onClick={handlePay}>
            {paying ? (
              <>
                <Spinner as='span' animation='border' size='sm' /> Processing...
              </>
            ) : (
              `Place order · ${money(cart.total)}`
            )}
          </Button>
          <p className='small text-muted mt-2 mb-0'>
            Sandbox mode: no real money is charged.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
