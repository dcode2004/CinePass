/**
 * Format a date string to a readable format.
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

/**
 * Format duration in minutes to "Xh Ym" format.
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m > 0 ? `${m}m` : ''}`.trim() : `${m}m`;
};

/**
 * Format currency in INR.
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
};

/**
 * Generate seat label from row index and column index (e.g., A1, B3).
 */
export const getSeatLabel = (rowIndex, colIndex) => {
  const row = String.fromCharCode(65 + rowIndex); // A, B, C...
  return `${row}${colIndex + 1}`;
};

/**
 * Truncate text to a given length.
 */
export const truncate = (text, length = 100) => {
  if (!text) return '';
  return text.length > length ? `${text.slice(0, length)}...` : text;
};
