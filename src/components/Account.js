import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import Spinner from 'react-bootstrap/Spinner';

import { getAccount, updateProfile, setDefaultCard, deleteCard, errorMessage } from '../api';
import { useApp } from './AppContext';
import { BillingForm, AddCardForm } from '.';
import { cardLabel } from './format';

export const AddressBlock = ({ billing }) => (
  <address className='mb-0'>
    {billing.full_name}
    <br />
    {billing.line1}
    {billing.line2 && (
      <>
        <br />
        {billing.line2}
      </>
    )}
    <br />
    {billing.city}, {billing.state} {billing.postal_code}
    <br />
    {billing.country}
  </address>
);

const ProfileForm = ({ user, onSaved, onCancel }) => {
  const [fields, setFields] = useState({
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    phone: user.phone || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const update = (e) => setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      onSaved(await updateProfile(fields));
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant='danger'>{error}</Alert>}
      <Form.Row>
        <Form.Group as={Col} controlId='profile-first'>
          <Form.Label>First name</Form.Label>
          <Form.Control name='firstName' value={fields.firstName} onChange={update} required />
        </Form.Group>
        <Form.Group as={Col} controlId='profile-last'>
          <Form.Label>Last name</Form.Label>
          <Form.Control name='lastName' value={fields.lastName} onChange={update} required />
        </Form.Group>
      </Form.Row>
      <Form.Group controlId='profile-email'>
        <Form.Label>Email</Form.Label>
        <Form.Control type='email' name='email' value={fields.email} onChange={update} required />
      </Form.Group>
      <Form.Group controlId='profile-phone'>
        <Form.Label>Phone</Form.Label>
        <Form.Control type='tel' name='phone' value={fields.phone} onChange={update} />
      </Form.Group>
      <div className='form-actions'>
        <Button variant='outline-secondary' onClick={onCancel} disabled={saving}>
          Cancel
        </Button>
        <Button type='submit' variant='brand' disabled={saving}>
          {saving ? 'Saving...' : 'Save profile'}
        </Button>
      </div>
    </Form>
  );
};

export const CardList = ({ cards, onChange, selectable, selectedId, onSelect }) => {
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const run = async (id, action) => {
    setBusyId(id);
    setError('');
    try {
      onChange(await action(id));
    } catch (err) {
      setError(errorMessage(err));
    }
    setBusyId(null);
  };

  return (
    <>
      {error && <Alert variant='danger'>{error}</Alert>}
      <ul className='card-list'>
        {cards.map((card) => (
          <li key={card.id} className={selectable && selectedId === card.id ? 'selected' : ''}>
            {selectable ? (
              <Form.Check
                type='radio'
                id={`card-${card.id}`}
                name='payment-card'
                checked={selectedId === card.id}
                onChange={() => onSelect(card.id)}
                label={<CardSummary card={card} />}
              />
            ) : (
              <CardSummary card={card} />
            )}
            {!selectable && (
              <div className='card-actions'>
                {!card.isDefault && (
                  <Button size='sm' variant='link' disabled={busyId === card.id} onClick={() => run(card.id, setDefaultCard)}>
                    Make default
                  </Button>
                )}
                <Button size='sm' variant='link' className='text-danger' disabled={busyId === card.id} onClick={() => run(card.id, deleteCard)}>
                  Remove
                </Button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </>
  );
};

const CardSummary = ({ card }) => (
  <span className='card-summary'>
    <i
      className={`${
        ['visa', 'mastercard', 'amex', 'discover'].includes(card.brand)
          ? `fab fa-cc-${card.brand}`
          : 'fas fa-credit-card'
      } card-icon`}
    ></i>
    <span>
      <strong>{cardLabel(card.brand, card.last4)}</strong>
      {card.isDefault && <span className='badge badge-light ml-2'>Default</span>}
      <br />
      <small className='text-muted'>
        {card.cardholderName ? `${card.cardholderName} · ` : ''}Expires {String(card.expMonth).padStart(2, '0')}/{card.expYear}
      </small>
    </span>
  </span>
);

const Account = () => {
  const { setUser, cart } = useApp();
  const { state } = useLocation();
  const [account, setAccount] = useState(null);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null); // profile | billing | card

  useEffect(() => {
    getAccount()
      .then(setAccount)
      .catch((err) => setError(errorMessage(err)));
  }, []);

  const applyAccount = (next) => {
    setAccount(next);
    setUser(next.user);
    setEditing(null);
  };

  if (error) return <Alert variant='danger'>{error}</Alert>;
  if (!account) {
    return (
      <div className='page-loading'>
        <Spinner animation='border' />
      </div>
    );
  }

  const { user, billing, cards } = account;
  const readyToCheckout = billing && cards.length > 0;

  return (
    <div className='account-page'>
      <h1 className='page-title'>My account</h1>
      {state && state.welcome && !readyToCheckout && (
        <Alert variant='success'>
          Welcome, {user.first_name}! Add your billing address and a card so you're ready to check out.
        </Alert>
      )}
      {readyToCheckout && cart.items.length > 0 && (
        <Alert variant='info'>
          You're all set. <Link to='/checkout'>Continue to checkout</Link>
        </Alert>
      )}

      <Card className='account-section'>
        <Card.Header>
          Profile
          {editing !== 'profile' && (
            <Button size='sm' variant='link' onClick={() => setEditing('profile')}>
              Edit
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {editing === 'profile' ? (
            <ProfileForm user={user} onSaved={applyAccount} onCancel={() => setEditing(null)} />
          ) : (
            <dl className='profile-list'>
              <dt>Name</dt>
              <dd>
                {user.first_name} {user.last_name}
              </dd>
              <dt>Username</dt>
              <dd>{user.username}</dd>
              <dt>Email</dt>
              <dd>{user.email}</dd>
              <dt>Phone</dt>
              <dd>{user.phone || <span className='text-muted'>Not provided</span>}</dd>
            </dl>
          )}
        </Card.Body>
      </Card>

      <Card className='account-section'>
        <Card.Header>
          Billing address
          {billing && editing !== 'billing' && (
            <Button size='sm' variant='link' onClick={() => setEditing('billing')}>
              Edit
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {editing === 'billing' || !billing ? (
            <BillingForm
              billing={billing}
              fallbackName={`${user.first_name} ${user.last_name}`}
              onSaved={(saved) => applyAccount({ ...account, billing: saved })}
              onCancel={billing ? () => setEditing(null) : null}
            />
          ) : (
            <AddressBlock billing={billing} />
          )}
        </Card.Body>
      </Card>

      <Card className='account-section'>
        <Card.Header>
          Payment cards
          {cards.length > 0 && editing !== 'card' && (
            <Button size='sm' variant='link' onClick={() => setEditing('card')}>
              Add a card
            </Button>
          )}
        </Card.Header>
        <Card.Body>
          {cards.length > 0 && <CardList cards={cards} onChange={applyAccount} />}
          {!billing ? (
            <p className='text-muted mb-0'>Save your billing address first, then add a card.</p>
          ) : editing === 'card' || cards.length === 0 ? (
            <AddCardForm
              billing={billing}
              email={user.email}
              onSaved={applyAccount}
              onCancel={cards.length ? () => setEditing(null) : null}
            />
          ) : null}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Account;
