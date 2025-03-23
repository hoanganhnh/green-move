/**
 * Format currency
 * @param {number} amount
 * @returns {string}
 */
export const formatCurrencyFormat = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};
