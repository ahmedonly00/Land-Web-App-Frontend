export const formatPrice = (price, currency = 'RWF') => {
  if (!price) return 'N/A';
  
  const formatted = new Intl.NumberFormat('en-RW', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
  
  return formatted;
};

export const formatSize = (size, unit = 'sqm') => {
  if (!size) return 'N/A';
  return `${size.toLocaleString()} ${unit}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const getStatusBadgeColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'AVAILABLE':
      return 'bg-green-100 text-green-800';
    case 'SOLD':
      return 'bg-red-100 text-red-800';
    case 'RESERVED':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};
