// lib/converter.js

/**
 * Converts a given price based on specific percentage adjustments and a fixed conversion rate.
 * @param {number} price - The price to convert.
 * @param {number} fixedPrice - The fixed price to use for conversion.
 * @returns {number} - The converted price.
 */
export const convertPrice = (price, fixedPrice) => {
  if (isNaN(price) || price <= 0) {
    return 0;
  }

  let adjustedPrice = price;
  if (price <= 100 && price <= 250) {
    adjustedPrice += price * 0.3;
  } else if (price >= 251) {
    adjustedPrice += price * 0.25;
  }
  // Apply the percentage adjustment based on the price range
  // if (price <= 110) {
  //   adjustedPrice += price * 0.5; // Add 50%
  // } else if (price <= 310) {
  //   adjustedPrice += price * 0.4; // Add 40%
  // } else if (price <= 610) {
  //   adjustedPrice += price * 0.3; // Add 30%
  // } else if (price <= 1000) {
  //   adjustedPrice += price * 0.25; // Add 25%
  // } else {
  //   adjustedPrice += price * 0.2; // Add 20%
  // }

  // Multiply the adjusted price by the fixed conversion rate
  let totalPrice = adjustedPrice * fixedPrice;
  if (price <= 250) {
    totalPrice += 30 * fixedPrice;
  } else {
    totalPrice += 15 * fixedPrice;
  }
  return totalPrice;
};
