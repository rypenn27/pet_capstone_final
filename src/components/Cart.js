import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
// import { getSomething } from '../api';

const Cart = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant='flat' onClick={handleShow}>
        Basket <i className='fas fa-paw'></i>
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Your Basket</Modal.Title>
        </Modal.Header>
        <Modal.Body>Basket is Empty!</Modal.Body>
        <Modal.Footer>
          <Button variant='flat' onClick={handleClose}>
            Keep Looking!
          </Button>
          <Button variant='flat' onClick={handleClose}>
            Take Me Home!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Cart;
