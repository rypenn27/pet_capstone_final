import React from 'react';
import { BrowserRouter, Redirect, Route, Switch, useLocation } from 'react-router-dom';
import Spinner from 'react-bootstrap/Spinner';

import { AppProvider, useApp } from './AppContext';
import { Header, Home, Login, Signup, Account, Cart, Checkout, Orders, OrderDetail } from '.';

// Sends logged-out visitors to the login page, then back here afterwards
const PrivateRoute = ({ children, ...rest }) => {
  const { user, loading } = useApp();
  const location = useLocation();
  return (
    <Route {...rest}>
      {loading ? (
        <div className='page-loading'>
          <Spinner animation='border' />
        </div>
      ) : user ? (
        children
      ) : (
        <Redirect to={{ pathname: '/login', state: { from: location.pathname } }} />
      )}
    </Route>
  );
};

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <Header />
      <main className='container page'>
        <Switch>
          <Route exact path='/'>
            <Home />
          </Route>
          <Route path='/login'>
            <Login />
          </Route>
          <Route path='/register'>
            <Signup />
          </Route>
          <PrivateRoute path='/account'>
            <Account />
          </PrivateRoute>
          <PrivateRoute path='/basket'>
            <Cart />
          </PrivateRoute>
          <PrivateRoute path='/checkout'>
            <Checkout />
          </PrivateRoute>
          <PrivateRoute exact path='/orders'>
            <Orders />
          </PrivateRoute>
          <PrivateRoute path='/orders/:id'>
            <OrderDetail />
          </PrivateRoute>
          <Redirect to='/' />
        </Switch>
      </main>
      <footer className='site-footer'>
        Pet Rescuers is a simulated store. Payments run in Stripe's sandbox; no real money
        moves and no real pets are adopted.
      </footer>
    </BrowserRouter>
  </AppProvider>
);

export default App;
