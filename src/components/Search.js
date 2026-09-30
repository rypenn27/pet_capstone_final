import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

// Searches by breed, name or color
const Search = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value === '') onSearch('');
  };

  return (
    <Form className='searching' onSubmit={handleSubmit}>
      <Form.Control
        className='search'
        type='search'
        value={query}
        onChange={handleChange}
        placeholder='Search by breed, name or color...'
        aria-label='Search pets'
      />
      <Button type='submit' variant='brand' className='searchButton'>
        Search <i className='fas fa-paw'></i>
      </Button>
    </Form>
  );
};

export default Search;
