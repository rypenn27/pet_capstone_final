import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { getSomething } from '../api';

const Cart = (props) => {
  const cart = props.cart;
  const setCart = props.setCart;
  const showCart = props.showCart;
  const setShowCart = props.setShowCart;
  const closeCart = props.closeCart;
  const setCloseCart = props.setCloseCart;

  return (
    <>
      <Modal
        show={show}
        onHide={setCloseCart}
        backdrop='static'
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>Meet your new family member!</Modal.Body>
        <Modal.Footer>
          <Button variant='flat' onClick={setCloseCart}>
            Keep Searching!
          </Button>
          <Button variant='flat'>Checkout</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// render(<Cart />);

export default Cart;
