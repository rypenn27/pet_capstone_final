import React, { useState } from 'react';
import { Link, useHistory, useLocation } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Col from 'react-bootstrap/Col';
import { register, errorMessage } from '../api';
import { useApp } from './AppContext';

const Signup = () => {
  const { startSession } = useApp();
  const history = useHistory();
  const { state = {} } = useLocation();
  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirm: '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const update = (e) => setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fields.password !== fields.confirm) {
      setError('Passwords do not match.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const { confirm, ...body } = fields;
      await startSession(await register(body));
      // New accounts go to the account page to add billing details and a card
      history.replace('/account', { welcome: true, from: state && state.from });
    } catch (err) {
      setError(errorMessage(err));
      setSaving(false);
    }
  };

  return (
    <div className='auth-card'>
      <h1 className='page-title'>Create an account</h1>
      {error && <Alert variant='danger'>{error}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Row>
          <Form.Group as={Col} controlId='signup-first'>
            <Form.Label>First name</Form.Label>
            <Form.Control name='firstName' value={fields.firstName} onChange={update} autoComplete='given-name' required />
          </Form.Group>
          <Form.Group as={Col} controlId='signup-last'>
            <Form.Label>Last name</Form.Label>
            <Form.Control name='lastName' value={fields.lastName} onChange={update} autoComplete='family-name' required />
          </Form.Group>
        </Form.Row>
        <Form.Group controlId='signup-username'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            name='username'
            value={fields.username}
            onChange={update}
            autoComplete='username'
            pattern='[A-Za-z0-9_.\-]{3,50}'
            title='3 to 50 letters, numbers, dots, dashes or underscores'
            required
          />
        </Form.Group>
        <Form.Group controlId='signup-email'>
          <Form.Label>Email</Form.Label>
          <Form.Control type='email' name='email' value={fields.email} onChange={update} autoComplete='email' required />
        </Form.Group>
        <Form.Group controlId='signup-phone'>
          <Form.Label>
            Phone <span className='text-muted'>(optional)</span>
          </Form.Label>
          <Form.Control type='tel' name='phone' value={fields.phone} onChange={update} autoComplete='tel' />
        </Form.Group>
        <Form.Row>
          <Form.Group as={Col} controlId='signup-password'>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type='password'
              name='password'
              value={fields.password}
              onChange={update}
              autoComplete='new-password'
              minLength={8}
              required
            />
            <Form.Text className='text-muted'>At least 8 characters.</Form.Text>
          </Form.Group>
          <Form.Group as={Col} controlId='signup-confirm'>
            <Form.Label>Confirm password</Form.Label>
            <Form.Control
              type='password'
              name='confirm'
              value={fields.confirm}
              onChange={update}
              autoComplete='new-password'
              required
            />
          </Form.Group>
        </Form.Row>
        <Button type='submit' variant='brand' block disabled={saving}>
          {saving ? 'Creating account...' : 'Create account'}
        </Button>
      </Form>
      <p className='mt-3 mb-0 text-center'>
        Already have an account? <Link to={{ pathname: '/login', state }}>Log in</Link>
      </p>
    </div>
  );
};

export default Signup;
