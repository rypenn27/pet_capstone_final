import React, { useEffect, useRef, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { createSetupIntent, saveCard, errorMessage } from '../api';
import { getStripe } from './stripe';

export const TestCardHelp = () => (
  <div className='test-card-help'>
    <strong>Sandbox test cards</strong> (any future expiry date, any CVC, any ZIP):
    <ul>
      <li>
        <code>4242 4242 4242 4242</code> pays successfully
      </li>
      <li>
        <code>4000 0025 0000 3155</code> asks for 3D Secure authentication
      </li>
      <li>
        <code>4000 0000 0000 0341</code> saves, but is declined at checkout
      </li>
    </ul>
  </div>
);

// Collects a card with Stripe Elements and saves it to the user's Stripe customer.
// The card number goes straight from the browser to Stripe; our server never sees it.
const AddCardForm = ({ billing, email, onSaved, onCancel }) => {
  const mountRef = useRef(null);
  const cardRef = useRef(null);
  const [stripe, setStripe] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | unavailable
  const [name, setName] = useState((billing && billing.full_name) || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let card;
    let cancelled = false;
    getStripe()
      .then((instance) => {
        if (cancelled) return;
        if (!instance) {
          setStatus('unavailable');
          return;
        }
        card = instance.elements().create('card', {
          hidePostalCode: Boolean(billing && billing.postal_code),
          style: { base: { fontSize: '16px', color: '#212529', '::placeholder': { color: '#8a8f98' } } },
        });
        card.mount(mountRef.current);
        card.on('change', (event) => setError(event.error ? event.error.message : ''));
        cardRef.current = card;
        setStripe(instance);
        setStatus('ready');
      })
      .catch(() => !cancelled && setStatus('unavailable'));
    return () => {
      cancelled = true;
      if (card) card.destroy();
    };
  }, [billing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const { clientSecret } = await createSetupIntent();
      const address = billing
        ? {
            line1: billing.line1,
            line2: billing.line2 || undefined,
            city: billing.city,
            state: billing.state,
            postal_code: billing.postal_code,
            country: billing.country,
          }
        : undefined;
      const result = await stripe.confirmCardSetup(clientSecret, {
        payment_method: {
          card: cardRef.current,
          billing_details: { name, email, address },
        },
      });
      if (result.error) {
        setError(result.error.message);
        setSaving(false);
        return;
      }
      onSaved(await saveCard(result.setupIntent.payment_method));
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  if (status === 'unavailable') {
    return (
      <Alert variant='warning' className='mb-0'>
        Card payments aren't set up yet. Add the Stripe sandbox keys to <code>.env</code> and
        restart the server.
      </Alert>
    );
  }

  return (
    <Form onSubmit={handleSubmit} className='add-card-form'>
      <Form.Group controlId='card-name'>
        <Form.Label>Name on card</Form.Label>
        <Form.Control value={name} onChange={(e) => setName(e.target.value)} autoComplete='cc-name' required />
      </Form.Group>
      <Form.Group>
        <Form.Label>Card details</Form.Label>
        <div ref={mountRef} className='stripe-card-element' />
      </Form.Group>
      <TestCardHelp />
      {error && <Alert variant='danger'>{error}</Alert>}
      <div className='form-actions'>
        {onCancel && (
          <Button variant='outline-secondary' onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        )}
        <Button type='submit' variant='brand' disabled={saving || status !== 'ready'}>
          {saving ? 'Saving card...' : 'Save card'}
        </Button>
      </div>
    </Form>
  );
};

export default AddCardForm;
