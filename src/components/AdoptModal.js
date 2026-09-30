import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { addToCart, errorMessage } from '../api';
import { useApp } from './AppContext';
import { petImage } from './petImages';
import { money } from './format';

// Shows the adoption fee and asks the user to confirm before adding the pet to the basket
const AdoptModal = ({ pet, onClose, onAdded }) => {
  const { setCart } = useApp();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleConfirm = async () => {
    setSaving(true);
    setError('');
    try {
      setCart(await addToCart(pet.id));
      onAdded(pet);
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Adopt {pet.name}?</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='adopt-summary'>
          <img src={petImage(pet.breed)} alt={pet.breed} />
          <dl>
            <dt>Breed</dt>
            <dd>{pet.breed}</dd>
            <dt>Age</dt>
            <dd>
              {pet.age} {pet.age === 1 ? 'year' : 'years'}
            </dd>
            <dt>Gender</dt>
            <dd>{pet.gender}</dd>
            <dt>Color</dt>
            <dd>{pet.color}</dd>
          </dl>
        </div>
        <table className='table table-sm price-table'>
          <tbody>
            <tr>
              <td>Adoption fee</td>
              <td className='text-right'>{money(pet.price)}</td>
            </tr>
            <tr>
              <td>Sales tax</td>
              <td className='text-right'>{money(0)}</td>
            </tr>
            <tr className='total-row'>
              <td>Total due at checkout</td>
              <td className='text-right'>{money(pet.price)}</td>
            </tr>
          </tbody>
        </table>
        <p className='text-muted small mb-0'>
          {pet.name} will be held in your basket until you check out. You won't be charged yet.
        </p>
        {error && (
          <Alert variant='danger' className='mt-3 mb-0'>
            {error}
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant='outline-secondary' onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button variant='brand' onClick={handleConfirm} disabled={saving}>
          {saving ? 'Adding...' : `Confirm & add to basket`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AdoptModal;
