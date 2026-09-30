import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import { saveBilling, errorMessage } from '../api';

const fromBilling = (billing, fallbackName) => ({
  fullName: (billing && billing.full_name) || fallbackName || '',
  line1: (billing && billing.line1) || '',
  line2: (billing && billing.line2) || '',
  city: (billing && billing.city) || '',
  state: (billing && billing.state) || '',
  postalCode: (billing && billing.postal_code) || '',
  country: (billing && billing.country) || 'US',
});

const BillingForm = ({ billing, fallbackName, onSaved, onCancel }) => {
  const [fields, setFields] = useState(fromBilling(billing, fallbackName));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (e) => setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const result = await saveBilling(fields);
      onSaved(result.billing);
    } catch (err) {
      setError(errorMessage(err));
    }
    setSaving(false);
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant='danger'>{error}</Alert>}
      <Form.Group controlId='billing-name'>
        <Form.Label>Full name</Form.Label>
        <Form.Control name='fullName' value={fields.fullName} onChange={update} autoComplete='name' required />
      </Form.Group>
      <Form.Group controlId='billing-line1'>
        <Form.Label>Street address</Form.Label>
        <Form.Control name='line1' value={fields.line1} onChange={update} autoComplete='address-line1' required />
      </Form.Group>
      <Form.Group controlId='billing-line2'>
        <Form.Label>
          Apartment, suite, etc. <span className='text-muted'>(optional)</span>
        </Form.Label>
        <Form.Control name='line2' value={fields.line2} onChange={update} autoComplete='address-line2' />
      </Form.Group>
      <Form.Row>
        <Form.Group as={Col} sm={5} controlId='billing-city'>
          <Form.Label>City</Form.Label>
          <Form.Control name='city' value={fields.city} onChange={update} autoComplete='address-level2' required />
        </Form.Group>
        <Form.Group as={Col} sm={3} controlId='billing-state'>
          <Form.Label>State</Form.Label>
          <Form.Control name='state' value={fields.state} onChange={update} autoComplete='address-level1' required />
        </Form.Group>
        <Form.Group as={Col} sm={4} controlId='billing-zip'>
          <Form.Label>ZIP code</Form.Label>
          <Form.Control name='postalCode' value={fields.postalCode} onChange={update} autoComplete='postal-code' required />
        </Form.Group>
      </Form.Row>
      <Form.Group controlId='billing-country'>
        <Form.Label>Country code</Form.Label>
        <Form.Control
          name='country'
          value={fields.country}
          onChange={update}
          autoComplete='country'
          maxLength={2}
          className='input-short'
          required
        />
      </Form.Group>
      <div className='form-actions'>
        {onCancel && (
          <Button variant='outline-secondary' onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
        )}
        <Button type='submit' variant='brand' disabled={saving}>
          {saving ? 'Saving...' : 'Save billing address'}
        </Button>
      </div>
    </Form>
  );
};

export default BillingForm;
