import React from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { useApp } from './AppContext';

const Header = () => {
  const { user, cart, logout } = useApp();
  const history = useHistory();

  const handleLogout = () => {
    logout();
    history.push('/');
  };

  return (
    <header className='site-header'>
      <div className='container header-inner'>
        <Link to='/' className='logo'>
          <i className='fas fa-dog'></i> Pet Rescuers
          <span className='tagline'>Find Your Forever Friend!</span>
        </Link>
        <nav className='site-nav'>
          <NavLink exact to='/'>
            Adopt
          </NavLink>
          {user ? (
            <>
              <NavLink to='/orders'>My Adoptions</NavLink>
              <NavLink to='/account'>
                <i className='fas fa-user'></i> {user.first_name}
              </NavLink>
              <button type='button' className='link-button' onClick={handleLogout}>
                Log out
              </button>
            </>
          ) : (
            <>
              <NavLink to='/login'>Log in</NavLink>
              <NavLink to='/register'>Register</NavLink>
            </>
          )}
          <NavLink to='/basket' className='basket-link'>
            <i className='fas fa-paw'></i> Basket
            {cart.items.length > 0 && <span className='badge-count'>{cart.items.length}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default Header;
