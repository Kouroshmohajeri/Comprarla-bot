// lib/converter.js

/**
 * Converts a given price based on a fixed conversion rate.
 * @param {number} price - The price to convert.
 * @param {number} fixedPrice - The fixed price to use for conversion.
 * @returns {number} - The converted price.
 */
export const convertPrice = (price, fixedPrice) => {
  if (isNaN(price) || price <= 0) {
    return 0;
  }
  return price * fixedPrice;
};
