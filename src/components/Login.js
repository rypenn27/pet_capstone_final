import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { login, errorMessage } from '../api';
import { useApp } from './AppContext';

const Login = () => {
  const { startSession } = useApp();
  const history = useHistory();
  const { state = {} } = useLocation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await startSession(await login(username, password));
      history.replace((state && state.from) || '/');
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div className='auth-card'>
      <h1 className='page-title'>Log in</h1>
      {state && state.message && <Alert variant='info'>{state.message}</Alert>}
      {error && <Alert variant='danger'>{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId='login-username'>
          <Form.Label>Username or email</Form.Label>
          <Form.Control
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete='username'
            required
            autoFocus
          />
        </Form.Group>
        <Form.Group controlId='login-password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete='current-password'
            required
          />
        </Form.Group>
        <Button type='submit' variant='brand' block disabled={saving}>
          {saving ? 'Logging in...' : 'Log in'}
        </Button>
      </Form>
      <p className='mt-3 mb-0 text-center'>
        New here?{' '}
        <Link to={{ pathname: '/register', state }}>Create an account</Link>
      </p>
    </div>
  );
};

export default Login;
