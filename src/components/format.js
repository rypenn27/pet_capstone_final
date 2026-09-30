const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export const money = (amount) => currency.format(Number(amount));

export const cardLabel = (brand, last4) => {
  const names = { visa: 'Visa', mastercard: 'Mastercard', amex: 'American Express', discover: 'Discover' };
  return `${names[brand] || brand || 'Card'} ending in ${last4}`;
};

export const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
