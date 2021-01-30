import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Header, Home, Cart } from '.';

const App = () => {
  const [pets, setPets] = useState([]);
  const [cart, setCart] = useState(false);
  const [showCart, setShowCart] = useState(null);
  const [closeCart, setCloseCart] = useState(null);

  return (
    <>
      <Header pets={pets} setPets={setPets} />
      <Home pets={pets} setPets={setPets} />
      <Cart
        cart={cart}
        setCart={setCart}
        showCart={showCart}
        setShowCart={setShowCart}
        closeCart={closeCart}
        setCloseCart={setCloseCart}
      />
    </>
  );
};

export default App;
